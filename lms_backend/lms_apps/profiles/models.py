from django.db import models
from lms_apps.accounts.models import User



class StudentProfile(models.Model):
    """
    Extended profile for student-specific data
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="student_profile"
    )
    roll_number = models.CharField(max_length=30)
    year = models.PositiveIntegerField()

    class Meta:
        ordering = ["roll_number"]

    def __str__(self):
        return self.user.email


class TeacherProfile(models.Model):
    """
    Extended profile for teacher-specific data
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="teacher_profile"
    )
    designation = models.CharField(max_length=100)

    def __str__(self):
        return self.user.email
