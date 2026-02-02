from django.urls import include, path
from rest_framework.routers import DefaultRouter

from lms_apps.attendance.views import AttendanceViewSet, StudentAttendanceView

router = DefaultRouter()
router.register(r"attendance", AttendanceViewSet, basename="attendance")

urlpatterns = [
    # Teacher routes (CRUD attendance)
    path("", include(router.urls)),

    # Student route (view own attendance)
    path("my-attendance/", StudentAttendanceView.as_view()),
]
