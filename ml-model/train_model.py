# train_model.py

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report
import joblib

# 1. Load the data
data = pd.read_csv('applications_dataset.csv')  # Make sure your CSV is in the same folder

# 2. Preprocess the data
# Encode categorical fields: contentIdeaQuality, previousWorkExperience, status
label_encoders = {}

for col in ['contentIdeaQuality', 'previousWorkExperience', 'status']:
    le = LabelEncoder()
    data[col] = le.fit_transform(data[col])
    label_encoders[col] = le

# 3. Split features and label
X = data.drop('status', axis=1)   # Features (inputs)
y = data['status']                # Label (output)

# 4. Split into training and testing sets (80% training, 20% testing)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 5. Train the model
model = RandomForestClassifier(random_state=42)
model.fit(X_train, y_train)

# 6. Evaluate the model
y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))

# 7. Save the model and label encoders
joblib.dump(model, 'model.pkl')
joblib.dump(label_encoders, 'label_encoders.pkl')

print("✅ Model and encoders saved successfully!")
