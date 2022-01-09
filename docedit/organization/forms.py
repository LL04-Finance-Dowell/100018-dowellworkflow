from django.forms import ModelForm

from .models import Organization

class CreateOrganizationForm(ModelForm):
    class Meta:
        model = Organization
        fields = ['organization_name']