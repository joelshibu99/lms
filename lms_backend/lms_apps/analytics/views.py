from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Avg, Count

from lms_apps.accounts.permissions import IsCollegeAdmin, IsSystemAdmin
from lms_apps.accounts.models import User
from lms_apps.academics.models import Subject, Marks
from lms_apps.attendance.models import Attendance

from .serializers import CollegePerformanceSerializer
from lms_apps.ml.predictor import predict_risk



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
class StudentRiskView(APIView):
    permission_classes = [IsAuthenticated, IsCollegeAdmin | IsSystemAdmin]

    def get(self, request, student_id):
        college = request.user.college

        # Average marks
        avg_marks = Marks.objects.filter(
        student_id=student_id,
        student__college=college
        ).aggregate(avg=Avg("marks_obtained"))["avg"] or 0.0


        # Attendance percentage
        total_classes = Attendance.objects.filter(
        student_id=student_id,
        student__college=college
        ).count()

        present_classes = Attendance.objects.filter(
        student_id=student_id,
        student__college=college,
        is_present=True
        ).count()


        attendance_pct = (
            (present_classes / total_classes) * 100
            if total_classes > 0 else 0
        )

        risk = predict_risk(avg_marks, attendance_pct)

        return Response({
            "student_id": student_id,
            "average_marks": round(avg_marks, 2),
            "attendance_percentage": round(attendance_pct, 2),
            "risk_status": risk
        })
