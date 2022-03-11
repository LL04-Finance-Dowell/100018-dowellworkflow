from django.urls import path
from django.contrib.auth.decorators import login_required
from . import views
from .views import DocumentCreateView, Editor, TemplateEditor, CreateTemplate, DocumentCreatedListView, DocumentWorkFlowAddView, DocumentExecutionListView, DocumentVerificationView, DashboardView, StatusView, RequestedDocuments,PreviousDocuments, AdminOrgManagement#,StatusViewDummy
from .views import testing_editor, documentRejectionRequest, RejectedDocuments

app_name = 'editor'

urlpatterns = [

    path('testing_editor/', testing_editor, name="testing-editor"),
    #   editor related routes
    path('<int:id>/', login_required(Editor.as_view()), name="editor"),
    path('create-document/', login_required(DocumentCreateView.as_view()), name="create-document"),
    path('api/save-file/', login_required(views.save_file), name="save-file"),
    path('api/file-list/', login_required(views.get_files), name="files-list"),
    path('api/get-file/', login_required(views.editor_file), name="get-file"),


    #   template related routes
    path('api/save-template/', login_required(views.save_template), name="save-template"),
    path('template-editor/<int:id>/', login_required(TemplateEditor.as_view()), name="template-editor"),
    path('create-template', login_required(CreateTemplate.as_view()), name="create-template"),

    #   document related routes
    path('add-document/', login_required(DocumentWorkFlowAddView.as_view()), name="add-document"),
    path('created-document-list/', login_required(DocumentCreatedListView.as_view()), name='created-document-list'),
    path('documents-in-workflow/', login_required(DocumentExecutionListView.as_view()), name="documents-in-workflow"),
    path('rejected-documents/', login_required(RejectedDocuments.as_view()), name="rejected-documents"),
    path('verify-document/<int:id>', login_required(DocumentVerificationView.as_view()), name="verify-document"),
    path('reject-document-request/', login_required(documentRejectionRequest), name="reject-document-request"),

    ##Requested Documents
    path('requested-docs/', login_required(RequestedDocuments.as_view()), name="requested-docs"),

    # dashboard related routes
    path('get-dashboard/', login_required(DashboardView.as_view()), name="get-dashboard"),
    path('get-dashboard-admin/', login_required(views.dashboard_admin), name="get-dashboard-admin"),
    path('admin-org-management/<int:org_id>', login_required(AdminOrgManagement.as_view()), name="admin-org-management"),

    # path('get-status/', login_required(views.get_status), name="get-status"),
    path('get-status/<slug:status>', login_required(StatusView.as_view()), name="get-status"),
    path('get-status-dummy/<slug:status>', login_required(StatusView.as_view()), name="get-status-dummy"),



    #get previous documents
     path('get-prevdocuments/', login_required(PreviousDocuments.as_view()), name="get-prevdocuments"),
     path('get-pdf/', login_required(views.get_pdf), name="get_pdf"),
     path('get-pdf-json/', views.get_pdf_json, name="get_pdf_json"),
    # path('get-prevdocuments/', login_required(views.previous_documents), name="get-prevdocuments"),
    # path('get-templates/', login_required(views.previous_templates), name="get-templates"),


]