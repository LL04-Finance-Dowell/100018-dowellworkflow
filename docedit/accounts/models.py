from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
	age = models.PositiveIntegerField(null=True, blank=True)
	is_staff = models.BooleanField(default=False)