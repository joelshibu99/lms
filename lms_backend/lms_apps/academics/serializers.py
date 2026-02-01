from rest_framework import serializers
from lms_apps.academics.models import Subject, Marks


class SubjectSerializer(serializers.ModelSerializer):
    """
    Serializer for academic subjects (college-scoped)
    """

    class Meta:
        model = Subject
        fields = "__all__"


class MarksSerializer(serializers.ModelSerializer):
    """
    Serializer for marks entered by teachers
    Teacher field is auto-assigned from request.user
    """

    class Meta:
        model = Marks
        fields = "__all__"
        read_only_fields = ("teacher", "created_at")
