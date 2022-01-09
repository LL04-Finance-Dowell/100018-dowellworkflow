from django.contrib import admin
from .models import Organization, VerificationToken

# Register your models here.
admin.site.register(Organization)
admin.site.register(VerificationToken)