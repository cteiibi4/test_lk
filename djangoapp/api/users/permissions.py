from rest_framework.permissions import BasePermission, IsAuthenticated

class UserIsAuthenticated(IsAuthenticated):
    message = "Authentication credentials were not provided."
    status_code = 401
