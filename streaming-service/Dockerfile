FROM python:3.9-slim

WORKDIR /app

# Install curl for healthcheck
RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY . .

# Environment variables
ENV PYTHONUNBUFFERED=1
ENV KAFKA_BOOTSTRAP_SERVERS=kafka:9092
ENV KAFKA_TRANSACTION_TOPIC=bank_transactions
ENV AI_SERVICE_URL=http://ai-service:5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/health')"

# Run both producer and consumer
CMD ["sh", "-c", "python kafka_producer.py & python kafka_consumer.py"]
