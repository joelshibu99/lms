import numpy as np
from sklearn.linear_model import LogisticRegression
import joblib

# -----------------------------------
# Training data (example, small & safe)
# -----------------------------------
# Features: [average_marks, attendance_percentage]
X = np.array([
    [85, 95],   # good student
    [78, 88],
    [60, 70],
    [45, 55],   # borderline
    [35, 40],   # at risk
    [30, 35]
])

# Labels: 0 = SAFE, 1 = AT_RISK
y = np.array([0, 0, 0, 1, 1, 1])

# -----------------------------------
# Train model
# -----------------------------------
model = LogisticRegression()
model.fit(X, y)

# -----------------------------------
# Save model
# -----------------------------------
joblib.dump(model, "lms_apps/ml/model.joblib")

print(" Model trained and saved as model.joblib")
