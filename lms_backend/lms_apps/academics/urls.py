from django.urls import path, include
from rest_framework.routers import DefaultRouter

from lms_apps.academics.views import MarksViewSet, StudentAcademicHistoryView

router = DefaultRouter()
router.register(r"marks", MarksViewSet, basename="marks")

urlpatterns = [
    path("student-history/", StudentAcademicHistoryView.as_view(), name="student-academic-history"),
    path("", include(router.urls)),
]
