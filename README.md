# Multi-Bank Transaction Fraud Detection System

## Problem Statement
Cybercriminals are increasingly using sophisticated techniques like "transaction layering" to siphon money from accounts by breaking large sums into smaller transactions across multiple banks. This makes it difficult for regulatory bodies like RBI to detect and trace fraudulent activities.

## Project Overview
This project implements a real-time fraud detection system that uses AI/ML to identify suspicious transaction patterns across multiple banks. The system features a secure, blockchain-based coordination mechanism for banks to share transaction intelligence while maintaining data privacy.

## Features
1. **Real-time Fraud Detection**
   - AI/ML-based anomaly detection
   - Pattern recognition for transaction layering
   - Real-time monitoring and alerts

2. **Multi-Bank Coordination**
   - Secure transaction data sharing
   - Privacy-preserving information exchange
   - Cross-bank transaction tracking

3. **Regulatory Integration**
   - RBI-compliant monitoring system
   - Blockchain-based audit trail
   - Federated learning for model training

4. **Law Enforcement Dashboard**
   - Real-time transaction monitoring
   - Suspicious activity visualization
   - Investigation tools

## System Architecture

### Components
1. **AI Service**
   - Fraud detection model
   - Real-time prediction
   - Model training and updates

2. **Streaming Service**
   - Real-time transaction processing
   - Kafka-based event streaming
   - WebSocket connections

3. **Frontend Dashboard**
   - Transaction monitoring
   - Alert management
   - Investigation interface

4. **Blockchain Node**
   - Secure data sharing
   - Audit trail
   - Privacy-preserving transactions

## Technology Stack
- **Backend**: FastAPI, Python
- **Frontend**: React, Vite
- **ML**: scikit-learn, RandomForestClassifier
- **Streaming**: Apache Kafka
- **Blockchain**: Hyperledger Fabric
- **Deployment**: Render.com

## Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- Docker and Docker Compose
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Prachi194agrawal/img_2023041.git
cd img_2023041
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

4. Start the services:
```bash
docker-compose up -d
```

### Environment Variables
Create a `.env` file with the following variables:
```
PORT=8000
MODEL_PATH=/app/fraud_model.pkl
KAFKA_BOOTSTRAP_SERVERS=kafka:9092
AI_SERVICE_URL=http://localhost:5000
```

## API Endpoints

### Health Check
```
GET /health
```
Returns the health status of the service and model loading status.

### Prediction
```
POST /predict
```
Predicts if a transaction is fraudulent based on its features.

### WebSocket
```
WS /ws
```
Real-time WebSocket endpoint for streaming transaction predictions.

## Deployment

### Render.com Deployment
1. Push your code to GitHub
2. Connect your repository to Render
3. Create a new Web Service
4. Configure environment variables
5. Deploy

The service will automatically:
- Train the fraud detection model
- Set up the API endpoints
- Configure the frontend

## Project Structure
```
img_2023041/
├── ai_service/
│   ├── train_model.py
│   └── fraud_model.pkl
├── streaming_service/
│   └── kafka_consumer.py
├── frontend/
│   ├── src/
│   └── public/
├── blockchain-service/
│   └── crypto/
├── app.py
├── requirements.txt
├── docker-compose.yml
└── render.yaml
```

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- Reserve Bank of India (RBI) for regulatory guidelines
- Financial institutions for domain expertise
- Open-source community for tools and libraries

## Contact
For questions or support, please open an issue in the GitHub repository. 