from django.urls import path
from django.contrib.auth.decorators import login_required
from .views import CreateOrganization, OrganizationHome, OrgWorkflowListView, CreateTemplate, verify_user, add_members, add_staff, submit_member
from .views import user_landing_page


app_name = 'organization'

urlpatterns = [
    path('', login_required(CreateOrganization.as_view()), name="create-orgniz"),
    path('<int:id>/', login_required(OrganizationHome.as_view()), name="org-home"),
    path('<int:id>/workflow-list', login_required(OrgWorkflowListView.as_view()), name="workflow-list"),
    path('<int:id>/create-template', login_required(CreateTemplate.as_view()), name="create-template"),
    path('<int:id>/submit-member/', login_required(submit_member), name="submit-member"),
    path('verify-user/<str:token>', verify_user, name="verify-user"),
    path('user-status/', user_landing_page, name="user-status"),

    # add staff  and  members
    path('<int:id>/add-members/', login_required(add_members), name="add-members"),
    path('<int:id>/add-staff/', login_required(add_staff), name="add-staff"),
    path('<int:id>/add-members/submit-member/', login_required(submit_member), name="submit-members"),
    path('<int:id>/add-staff/submit-member/', login_required(submit_member), name="submit-staff"),


]