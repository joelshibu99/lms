from .views import CollegeUsersView

urlpatterns = [
    path("college-admin/users/", CollegeUsersView.as_view()),
]
