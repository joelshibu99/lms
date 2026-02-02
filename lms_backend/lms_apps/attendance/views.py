from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from lms_apps.attendance.models import Attendance
from lms_apps.attendance.serializers import AttendanceSerializer
from lms_apps.accounts.permissions import IsTeacher, IsStudent


class AttendanceViewSet(ModelViewSet):
    """
    Teacher-only API to manage student attendance
    College-level data isolation enforced at queryset level
    """
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated, IsTeacher]

    def get_queryset(self):
        return (
            Attendance.objects
            .select_related("student", "subject")
            .filter(student__college=self.request.user.college)
        )


class StudentAttendanceView(APIView):
    """
    Student-only API to view own attendance
    """
    permission_classes = [IsAuthenticated, IsStudent]

    def get(self, request):
        attendance = (
            Attendance.objects
            .filter(student=request.user)
            .select_related("subject")
            .order_by("-date")
        )

        data = [
            {
                "id": a.id,
                "subject_name": a.subject.name,
                "is_present": a.is_present,
                "date": a.date,
            }
            for a in attendance
        ]

        return Response(data)
