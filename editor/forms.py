from django.forms import ModelForm
from django import forms
from workflow.models import DocumentType

from .models import Template
from .models_document import EditorFile

class CreateDocumentForm(ModelForm):
    class Meta:
        model = EditorFile
        fields = ['document_name', 'document_type']

class CreateTemplateForm(ModelForm):
    copy_template = forms.ModelChoiceField(required=False, queryset=Template.objects.all(), label="Select Template", to_field_name="template_name")
    class Meta:
        model = Template
        fields = ['template_name', 'document_type', 'copy_template']

class RequestDocumentForm(forms.Form):
    document_name = forms.CharField(label='Document name', max_length=100)
    template = forms.ModelChoiceField(queryset=Template.objects.all(), label="Select Template", to_field_name="template_name")