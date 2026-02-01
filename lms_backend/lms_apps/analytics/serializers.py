from rest_framework import serializers

class CollegePerformanceSerializer(serializers.Serializer):
    total_students = serializers.IntegerField()
    total_subjects = serializers.IntegerField()
    average_marks = serializers.FloatField()
