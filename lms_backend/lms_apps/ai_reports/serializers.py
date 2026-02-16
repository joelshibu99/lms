from rest_framework import serializers
from .models import AIReport


class AIReportReadSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(
        source="student.full_name",
        read_only=True
    )

    class Meta:
        model = AIReport
        fields = [
            "id",
            "student",
            "student_name",
            "ai_feedback",
            "created_at",
        ]
