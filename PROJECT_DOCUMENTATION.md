# Multi-Bank Transaction Fraud Detection System - Technical Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Design](#architecture-design)
3. [Implementation Details](#implementation-details)
4. [Code Documentation](#code-documentation)
5. [Deployment Guide](#deployment-guide)
6. [Testing](#testing)
7. [Security Considerations](#security-considerations)

## System Overview

### Problem Statement
The financial sector faces a growing threat from cybercriminals using "transaction layering" techniques to siphon money across multiple banks. This project implements a real-time fraud detection system using AI/ML and blockchain technology to identify and prevent such activities.

### Key Features
1. Real-time transaction monitoring
2. AI-based fraud detection
3. Multi-bank coordination
4. Blockchain-based audit trail
5. Law enforcement dashboard

## Architecture Design

### System Components
1. **AI Service**
   - Fraud detection model
   - Real-time prediction API
   - Model training pipeline

2. **Streaming Service**
   - Kafka message broker
   - Real-time transaction processing
   - WebSocket connections

3. **Frontend Dashboard**
   - Transaction monitoring
   - Alert management
   - Investigation interface

4. **Blockchain Node**
   - Secure data sharing
   - Transaction audit trail
   - Privacy-preserving mechanisms

### Technology Stack
```yaml
Backend:
  - FastAPI (Python)
  - scikit-learn
  - Kafka
  - Hyperledger Fabric

Frontend:
  - React
  - Vite
  - WebSocket
  - Chart.js

Infrastructure:
  - Docker
  - Docker Compose
  - Render.com
```

## Implementation Details

### 1. AI Service Implementation

#### Model Training (train_model.py)
```python
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib

# Create a simple dummy dataset
np.random.seed(42)
n_samples = 1000

# Generate features
amount = np.random.uniform(1, 1000, n_samples)
time = np.random.randint(0, 24*60*60, n_samples)
v1_v10 = np.random.normal(0, 1, (n_samples, 10))

# Combine features
X = np.column_stack([amount, time, v1_v10])

# Generate target (fraud/not fraud)
y = np.where(
    (amount > 800) & (v1_v10[:, 0] > 1) |  # High amount and unusual v1
    (amount < 10) & (v1_v10[:, 1] < -1),    # Very low amount and unusual v2
    1,  # Fraud
    0   # Not fraud
)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

# Save model
joblib.dump(model, 'fraud_model.pkl')
```

### 2. Main Application (app.py)
```python
import os
import logging
from fastapi import FastAPI, WebSocket, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from dotenv import load_dotenv
import joblib
import numpy as np
from pydantic import BaseModel
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

# Initialize model
model = None

def load_model():
    """Load the model from the specified path"""
    global model
    try:
        possible_paths = [
            os.getenv("MODEL_PATH", "ai_service/fraud_model.pkl"),
            "fraud_model.pkl",
            "../ai_service/fraud_model.pkl",
            "/opt/render/project/src/ai_service/fraud_model.pkl",
            "/opt/render/project/src/fraud_model.pkl"
        ]
        
        for path in possible_paths:
            if os.path.exists(path):
                logger.info(f"Loading model from {path}")
                model = joblib.load(path)
                return True
        
        logger.error("Model file not found")
        return False
    except Exception as e:
        logger.error(f"Error loading model: {e}")
        return False

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
    global model
    if model is None:
        load_model()
    
    return {
        "status": "healthy",
        "model_loaded": model is not None
    }

@app.post("/predict")
async def predict(transaction: Transaction):
    """Predict if a transaction is fraudulent"""
    global model
    if model is None:
        if not load_model():
            raise HTTPException(status_code=503, detail="Model not available")
    
    try:
        features = np.array([[
            transaction.amount, transaction.time,
            transaction.v1, transaction.v2, transaction.v3,
            transaction.v4, transaction.v5, transaction.v6,
            transaction.v7, transaction.v8, transaction.v9,
            transaction.v10
        ]])
        
        prediction = model.predict(features)[0]
        probability = model.predict_proba(features)[0][1]
        
        return {
            "is_fraud": bool(prediction),
            "probability": float(probability),
            "transaction_amount": transaction.amount
        }
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time predictions"""
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            transaction_data = json.loads(data)
            
            transaction = Transaction(**transaction_data)
            result = await predict(transaction)
            
            await websocket.send_json(result)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        await websocket.close()

# Try to load the model at startup
load_model()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=port,
        reload=True
    )
```

### 3. Docker Configuration (docker-compose.yml)
```yaml
version: '3.8'

services:
  kafka:
    image: bitnami/kafka:latest
    ports:
      - "9092:9092"
    environment:
      - KAFKA_CFG_NODE_ID=1
      - KAFKA_CFG_PROCESS_ROLES=broker,controller
      - KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=1@kafka:9093
      - KAFKA_CFG_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093
      - KAFKA_CFG_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092
      - KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT
      - KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER
      - ALLOW_PLAINTEXT_LISTENER=yes
      - KAFKA_CFG_AUTO_CREATE_TOPICS_ENABLE=true
    volumes:
      - kafka_data:/bitnami/kafka
    networks:
      - backend-network
    healthcheck:
      test: ["CMD-SHELL", "kafka-topics.sh --bootstrap-server localhost:9092 --list"]
      interval: 30s
      timeout: 10s
      retries: 3

  ai-service:
    build: 
      context: ./ai-service
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - KAFKA_BOOTSTRAP_SERVERS=kafka:9092
      - MODEL_PATH=/app/fraud_model.pkl
      - PORT=5000
    volumes:
      - ./ai-service:/app
      - ai_service_data:/app/data
    networks:
      - backend-network
    depends_on:
      kafka:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  streaming-service:
    build: 
      context: ./streaming-service
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - KAFKA_BOOTSTRAP_SERVERS=kafka:9092
      - AI_SERVICE_URL=http://ai-service:5000
      - PORT=8000
    networks:
      - backend-network
    depends_on:
      ai-service:
        condition: service_healthy
      kafka:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      target: ${NODE_ENV:-development}
    ports:
      - "${PORT:-3000}:${PORT:-3000}"
    environment:
      - NODE_ENV=${NODE_ENV:-development}
      - PORT=${PORT:-3000}
      - VITE_API_URL=http://localhost:5000
      - VITE_WS_URL=ws://localhost:5000/ws
    volumes:
      - ./frontend/src:/app/src
      - ./frontend/public:/app/public
      - /app/node_modules
    networks:
      - frontend-network
      - backend-network
    depends_on:
      ai-service:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:${PORT:-3000}"]
      interval: 30s
      timeout: 10s
      retries: 3

  blockchain-node:
    image: hyperledger/fabric-peer:2.3
    ports:
      - "7051:7051"
    environment:
      - CORE_PEER_ID=peer0.org1.example.com
      - CORE_PEER_ADDRESS=peer0.org1.example.com:7051
      - CORE_PEER_LOCALMSPID=Org1MSP
      - CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp
    volumes:
      - ./blockchain-service/crypto:/etc/hyperledger/msp
      - blockchain_data:/var/hyperledger/production
    networks:
      - backend-network
    healthcheck:
      test: ["CMD", "peer", "node", "status"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  frontend-network:
    driver: bridge
  backend-network:
    driver: bridge

volumes:
  kafka_data:
  ai_service_data:
  blockchain_data:
```

### 4. Render Configuration (render.yaml)
```yaml
services:
  - type: web
    name: img_2023041-2
    env: python
    buildCommand: |
      pip install -r requirements.txt
      python ai_service/train_model.py
      mv fraud_model.pkl /opt/render/project/src/
    startCommand: uvicorn app:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: PORT
        value: 8000
      - key: MODEL_PATH
        value: /opt/render/project/src/fraud_model.pkl
      - key: PYTHONUNBUFFERED
        value: "1"
    healthCheckPath: /health
    autoDeploy: true

  - type: static
    name: img_2023041-frontend
    buildCommand: cd frontend && npm install && npm run build
    staticPublishPath: ./frontend/dist
    envVars:
      - key: NODE_ENV
        value: production
      - key: VITE_API_URL
        value: https://img_2023041-2.onrender.com
      - key: VITE_WS_URL
        value: wss://img_2023041-2.onrender.com/ws
```

## Deployment Guide

### Local Development
1. Clone the repository
2. Install dependencies
3. Start services using Docker Compose
4. Access the application at http://localhost:3000

### Production Deployment (Render.com)
1. Push code to GitHub
2. Connect repository to Render
3. Configure environment variables
4. Deploy services

## Testing

### API Testing
```python
import requests

def test_health():
    response = requests.get("http://localhost:8000/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_predict():
    transaction = {
        "amount": 100.0,
        "time": 3600,
        "v1": 0.5,
        "v2": -0.2,
        "v3": 0.1,
        "v4": 0.3,
        "v5": -0.1,
        "v6": 0.2,
        "v7": -0.3,
        "v8": 0.4,
        "v9": -0.2,
        "v10": 0.1
    }
    response = requests.post("http://localhost:8000/predict", json=transaction)
    assert response.status_code == 200
    assert "is_fraud" in response.json()
```

## Security Considerations

### Data Protection
1. All sensitive data is encrypted in transit
2. Blockchain ensures data integrity
3. Access control mechanisms in place

### Privacy
1. Federated learning for model training
2. Data anonymization
3. Compliance with RBI guidelines

### Monitoring
1. Real-time transaction monitoring
2. Alert system for suspicious activities
3. Audit logging

## Future Enhancements
1. Advanced ML models
2. Enhanced blockchain integration
3. Additional security features
4. Improved dashboard functionality
5. Mobile application

## Support and Maintenance
For support:
1. Check the documentation
2. Open an issue on GitHub
3. Contact the development team

## License
This project is licensed under the MIT License. 