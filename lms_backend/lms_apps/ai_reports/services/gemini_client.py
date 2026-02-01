import logging

logger = logging.getLogger(__name__)


class GeminiServiceError(Exception):
    pass


class GeminiClient:
    """
    MOCK Gemini client.
    Replace with real Gemini implementation by enabling billing.
    """

    def __init__(self):
        pass

    def generate_text(self, prompt: str) -> str:
        # Mock AI response (deterministic & viva-safe)
        return (
            "Overall Performance:\n"
            "The student demonstrates a satisfactory academic performance "
            "with consistent effort across subjects.\n\n"

            "Strengths:\n"
            "- Regular attendance and participation\n"
            "- Good understanding of core concepts\n\n"

            "Weak Areas:\n"
            "- Needs improvement in problem-solving accuracy\n"
            "- Time management during exams can be improved\n\n"

            "Actionable Suggestions:\n"
            "- Practice subject-wise tests weekly\n"
            "- Revise weak topics regularly\n"
            "- Seek faculty guidance for difficult concepts"
        )
