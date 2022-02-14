from django.db import models
from accounts.models import CustomUser
from editor.models import Template
from workflow.models import DocumentType
#from admin_v2.models import Company

#models to be created Here
class Company(models.Model):
    company_name   = models.CharField(max_length=200, null=False, unique=True)
    admin  = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="company_admin")
    organizations = models.ManyToManyField("Organizationv2", related_name="company_orgs")
    members      = models.ManyToManyField(CustomUser, related_name="company_members")
    def __str__(self):
        return f'{self.id}-{self.company_name} - {self.admin}'


class Organizationv2(models.Model):
    company              = models.ForeignKey(Company, on_delete=models.SET_NULL, null=True)
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

    class Meta:
        ordering=['project_name']

    def __str__(self):
        return f'{self.id} - {self.project_name}'

class VerificationToken(models.Model):
    company_id = models.IntegerField(null=False)
    user_email = models.EmailField(null=False)
    token = models.CharField(max_length=64, null=False)

    def __str__(self):
        return f'{self.user_email} - {self.token}'




