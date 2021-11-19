from django.db import models
from accounts.models import CustomUser

# Create your models here.

class Message(models.Model):
    content         = models.TextField(max_length=500)
    sent_by         = models.ForeignKey(CustomUser, on_delete=models.CASECADE)


class Conversation(models.Model):
    messages		= models.ManyToManyField(Message, blank=True)