from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db.models import Avg, Count

from lms_apps.accounts.permissions import IsCollegeAdmin, IsSystemAdmin
from lms_apps.accounts.models import User
from lms_apps.academics.models import Subject, Marks
from lms_apps.attendance.models import Attendance
from lms_apps.courses.models import Enrollment

from .serializers import CollegePerformanceSerializer
from lms_apps.ml.predictor import predict_risk


# ─────────────────────────────────────────
# COLLEGE PERFORMANCE VIEW
# ─────────────────────────────────────────
class CollegePerformanceView(APIView):
    permission_classes = [IsAuthenticated, IsCollegeAdmin | IsSystemAdmin]

    def get(self, request):
        college = request.user.college

        total_students = User.objects.filter(
            college=college,
            role="STUDENT"
        ).count()

        total_subjects = Subject.objects.filter(
            college=college
        ).count()

        average_marks = Marks.objects.filter(
            student__college=college
        ).aggregate(avg=Avg("marks_obtained"))["avg"] or 0.0

        data = {
            "total_students": total_students,
            "total_subjects": total_subjects,
            "average_marks": round(average_marks, 2),
        }

        serializer = CollegePerformanceSerializer(data)
        return Response(serializer.data)


# ─────────────────────────────────────────
# ATTENDANCE STATS VIEW
# ─────────────────────────────────────────
class AttendanceStatsView(APIView):
    permission_classes = [IsAuthenticated, IsCollegeAdmin | IsSystemAdmin]

    def get(self, request):
        college = request.user.college

        stats = Attendance.objects.filter(
            student__college=college
        ).values("status").annotate(
            count=Count("id")
        )

        return Response(stats)


# ─────────────────────────────────────────
# SINGLE STUDENT RISK VIEW
# ─────────────────────────────────────────
class StudentRiskView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, student_id):

        try:
            student = User.objects.get(
                id=student_id,
                college=request.user.college,
                role="STUDENT"
            )
        except User.DoesNotExist:
            return Response(
                {"detail": "Student not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        if request.user.role not in ["COLLEGE_ADMIN", "TEACHER"]:
            return Response(
                {"detail": "Not allowed"},
                status=status.HTTP_403_FORBIDDEN
            )

        avg_marks = Marks.objects.filter(
            student=student
        ).aggregate(avg=Avg("marks_obtained"))["avg"] or 0.0

        attendance_qs = Attendance.objects.filter(student=student)
        total = attendance_qs.count()
        present = attendance_qs.filter(is_present=True).count()

        attendance_pct = (present / total * 100) if total > 0 else 0

        risk = predict_risk(avg_marks, attendance_pct)

        return Response({
            "student_id": student.id,
            "average_marks": round(avg_marks, 2),
            "attendance_percentage": round(attendance_pct, 2),
            "risk_label": risk["label"],
            "risk_probability": risk["probability"]
        })


# ─────────────────────────────────────────
# TEACHER RISK OVERVIEW 
# ─────────────────────────────────────────
class TeacherRiskOverviewView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "TEACHER":
            return Response(status=status.HTTP_403_FORBIDDEN)

        subjects = Subject.objects.filter(
            teacher=request.user
        ).select_related("course")

        course_ids = subjects.values_list("course_id", flat=True)

        enrollments = Enrollment.objects.filter(
            course_id__in=course_ids
        ).select_related("student")

        students = {}

        for enrollment in enrollments:
            students[enrollment.student.id] = enrollment.student

        result = []

        for student in students.values():

            avg_marks = Marks.objects.filter(
                student=student
            ).aggregate(avg=Avg("marks_obtained"))["avg"] or 0.0

            attendance_qs = Attendance.objects.filter(student=student)
            total = attendance_qs.count()
            present = attendance_qs.filter(is_present=True).count()

            attendance_pct = (present / total * 100) if total > 0 else 0

            risk = predict_risk(avg_marks, attendance_pct)

            label = risk["label"]
            probability = risk["probability"]

            # 🔍 Explainable AI Logic
            reasons = []

            if attendance_pct < 60:
                reasons.append("Low attendance")

            if avg_marks < 40:
                reasons.append("Low academic performance")

            if label == "SAFE":
                reasons.append("Stable performance")

            result.append({
                "id": student.id,
                "full_name": student.full_name,
                "email": student.email,
                "average_marks": round(avg_marks, 2),
                "attendance_percentage": round(attendance_pct, 2),
                "risk_status": label,
                "risk_probability": round(probability, 2),
                "risk_reasons": reasons
            })

        return Response(result)
