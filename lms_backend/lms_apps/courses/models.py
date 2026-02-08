from django.db import models
from lms_apps.colleges.models import College
from lms_apps.accounts.models import User


class Course(models.Model):
    """
    Course created by College Admin.
    Subjects are created UNDER a course (handled in academics app).
    Students enroll into courses.
    """

    college = models.ForeignKey(
        College,
        on_delete=models.CASCADE,
        related_name="courses"
    )

    code = models.CharField(max_length=20)
    name = models.CharField(max_length=255)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("college", "code")
        ordering = ["code"]

    def __str__(self):
        return f"{self.code} - {self.name}"


class Enrollment(models.Model):
    """
    Student enrollment into a course.
    Subjects are derived via course -> subjects.
    """

    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="enrollments"
    )

    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="enrollments"
    )

    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("student", "course")

    def __str__(self):
        return f"{self.student.email} -> {self.course.code}"
