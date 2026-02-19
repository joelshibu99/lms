import joblib
import numpy as np
import os


# -----------------------------------
# Load trained model (once)
# -----------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model.joblib")

model = joblib.load(MODEL_PATH)


# -----------------------------------
# Prediction function
# -----------------------------------
def predict_risk(avg_marks, attendance_percentage):
    """
    Predict whether a student is SAFE or AT_RISK

    Returns:
    {
        "label": "SAFE" | "AT_RISK",
        "probability": float
    }
    """

    features = np.array([[avg_marks, attendance_percentage]])

    prediction = model.predict(features)[0]
    probability = model.predict_proba(features)[0][1]

    label = "AT_RISK" if prediction == 1 else "SAFE"

    return {
        "label": label,
        "probability": round(float(probability), 2)
    }
