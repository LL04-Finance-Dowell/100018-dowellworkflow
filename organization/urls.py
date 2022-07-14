from django.urls import path
from django.contrib.auth.decorators import login_required
from .views import *
from .views import user_landing_page, remove_member, remove_staff_member


app_name = 'organization'

urlpatterns = [
    path('', login_required(CreateOrganization.as_view()), name="create-orgniz"),
    path('<int:id>/', login_required(OrganizationHome.as_view()), name="org-home"),
    path('<int:id>/workflow-list', login_required(OrgWorkflowListView.as_view()), name="workflow-list"),

    path('<int:id>/create-template', login_required(CreateTemplate.as_view()), name="create-template"),
    path('<int:id>/previous-templates/', login_required(PreviousTemplates.as_view()), name="previous-templates"),

    path('<int:id>/submit-member/', login_required(submit_member), name="submit-member"),
    path('verify-user/<str:token>', verify_user, name="verify-user"),
    path('user-status/', user_landing_page, name="user-status"),

    # add staff  and  members
    path('<int:id>/add-members/', login_required(MembersView.as_view()), name="add-members"),
    path('<int:id>/add-staff/', login_required(StaffView.as_view()), name="add-staff"),
    #path('update_task/<str:pk>/', views.updateTask, name="update_task"),
    path('<int:id>/add_project_leader/', login_required(ProjectLeaderView.as_view()), name="add_project_leader"),
    path('<int:id>/make_project_leader/', login_required(makeProjectLeader), name="make_project_leader"),
    path('<int:id>/add-members/submit-member/', login_required(submit_member), name="submit-members"),
    path('<int:id>/add-members/remove-member/', login_required(remove_member), name="remove-members"),
    path('<int:id>/add-staff/submit-member/', login_required(submit_member), name="submit-staff"),
    path('<int:id>/add-staff/remove-staff-member/', login_required(remove_staff_member), name="remove-staff-members"),


]