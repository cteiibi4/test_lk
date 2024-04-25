from django.db import models
from django.contrib.auth.models import AbstractUser

# Register your models here.
class User(AbstractUser):
    role = models.TextField(null=False, blank=False)

    USERNAME_FIELD = "username"

    def __str__(self):
        return self.username

    class Meta:
        app_label = "users"