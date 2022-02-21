from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import CustomUser


class CustomUserAdmin(UserAdmin):

	add_form = CustomUserCreationForm
	form = CustomUserChangeForm
	model = CustomUser
	list_display = ['email', 'username', 'age','is_admin', 'is_staff', 'is_org_leader', 'is_project_leader']
	fieldsets = UserAdmin.fieldsets + ( (None, {'fields': ('age','is_admin','is_org_leader', 'is_project_leader',)}),)
	add_fieldsets = UserAdmin.add_fieldsets + ( (None, {'fields': ('age','is_admin','is_org_leader', 'is_project_leader',)}),)


admin.site.register(CustomUser, CustomUserAdmin)
#admin.site.register(User)