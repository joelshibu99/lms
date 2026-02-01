from django.db import models
from lms_apps.accounts.models import User
from lms_apps.academics.models import Subject


class Attendance(models.Model):
    """
    Attendance record managed by staff for students
    """
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="attendance",
        db_index=True
    )
    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name="attendance",
        db_index=True
    )
    date = models.DateField(db_index=True)
    is_present = models.BooleanField(default=False)

    class Meta:
        unique_together = ("student", "subject", "date")
        ordering = ["-date"]

    def __str__(self):
        return f"{self.student.email} - {self.subject.code} - {self.date}"
