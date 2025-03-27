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

# Train a simple model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

# Save the model
joblib.dump(model, 'fraud_model.pkl')
print("Model trained and saved successfully!") 