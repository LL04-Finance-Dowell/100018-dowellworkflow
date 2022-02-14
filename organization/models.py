from django.db import models

from accounts.models import CustomUser
from editor.models import Template
from workflow.models import DocumentType


# Create your models here.

class VerificationToken(models.Model):
    org_id = models.IntegerField(null=False)
    user_email = models.EmailField(null=False)
    user_position = models.CharField(max_length=50, null=False)
    token = models.CharField(max_length=64, null=False)

    def __str__(self):
        return f'{self.user_email} - {self.user_position} - {self.token}'


class Organization(models.Model):
    organization_name   = models.CharField(max_length=100, null=False)
    #org_admin           = models.OneToOneField(CustomUser, related_name="org_admin", on_delete=models.CASCADE, null=True)
    staff_members       = models.ManyToManyField(CustomUser, related_name="staff_members")
    members             = models.ManyToManyField(CustomUser, related_name="members")
    templates           = models.ManyToManyField(Template)
    workflows           = models.ManyToManyField(DocumentType)

    def __str__(self):
        return f'{self.id} - {self.organization_name}'