from rest_framework import serializers
from lms_apps.attendance.models import Attendance


class AttendanceSerializer(serializers.ModelSerializer):
    """
    Serializer for attendance records
    Returns readable student & subject info
    """

    student_email = serializers.CharField(
        source="student.email", read_only=True
    )
    subject_name = serializers.CharField(
        source="subject.name", read_only=True
    )

    class Meta:
        model = Attendance
        fields = [
            "id",
            "date",
            "is_present",
            "student",
            "subject",
            "student_email",
            "subject_name",
        ]
