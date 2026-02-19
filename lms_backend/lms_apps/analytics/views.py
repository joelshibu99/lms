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

        # Allow Admin
        if request.user.role == "COLLEGE_ADMIN":
            pass

        # Allow Teacher (temporary relaxed check)
        elif request.user.role == "TEACHER":
            pass

        else:
            return Response(
                {"detail": "Not allowed"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Compute marks
        avg_marks = Marks.objects.filter(
            student=student
        ).aggregate(avg=Avg("marks_obtained"))["avg"] or 0.0

        attendance_qs = Attendance.objects.filter(
            student=student
        )

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
from lms_apps.courses.models import Enrollment
from lms_apps.academics.models import Subject

class TeacherRiskOverviewView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != "TEACHER":
            return Response(status=status.HTTP_403_FORBIDDEN)

        # Get teacher’s courses via subjects
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

            total_classes = Attendance.objects.filter(
                student=student
            ).count()

            present_classes = Attendance.objects.filter(
                student=student,
                is_present=True
            ).count()

            attendance_pct = (
                (present_classes / total_classes) * 100
                if total_classes > 0 else 0
            )

            risk = predict_risk(avg_marks, attendance_pct)

            result.append({
                "id": student.id,
                "full_name": student.full_name,
                "email": student.email,
                "average_marks": round(avg_marks, 2),
                "attendance_percentage": round(attendance_pct, 2),
                "risk_status": risk
            })

        return Response(result)

