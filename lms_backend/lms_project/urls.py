from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # Admin
    path("admin/", admin.site.urls),

    # Day 1 & Day 2
    path("api/accounts/", include("lms_apps.accounts.urls")),
    path("api/colleges/", include("lms_apps.colleges.urls")),

    # Day 3
    path("api/academics/", include("lms_apps.academics.urls")),
    path("api/attendance/", include("lms_apps.attendance.urls")),

    # ✅ Day 4 AI
    path("api/ai-reports/", include("lms_apps.ai_reports.urls")),
]
