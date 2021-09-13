from django.contrib import admin
from django_summernote.admin import SummernoteModelAdmin

from .models import Document


class DocumentAdmin(SummernoteModelAdmin):
    summernote_fields = ('content', )


admin.site.register(Document, DocumentAdmin)