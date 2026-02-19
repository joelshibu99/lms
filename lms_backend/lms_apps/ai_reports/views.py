from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView

from lms_apps.accounts.models import User
from lms_apps.academics.models import Marks

from .models import AIReport
from .serializers import AIReportReadSerializer
from .services.prompt_builder import build_academic_prompt
from .services.gemini_client import GeminiClient, GeminiServiceError


# ------------------------------
# GENERATE AI SUMMARY (Teacher)
# ------------------------------
class GenerateAIReportView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        student_id = request.data.get("student_id")

        if not student_id:
            return Response(
                {"detail": "student_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            student = User.objects.get(id=student_id)
        except User.DoesNotExist:
            return Response(
                {"detail": "Student not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        marks_qs = Marks.objects.filter(student=student).select_related("subject")

        if not marks_qs.exists():
            return Response(
                {"detail": "No academic data found"},
                status=status.HTTP_400_BAD_REQUEST
            )

        marks_data = [
            {
                "subject": m.subject.name,
                "marks": float(m.marks_obtained),
            }
            for m in marks_qs
        ]

        prompt = build_academic_prompt(
            student_name=student.email,
            marks_data=marks_data
        )

        gemini = GeminiClient()

        try:
            ai_text = gemini.generate_text(prompt)
        except GeminiServiceError:
            return Response(
                {"detail": "AI service unavailable"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        report = AIReport.objects.create(
            college=student.college,
            student=student,
            generated_by=request.user,
            input_snapshot={"marks": marks_data},
            ai_feedback=ai_text,
        )

        return Response(
            AIReportReadSerializer(report).data,
            status=status.HTTP_201_CREATED
        )


# ------------------------------
# TEACHER LIST REPORTS
# ------------------------------
class TeacherAIReportListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AIReportReadSerializer

    def get_queryset(self):
        return AIReport.objects.filter(
            generated_by=self.request.user
        ).order_by("-created_at")


# ------------------------------
# STUDENT GET LATEST SUMMARY
# ------------------------------
class StudentLatestAIReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        report = AIReport.objects.filter(
            student=request.user
        ).order_by("-created_at").first()

        if not report:
            return Response(
                {"detail": "No AI report found"},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(AIReportReadSerializer(report).data)


# ------------------------------
# STUDENT CHAT WITH SUMMARY
# ------------------------------
class StudentChatWithAIReportView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        message = request.data.get("message")

        if not message:
            return Response(
                {"detail": "Message is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        report = AIReport.objects.filter(
            student=request.user
        ).order_by("-created_at").first()

        if not report:
            return Response(
                {"detail": "No AI report available"},
                status=status.HTTP_404_NOT_FOUND
            )

        prompt = f"""
        This is the student's academic summary:
        {report.ai_feedback}

        Student question:
        {message}

        Answer clearly and concisely.
        """

        gemini = GeminiClient()

        try:
            response = gemini.generate_text(prompt)
        except GeminiServiceError:
            return Response(
                {"detail": "AI service unavailable"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        return Response({"reply": response})
from rest_framework.generics import DestroyAPIView


class DeleteAIReportView(DestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = AIReport.objects.all()
    serializer_class = AIReportReadSerializer

    def get_queryset(self):
        # 🔐 Only allow teacher to delete their own reports
        return AIReport.objects.filter(
            generated_by=self.request.user
        )
# ------------------------------
# STUDENT LIST ALL REPORTS
# ------------------------------
class StudentAIReportListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AIReportReadSerializer

    def get_queryset(self):
        return AIReport.objects.filter(
            student=self.request.user
        ).order_by("-created_at")
