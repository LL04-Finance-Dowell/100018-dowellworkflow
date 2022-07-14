from django.urls import path
from django.contrib.auth.decorators import login_required
from . import views
from .views import DocumentCreateView, Editor, TemplateEditor, CreateTemplate, DocumentCreatedListView, DocumentWorkFlowAddView, DocumentExecutionListView, DocumentVerificationView, DashboardView, StatusView2, RequestedDocuments,PreviousDocuments, AdminOrgManagement#,StatusViewDummy
from .views import DocumentViewer, testing_editor, documentRejectionRequest, RejectedDocuments, InvalidDocuments

app_name = 'editor'

urlpatterns = [

    path('<int:company_id>/testing_editor/', testing_editor, name="testing-editor"),
    #   editor related routes
    path('<int:company_id>/<int:doc_id>/', login_required(Editor.as_view()), name="editor"),
    path('<int:company_id>/verify-document/<int:doc_id>', login_required(DocumentVerificationView.as_view()), name="verify-document"),
    path('<int:company_id>/<int:org_id>/create-document/', login_required(DocumentCreateView.as_view()), name="create-document"),
    path('<int:company_id>/<int:org_id>/<int:project_id>/create-document/', login_required(DocumentCreateView.as_view()), name="create-project-document"),

    path('api/save-file/', login_required(views.save_file), name="save-file"),
    path('api/file-list/', login_required(views.get_files), name="files-list"),
    path('api/get-file/', login_required(views.editor_file), name="get-file"),
    path('api/save-template/', login_required(views.save_template), name="save-template"),

    path('<int:company_id>/view-doc/<int:doc_id>/', login_required(DocumentViewer.as_view()), name="doc-viewer"),
    #   template related routes

    path('<int:company_id>/template-editor/<int:temp_id>/', login_required(TemplateEditor.as_view()), name="template-editor"),
    #   path('<int:company_id>/<int:org_id>/<int:project_id/create-template', login_required(CreateTemplate.as_view()), name="create-template"),

    #   document related routes
    path('<int:company_id>/add-document/', login_required(DocumentWorkFlowAddView.as_view()), name="add-document"),
    path('<int:company_id>/created-document-list/', login_required(DocumentCreatedListView.as_view()), name='created-document-list'),
    path('<int:company_id>/documents-in-workflow/', login_required(DocumentExecutionListView.as_view()), name="documents-in-workflow"),
    path('<int:company_id>/rejected-documents/', login_required(RejectedDocuments.as_view()), name="rejected-documents"),
    path('<int:company_id>/invalid-documents/', login_required(InvalidDocuments.as_view()), name="invalid-documents"),


    path('<int:company_id>/reject-document-request/', login_required(documentRejectionRequest), name="reject-document-request"),

    ##Requested Documents
    path('<int:company_id>/requested-docs/', login_required(RequestedDocuments.as_view()), name="requested-docs"),

    # dashboard related routes
    path('<int:company_id>/get-dashboard/', login_required(DashboardView.as_view()), name="get-dashboard"),
    path('<int:company_id>/<int:project_id>/get-member-dashboard/', login_required(DashboardView.as_view()), name="get-member-dashboard"),

    path('<int:company_id>/get-dashboard-admin/', login_required(views.dashboard_admin), name="get-dashboard-admin"),
    path('<int:company_id>/admin-org-management/<int:org_id>', login_required(AdminOrgManagement.as_view()), name="admin-org-management"),

    # path('get-status/', login_required(views.get_status), name="get-status"),
    path('<int:company_id>/get-status/<slug:status>', login_required(StatusView2.as_view()), name="get-status"),
    #path('<int:company_id>/get-status-dummy/<slug:status>', login_required(StatusView.as_view()), name="get-status-dummy"),



    #get previous documents
    path('<int:company_id>/get-prevdocuments/', login_required(PreviousDocuments.as_view()), name="get-prevdocuments"),
    path('get-pdf/', login_required(views.get_pdf), name="get_pdf"),
    path('get-pdf-json/', login_required(views.get_pdf_json), name="get_pdf_json"),
    # path('get-prevdocuments/', login_required(views.previous_documents), name="get-prevdocuments"),
    # path('get-templates/', login_required(views.previous_templates), name="get-templates"),
    path('dsh/', login_required(views.dashboard2), name="dsh"),
    path('company/', login_required(views.company), name='company'),
    path('organization/', login_required(views.organization), name='organizations'),
    path('department/', login_required(views.department), name='departments'),

]