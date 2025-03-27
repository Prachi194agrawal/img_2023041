FROM python:3.9-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY . .

# Environment variables
ENV KAFKA_BOOTSTRAP_SERVERS=kafka:9092
ENV KAFKA_TRANSACTION_TOPIC=bank_transactions
ENV AI_SERVICE_URL=http://ai-service:5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/health')"

CMD ["python", "kafka_consumer.py"]
