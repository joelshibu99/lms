from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from lms_apps.accounts.permissions import IsTeacher, IsStudent
from lms_apps.academics.models import Marks
from lms_apps.accounts.models import User

from .models import AIReport
from .serializers import (
    AIReportCreateSerializer,
    AIReportReadSerializer,
)
from .services.prompt_builder import build_academic_prompt
from .services.gemini_client import GeminiClient, GeminiServiceError


class GenerateAIReportView(APIView):
    permission_classes = [IsTeacher]

    def post(self, request):
        # 1. Validate input
        serializer = AIReportCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # 2. Fetch student (college-scoped)
        student = User.objects.get(
            id=serializer.validated_data["student_id"],
            college=request.user.college,
        )

        # 3. Fetch academic marks
        marks_qs = Marks.objects.filter(
            student=student
        ).select_related("subject")

        if not marks_qs.exists():
            return Response(
                {"detail": "No academic data found"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 4. Prepare marks data (Decimal → float for JSON safety)
        marks_data = [
            {
                "subject": m.subject.name,
                "marks": float(m.marks_obtained),
            }
            for m in marks_qs
        ]

        # 5. Build AI prompt
        prompt = build_academic_prompt(
            student_name=student.email,
            marks_data=marks_data
        )

        # 6. Generate AI feedback (MOCK Gemini)
        gemini = GeminiClient()

        try:
            ai_text = gemini.generate_text(prompt)
        except GeminiServiceError:
            return Response(
                {"detail": "AI service temporarily unavailable"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        # 7. Save AI report
        report = AIReport.objects.create(
            college=request.user.college,
            student=student,
            generated_by=request.user,
            input_snapshot={
                "marks": marks_data,
                "total_subjects": marks_qs.count(),
            },
            ai_feedback=ai_text,
        )

        # 8. Return response
        return Response(
            AIReportReadSerializer(report).data,
            status=status.HTTP_201_CREATED
        )


class StudentAIReportsView(APIView):
    permission_classes = [IsStudent]

    def get(self, request):
        reports = AIReport.objects.filter(
            student=request.user,
            college=request.user.college
        )

        serializer = AIReportReadSerializer(reports, many=True)
        return Response(serializer.data)
