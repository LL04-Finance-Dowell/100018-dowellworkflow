from django.db import models
from accounts.models import CustomUser
from workflow.models import DocumentType


def user_directory_path(filename):
    # file will be uploaded to MEDIA_ROOT/<filename>
    return filename


class Template(models.Model):
    template_name   = models.CharField(max_length=100, null=False)
    document_type   = models.ForeignKey(DocumentType, on_delete=models.CASCADE, null=False)
    auth_user_list  = models.ManyToManyField(CustomUser, related_name='auth_users')
    file            = models.FileField(upload_to=user_directory_path, null=True)
    created_by      = models.ForeignKey(CustomUser, related_name='author', on_delete=models.CASCADE, null=False)

    def __str__(self):
        return f'{self.template_name} - {self.document_type}'


