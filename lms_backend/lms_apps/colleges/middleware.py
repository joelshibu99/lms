from django.http import JsonResponse
from django.contrib.auth import get_user_model

User = get_user_model()


class ActiveCollegeMiddleware:
    """
    Blocks access for users whose college is INACTIVE
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        user = getattr(request, "user", None)

        if user and user.is_authenticated:
            # SYSTEM_ADMIN is not tied to any college
            if user.college and user.college.status != "ACTIVE":
                return JsonResponse(
                    {"detail": "College is inactive. Access denied."},
                    status=403,
                )

        return self.get_response(request)
