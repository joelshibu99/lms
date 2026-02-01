class ActiveCollegeMiddleware:
    """
    Attach college to request only AFTER authentication.
    Skip public/auth endpoints like login.
    """

    PUBLIC_PATH_PREFIXES = [
        "/api/accounts/login/",
        "/api/accounts/token/",
        "/api/accounts/token/refresh/",
        "/admin/",
    ]

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # 🔹 Skip public endpoints
        for path in self.PUBLIC_PATH_PREFIXES:
            if request.path.startswith(path):
                return self.get_response(request)

        # 🔹 Skip unauthenticated users
        if not request.user.is_authenticated:
            return self.get_response(request)

        # 🔹 Safe now
        request.college = request.user.college
        return self.get_response(request)
