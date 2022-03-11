from django.forms import ModelForm

from .models import Organizationv2, Project

class CreateOrganizationv2Form(ModelForm):
    class Meta:
        model = Organizationv2
        fields = ['name']

class CreateProjectForm(ModelForm):
    class Meta:
        model = Project
        fields = ['project_name']
