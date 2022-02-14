from django.db import models
from datetime import datetime


class Room(models.Model): #Acts like a group
    name = models.CharField(max_length=1000)

class Message(models.Model):
    value = models.CharField(max_length=10000000)
    date = models.DateTimeField(default=datetime.now)
    room = models.CharField(max_length=1000000) #ForeignKey(Room, on_delete=models.CASCADE)
    user = models.CharField(max_length=1000000, default="Anonymous") #use foreignkey for real app

    def __str__(self):
        return str(self.value) + ':' + str(self.user) +':' + str(self.room) +':'+ str(self.date)