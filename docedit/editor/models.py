import os
from django.db import models
from accounts.models import CustomUser


def user_directory_path(filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return filename


class EditorFile(models.Model):
    name        = models.CharField(max_length=100, null=False)
    file_type   = models.CharField(max_length=100, default='draft')
    file        = models.FileField(upload_to=user_directory_path, null=True)
    created_by  = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=False)
    created_on  = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.name} - {self.created_by}'
