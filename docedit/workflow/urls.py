from django.urls import path
from django.contrib.auth.decorators import login_required
from .views import workflow_delete_view, workflow_update_view, create_document_type, getDocumentTypeObject, WorkFlowListView, DocumentCreatedListView, DocumentWorkFlowAddView, DocumentExecutionListView, DocumentVerificationView


app_name = 'workflow'

urlpatterns = [

    path('workflow-list/', login_required(WorkFlowListView.as_view()), name="work-flow-list"),
    path('wf_api/delete-wf/', login_required(workflow_delete_view)),
    path('wf_api/update-wf/', login_required(workflow_update_view)),
    path('created-document-list/', login_required(DocumentCreatedListView.as_view()), name='created-document-list'),
    path('create-document-type/', login_required(create_document_type), name="create-document-type"),
    path('detail-document-type/<int:id>', login_required(getDocumentTypeObject), name="detail-document-type"),
    path('add-document/', login_required(DocumentWorkFlowAddView.as_view()), name="add-document"),
    path('documents-in-workflow/', login_required(DocumentExecutionListView.as_view()), name="documents-in-workflow"),
    path('verify-document/<int:id>', login_required(DocumentVerificationView.as_view()), name="verify-document")
]
