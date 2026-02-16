from rest_framework import serializers
from .models import AIReport


class AIReportCreateSerializer(serializers.Serializer):
    student_id = serializers.IntegerField()


class AIReportReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIReport
        fields = [
            "id",
            "student",
            "student_name",
            "ai_feedback",
            "created_at",
        ]
