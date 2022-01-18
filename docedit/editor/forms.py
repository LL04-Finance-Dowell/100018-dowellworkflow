from django.forms import ModelForm
from django import forms
from workflow.models import DocumentType

from .models import EditorFile, Template

class CreateDocumentForm(ModelForm):
    class Meta:
        model = EditorFile
        fields = ['document_name', 'document_type']

class CreateTemplateForm(ModelForm):
    class Meta:
        model = Template
        fields = ['template_name', 'document_type']

class RequestDocumentForm(forms.Form):
    document_name = forms.CharField(label='Document name', max_length=100)
    template = forms.ModelChoiceField(queryset=Template.objects.all(), label="Select Template", to_field_name="template_name")