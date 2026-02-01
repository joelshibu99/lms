from django.db import models
from lms_apps.accounts.models import User
from lms_apps.colleges.models import College



class Subject(models.Model):
    """
    Academic subject scoped to a single college (tenant)
    """
    college = models.ForeignKey(
        College,
        on_delete=models.CASCADE,
        related_name="subjects"
    )
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20)

    class Meta:
        unique_together = ("college", "code")
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} ({self.code})"


class Marks(models.Model):
    """
    Marks entered by a teacher for a student in a subject
    """
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="marks"
    )
    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name="marks"
    )
    teacher = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="marks_given"
    )
    marks_obtained = models.DecimalField(max_digits=5, decimal_places=2)
    remarks = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("student", "subject")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.student.email} - {self.subject.code}"
