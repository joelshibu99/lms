from django.urls import path
from .views import (
    CollegePerformanceView,
    AttendanceStatsView,
    StudentRiskView,
)

urlpatterns = [
    path("college-summary/", CollegePerformanceView.as_view()),
    path("attendance-stats/", AttendanceStatsView.as_view()),
    path("student-risk/<int:student_id>/", StudentRiskView.as_view()),
]
