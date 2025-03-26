from flask import Flask, jsonify
import joblib
import numpy as np
from kafka import KafkaConsumer

app = Flask(__name__)

# Load trained model
model = joblib.load('fraud_model.pkl')

consumer = KafkaConsumer(
    'transactions',
    bootstrap_servers=['kafka:9092'],
    auto_offset_reset='earliest'
)

def detect_fraud(transaction):
    features = [
        transaction['amount'],
        transaction['source_balance'],
        transaction['dest_balance']
    ]
    prediction = model.predict([features])
    return prediction[0] == 1

@app.route('/check', methods=['POST'])
def check_transaction():
    for message in consumer:
        transaction = message.value.decode('utf-8')
        is_fraud = detect_fraud(transaction)
        return jsonify({'fraud': is_fraud})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
