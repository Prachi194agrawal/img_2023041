from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import os
import numpy as np
from typing import Dict, Any

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the model
model_path = os.getenv('MODEL_PATH', 'fraud_model.pkl')
try:
    model = joblib.load(model_path)
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

class Transaction(BaseModel):
    amount: float
    merchant: str
    location: str
    transaction_type: str

def extract_features(transaction: Dict[str, Any]) -> np.ndarray:
    """Extract features from transaction data."""
    features = []
    
    # Amount feature
    features.append(transaction['amount'])
    
    # High-risk merchant feature
    high_risk_merchants = {'Unknown'}
    features.append(1 if transaction['merchant'] in high_risk_merchants else 0)
    
    # High-risk location feature
    high_risk_locations = {'Nigeria', 'Romania', 'Unknown', 'Anonymous'}
    features.append(1 if transaction['location'] in high_risk_locations else 0)
    
    # Transaction type feature (one-hot encoding)
    transaction_types = ['PURCHASE', 'TRANSFER', 'WITHDRAWAL', 'DEPOSIT']
    features.extend([1 if t == transaction['transaction_type'] else 0 for t in transaction_types])
    
    return np.array(features).reshape(1, -1)

@app.get("/health")
async def health_check():
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    return {"status": "healthy"}

@app.post("/predict")
async def predict_fraud(transaction: Dict[str, Any]):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Extract features
        features = extract_features(transaction)
        
        # Make prediction
        prediction = model.predict(features)[0]
        probability = model.predict_proba(features)[0][1]
        
        return {
            "transaction_id": transaction.get('transaction_id'),
            "prediction": bool(prediction),
            "probability": float(probability),
            "risk_score": float(probability * 100)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) 