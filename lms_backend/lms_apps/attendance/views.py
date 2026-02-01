from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated

from lms_apps.attendance.models import Attendance
from lms_apps.attendance.serializers import AttendanceSerializer
from lms_apps.accounts.permissions import IsStaff


class AttendanceViewSet(ModelViewSet):
    """
    Staff-only API to manage student attendance
    College-level data isolation enforced at queryset level
    """
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated, IsStaff]

    def get_queryset(self):
        return (
            Attendance.objects
            .select_related("student", "subject")
            .filter(student__college=self.request.user.college)
        )
