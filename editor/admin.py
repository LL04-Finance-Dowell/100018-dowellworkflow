from django.contrib import admin
from .models import Template
from .models_document import EditorFile

admin.site.register(EditorFile)
admin.site.register(Template)