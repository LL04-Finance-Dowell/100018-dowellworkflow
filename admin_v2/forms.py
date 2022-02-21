from django.forms import ModelForm
from organizationv2.models import  Company


class CreateCompanyForm(ModelForm):
    class Meta:
        model = Company
        fields = ['company_name']