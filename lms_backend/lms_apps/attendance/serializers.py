from rest_framework import serializers
from lms_apps.attendance.models import Attendance


class AttendanceSerializer(serializers.ModelSerializer):
    """
    Serializer for attendance records managed by staff
    """

    class Meta:
        model = Attendance
        fields = "__all__"
