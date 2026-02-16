from django.urls import path
from .views import (
    GenerateAIReportView,
    StudentLatestAIReportView,
    StudentChatWithAIReportView,
    TeacherAIReportListView,
    DeleteAIReportView,
)

urlpatterns = [
    path("generate/", GenerateAIReportView.as_view()),
    path("teacher-reports/", TeacherAIReportListView.as_view()),
    path("<int:pk>/", DeleteAIReportView.as_view()),  
    path("student-latest/", StudentLatestAIReportView.as_view()),
    path("student-chat/", StudentChatWithAIReportView.as_view()),
]
