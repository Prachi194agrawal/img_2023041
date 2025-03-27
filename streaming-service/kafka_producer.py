from kafka import KafkaProducer
import json
import time
import random
import os
from datetime import datetime

# Initialize Kafka producer
producer = KafkaProducer(
    bootstrap_servers=os.getenv('KAFKA_BOOTSTRAP_SERVERS', 'kafka:9092'),
    value_serializer=lambda x: json.dumps(x).encode('utf-8')
)

def generate_transaction():
    """Generate a random bank transaction."""
    transaction = {
        'transaction_id': f'TX{random.randint(10000, 99999)}',
        'amount': round(random.uniform(10, 10000), 2),
        'timestamp': datetime.now().isoformat(),
        'account_id': f'ACC{random.randint(1000, 9999)}',
        'merchant': random.choice([
            'Amazon', 'Walmart', 'Target', 'Best Buy', 
            'Apple Store', 'Netflix', 'Uber', 'Unknown'
        ]),
        'location': random.choice([
            'New York', 'Los Angeles', 'Chicago', 'Houston',
            'Phoenix', 'Philadelphia', 'San Antonio', 'Online'
        ]),
        'transaction_type': random.choice([
            'PURCHASE', 'TRANSFER', 'WITHDRAWAL', 'DEPOSIT'
        ])
    }
    
    # Simulate some suspicious patterns
    if random.random() < 0.1:  # 10% chance of suspicious transaction
        if random.random() < 0.5:
            transaction['amount'] = round(random.uniform(5000, 50000), 2)
        else:
            transaction['merchant'] = 'Unknown'
            transaction['location'] = random.choice([
                'Nigeria', 'Romania', 'Unknown', 'Anonymous'
            ])
    
    return transaction

def main():
    """Main function to produce transactions."""
    print("Starting transaction producer...")
    
    while True:
        try:
            # Generate and send transaction
            transaction = generate_transaction()
            producer.send('bank_transactions', value=transaction)
            print(f"Sent transaction: {transaction['transaction_id']}")
            
            # Random delay between transactions (1-5 seconds)
            time.sleep(random.uniform(1, 5))
            
        except Exception as e:
            print(f"Error producing message: {e}")
            time.sleep(5)  # Wait before retrying

if __name__ == "__main__":
    main()
