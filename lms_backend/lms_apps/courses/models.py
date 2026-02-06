from django.db import models
from lms_apps.colleges.models import College
from lms_apps.accounts.models import User
from lms_apps.academics.models import Subject



class Course(models.Model):
    college = models.ForeignKey(
        College,
        on_delete=models.CASCADE,
        related_name="courses"
    )
    code = models.CharField(max_length=20)
    name = models.CharField(max_length=255)
    subject = models.ForeignKey(
    Subject,
    on_delete=models.CASCADE,
    related_name="courses"
)

    teacher = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="teaching_courses"
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("college", "code")

    def __str__(self):
        return f"{self.code} - {self.name}"
class Enrollment(models.Model):
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
