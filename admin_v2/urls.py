from django.urls import path
from django.contrib.auth.decorators import login_required
from .views import admin_org_management, dashboard_admin, add_member, create_company, verify_user, admin_org_management_dummy

app_name = 'admin_v2'

urlpatterns = [
    path('create-company/', login_required(create_company), name="create-company"),

    path('dashboard/', login_required(dashboard_admin), name="dashboard"),
    path('get-admin-dashboard/', login_required(dashboard_admin), name="get-dashboard-admin"),

    path('<int:company_id>/admin-org-management/<int:org_id>', login_required(admin_org_management), name="admin-org-management"),
    path('<int:company_id>/admin-org-management-dummy/<int:org_id>/<slug:position>', login_required(admin_org_management_dummy), name="admin-org-management-dummy"),
    path('<int:company_id>/admin-org-management/<int:org_id>/submit-member/', login_required(add_member), name="add-member"),


    path('verify-user/<str:token>', verify_user, name="verify-user"),
    ]
