from kafka import KafkaProducer
import json
import time
import numpy as np

producer = KafkaProducer(
    bootstrap_servers=['kafka:9092'],
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

while True:
    transaction = {
        'amount': np.random.randint(1000, 100000),
        'source': 'BankA',
        'destination': 'BankB',
        'timestamp': int(time.time())
    }
    producer.send('transactions', transaction)
    time.sleep(1)
