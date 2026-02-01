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

    Inputs:
    - avg_marks (float)
    - attendance_percentage (float)

    Output:
    - "SAFE" or "AT_RISK"
    """

    features = np.array([[avg_marks, attendance_percentage]])
    prediction = model.predict(features)[0]

    if prediction == 1:
        return "AT_RISK"
    return "SAFE"
