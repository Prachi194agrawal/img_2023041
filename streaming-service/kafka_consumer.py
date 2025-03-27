from kafka import KafkaConsumer
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import json
import os
import uvicorn
import asyncio
from typing import List
import requests

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# WebSocket connections
websocket_connections: List[WebSocket] = []

# Kafka Consumer
consumer = KafkaConsumer(
    'bank_transactions',
    bootstrap_servers=os.getenv('KAFKA_BOOTSTRAP_SERVERS', 'kafka:9092'),
    auto_offset_reset='latest',
    enable_auto_commit=True,
    group_id='transaction_group',
    value_deserializer=lambda x: json.loads(x.decode('utf-8'))
)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    websocket_connections.append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except:
        websocket_connections.remove(websocket)

async def process_messages():
    while True:
        message_batch = consumer.poll(timeout_ms=100)
        for tp, messages in message_batch.items():
            for message in messages:
                # Process transaction with AI service
                try:
                    ai_response = requests.post(
                        f"{os.getenv('AI_SERVICE_URL', 'http://ai-service:5000')}/predict",
                        json=message.value
                    )
                    result = ai_response.json()
                    
                    # Add AI prediction to message
                    message.value['fraud_prediction'] = result['prediction']
                    
                    # Broadcast to all connected clients
                    for connection in websocket_connections:
                        try:
                            await connection.send_json(message.value)
                        except:
                            websocket_connections.remove(connection)
                except Exception as e:
                    print(f"Error processing message: {e}")
        
        await asyncio.sleep(0.1)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(process_messages())

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
