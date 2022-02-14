from django.contrib import admin
from .models import Organizationv2, VerificationToken, Project

# Register your models here.
admin.site.register(Organizationv2)
admin.site.register(Project)
admin.site.register(VerificationToken)
