from django.db import models
from lms_apps.accounts.models import User
from lms_apps.colleges.models import College


class Subject(models.Model):
    """
    Subject belongs to a Course.
    Created by College Admin under a specific course.
    Teacher is assigned per subject.
    """

    college = models.ForeignKey(
        College,
        on_delete=models.CASCADE,
        related_name="subjects"
    )

    # ✅ STRING REFERENCE + TEMP NULL
    course = models.ForeignKey(
        "courses.Course",
        on_delete=models.CASCADE,
        related_name="subjects",
        null=True,      # TEMP for migration
        blank=True      # TEMP for migration
    )

    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20)

    teacher = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_subjects"
    )

    class Meta:
        unique_together = ("course", "code")
        ordering = ["name"]

    def __str__(self):
        course_code = self.course.code if self.course else "NO-COURSE"
        return f"{course_code} - {self.name} ({self.code})"


class Marks(models.Model):
    """
    Marks entered by a teacher for a student in a subject.
    Student enrollment is via Course.
    """

    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="marks",
        db_index=True
    )

    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name="marks",
        db_index=True
    )

    teacher = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="marks_given"
    )

    marks_obtained = models.DecimalField(
        max_digits=5,
        decimal_places=2
    )

    remarks = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("student", "subject")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.student.email} - {self.subject.code}"
