from django.db import models
from accounts.models import CustomUser
from editor.models import Template
from editor.models_document import EditorFile
from workflow.models import DocumentType
#from admin_v2.models import Company

import os

def company_logo_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/<filename>
    return os.path.join('logos_company', filename)


#models to be created Here
class Company(models.Model):
    company_name   = models.CharField(max_length=200, null=False, unique=True)
    admin  = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="company_admin")
    organizations = models.ManyToManyField("Organizationv2", related_name="company_orgs")
    members      = models.ManyToManyField(CustomUser, related_name="company_members")
    uploaded_company_logo = models.FileField(upload_to=company_logo_path, null=True)
    documents      = models.ManyToManyField(EditorFile, related_name="company_documents")

    def __str__(self):
        return f'{self.company_name} - {self.admin}'


class Organizationv2(models.Model):
    company              = models.ForeignKey(Company, on_delete=models.SET_NULL,related_name="company_organization", null=True)
    name                 = models.CharField(max_length=100, null=False, unique=True)
    organization_lead    = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, related_name="org_lead", null=True)
    projects             = models.ManyToManyField("Project", related_name="org_projects")
    members              = models.ManyToManyField(CustomUser, related_name="org_members")
    templates           = models.ManyToManyField(Template)
    workflows           = models.ManyToManyField(DocumentType)

    class Meta:
        ordering=['name']

    def __str__(self):
        return f'{self.id} - {self.name}'

class Project(models.Model):
    project_name        = models.CharField(max_length=100, null=False, unique=True)
    project_lead        = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, related_name="project_lead", null=True)
    organization        = models.ForeignKey(Organizationv2, on_delete=models.SET_NULL, related_name="project_organization",null=True)
    members             = models.ManyToManyField(CustomUser, related_name="project_members")
    templates           = models.ManyToManyField(Template, related_name="project_templates")

    class Meta:
        ordering=['project_name']

    def __str__(self):
        return f'{self.id} - {self.project_name}'




class VerificationToken(models.Model):
    company_id = models.IntegerField(null=False)
    user_email = models.EmailField(null=False)
    #user_position = models.CharField(max_length=50, null=False)
    token = models.CharField(max_length=64, null=False)

    def __str__(self):
        return f'{self.user_email} - {self.token}'




