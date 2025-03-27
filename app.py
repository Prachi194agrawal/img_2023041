import os
import logging
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from dotenv import load_dotenv
import joblib
import numpy as np
from pydantic import BaseModel
from typing import List, Dict, Any
import json

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Fraud Detection API",
    description="API for real-time fraud detection",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the model
MODEL_PATH = os.getenv("MODEL_PATH", "ai_service/fraud_model.pkl")
try:
    model = joblib.load(MODEL_PATH)
    logger.info(f"Model loaded successfully from {MODEL_PATH}")
except Exception as e:
    logger.error(f"Error loading model: {e}")
    model = None

class Transaction(BaseModel):
    amount: float
    time: int
    v1: float
    v2: float
    v3: float
    v4: float
    v5: float
    v6: float
    v7: float
    v8: float
    v9: float
    v10: float

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": model is not None
    }

@app.post("/predict")
async def predict(transaction: Transaction):
    """Predict if a transaction is fraudulent"""
    if model is None:
        return {"error": "Model not loaded"}
    
    try:
        # Convert transaction to numpy array
        features = np.array([[
            transaction.amount, transaction.time,
            transaction.v1, transaction.v2, transaction.v3,
            transaction.v4, transaction.v5, transaction.v6,
            transaction.v7, transaction.v8, transaction.v9,
            transaction.v10
        ]])
        
        # Make prediction
        prediction = model.predict(features)[0]
        probability = model.predict_proba(features)[0][1]
        
        return {
            "is_fraud": bool(prediction),
            "probability": float(probability),
            "transaction_amount": transaction.amount
        }
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        return {"error": str(e)}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time predictions"""
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            transaction_data = json.loads(data)
            
            # Create Transaction object
            transaction = Transaction(**transaction_data)
            
            # Get prediction
            result = await predict(transaction)
            
            # Send back the result
            await websocket.send_json(result)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        await websocket.close()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=port,
        reload=True
    ) 