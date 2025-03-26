FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc python3-dev && \
    rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy model and code
COPY fraud_model.pkl .
COPY fraud_detection.py .

# Environment variables for Kafka
ENV KAFKA_BOOTSTRAP_SERVERS=kafka:9092
ENV MODEL_PATH=/app/fraud_model.pkl

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "fraud_detection:app"]
