FROM confluentinc/cp-kafka:7.0.1

WORKDIR /app

# Install Python and dependencies
RUN apt-get update && \
    apt-get install -y python3-pip && \
    pip install kafka-python numpy

COPY kafka_producer.py .
COPY kafka_consumer.py .

# Kafka configuration
ENV KAFKA_BOOTSTRAP_SERVERS=kafka:9092
ENV KAFKA_TRANSACTION_TOPIC=bank_transactions

CMD ["python3", "kafka_producer.py"]
