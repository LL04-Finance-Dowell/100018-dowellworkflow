from django.urls import path
from django.contrib.auth.decorators import login_required
from .views import CreateOrganizationv2, CreateProjectView, Organizationv2Home, project_management, workflow_management, org_lead_view,proj_lead_view
from .views import create_document_type, workflow_delete_view, workflow_update_view, create_template, add_member_view, add_member, previous_templates,member_dummy,project_dummy, org_dummy, profile
from .views import MembersView
from .views import add_member_to_project
app_name = 'organizationv2'

urlpatterns = [
    path('<int:company_id>/', login_required(CreateOrganizationv2.as_view()), name="create-orgniz"),
    path('organizationv2/<int:org_id>/', login_required(Organizationv2Home.as_view()), name="org-home"),

    path('<int:org_id>/add-project', login_required(CreateProjectView.as_view()), name="add-project"),
    path('<int:org_id>/project-management/<int:project_id>', login_required(project_management), name="project-management"),

    path('<int:org_id>/add-member/<str:member_type>', login_required(add_member_view), name="add-member-view"),
    path('<int:company_id>/submit-member', login_required(add_member), name="add-member-submit"),

    path('<int:id>/add-members/', login_required(MembersView.as_view()), name="add-members"),
    path('org-lead-management/<int:id>', login_required(org_lead_view), name="org-lead-management"),
    path('proj-lead-management/<int:id>', login_required(proj_lead_view), name="proj-lead-management"),

    path('add-member-to-project/<int:project_id>/<int:member_id>', login_required(add_member_to_project), name="add-member-to-project"),

    path('<int:org_id>/<int:project_id>/workflow-management', login_required(workflow_management), name="workflow-management"),
    path('<int:org_id>/<int:project_id>/workflow-management/add', login_required(create_document_type), name="add-new-workflow"),
    path('<int:org_id>/<int:project_id>/workflow-management/delete', login_required(workflow_delete_view), name="delete-workflow"),
    path('<int:org_id>/<int:project_id>/workflow-management/update', login_required(workflow_update_view), name="update-workflow"),

    path('<int:org_id>/<int:project_id>/create-template', login_required(create_template), name="create-template"),
    path('<int:org_id>/<int:project_id>/previous-templates/', login_required(previous_templates), name="previous-templates"),

    path('member-dummy/', login_required(member_dummy), name="member-dummy"),
    path('project-dummy/', login_required(project_dummy), name="project-dummy"),
    path('org-dummy/', login_required(org_dummy), name="org-dummy"),
    path('profile/', login_required(profile), name="profile")
]