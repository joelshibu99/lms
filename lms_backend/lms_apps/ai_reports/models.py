from django.db import models
from django.conf import settings
from lms_apps.colleges.models import College

User = settings.AUTH_USER_MODEL


class AIReport(models.Model):
    college = models.ForeignKey(
        College,
        on_delete=models.CASCADE,
        related_name="ai_reports"
    )

    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="ai_reports"
    )

    generated_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name="generated_ai_reports"
    )

    input_snapshot = models.JSONField()
    ai_feedback = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["college", "student"]),
        ]

    def __str__(self):
        return f"AI Report | Student={self.student.email}"
