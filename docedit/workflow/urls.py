from django.urls import path
from django.contrib.auth.decorators import login_required
from .views import workflow_delete_view, workflow_update_view, create_document_type, getDocumentTypeObject, WorkFlowListView

app_name = 'workflow'

urlpatterns = [

    path('workflow-list/', login_required(WorkFlowListView.as_view()), name="work-flow-list"),
    path('wf_api/delete-wf/', login_required(workflow_delete_view)),
    path('wf_api/update-wf/', login_required(workflow_update_view)),

    path('create-document-type/', login_required(create_document_type), name="create-document-type"),
    path('detail-document-type/<int:id>', login_required(getDocumentTypeObject), name="detail-document-type"),


]
