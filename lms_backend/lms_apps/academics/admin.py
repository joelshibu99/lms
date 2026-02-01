from django.contrib import admin
from lms_apps.academics.models import Subject, Marks


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ("name", "code", "college")
    list_filter = ("college",)
    search_fields = ("name", "code")


@admin.register(Marks)
class MarksAdmin(admin.ModelAdmin):
    list_display = ("student", "subject", "marks_obtained", "teacher", "created_at")
    list_filter = ("subject", "teacher")
    search_fields = ("student__email",)
