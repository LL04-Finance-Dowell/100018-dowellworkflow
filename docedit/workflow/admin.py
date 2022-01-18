from django.contrib import admin
from .models import WorkFlowModel, SigningStep, DocumentType

# Register your models here.
admin.site.register(WorkFlowModel)
admin.site.register(SigningStep)
admin.site.register(DocumentType)
