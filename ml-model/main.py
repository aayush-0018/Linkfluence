from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np

# Load final prediction model and label encoders
model = joblib.load('model.pkl')
label_encoders = joblib.load('label_encoders.pkl')

# Load NLP text classifiers
content_classifier = joblib.load('content_classifier.pkl')
work_classifier = joblib.load('work_classifier.pkl')

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Status classes:", label_encoders['status'].classes_)

# Request schema
class InfluencerData(BaseModel):
    campaignBudget: int
    proposedRate: int
    instagramFollowers: int
    youtubeSubscribers: int
    contentIdeaQuality: str  # This is now raw text
    previousWorkExperience: str  # This is now raw text

@app.post("/predict")
def predict(data: InfluencerData):
    # Step 1: NLP classify raw strings to labels
    content_label = content_classifier.predict([data.contentIdeaQuality])[0]  # "poor", "average", "good"
    work_label = work_classifier.predict([data.previousWorkExperience])[0]    # "weak", "medium", "strong"

    # Step 2: Encode labels
    content_encoded = label_encoders['contentIdeaQuality'].transform([content_label])[0]
    work_encoded = label_encoders['previousWorkExperience'].transform([work_label])[0]

    # Step 3: Form model input
    input_data = np.array([
        data.campaignBudget,
        data.proposedRate,
        data.instagramFollowers,
        data.youtubeSubscribers,
        content_encoded,
        work_encoded
    ]).reshape(1, -1)

    # Step 4: Predict class probabilities
    probabilities = model.predict_proba(input_data)[0]
    acceptance_index = list(label_encoders['status'].classes_).index("accepted") 
     # Ensure this matches your model's class names
    acceptance_prob = probabilities[acceptance_index]
    
    # Step 5: Predict final class
    status = label_encoders['status'].inverse_transform([np.argmax(probabilities)])[0]

    return {
        "prediction": status,
        "acceptanceProbability": round(acceptance_prob * 100, 2),  # percentage
        "interpretedContentIdea": content_label,
        "interpretedWorkExperience": work_label
    }
