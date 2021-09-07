from django.db import models
from django.urls import reverse
from accounts.models import CustomUser


class Document(models.Model):
	user = models.ForeignKey(CustomUser,on_delete=models.CASCADE,related_name='document',null=True)

	title = models.CharField(max_length=200)
