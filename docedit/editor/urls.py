from django.urls import path
from django.contrib.auth.decorators import login_required
from . import views
from .views import DocumentCreateView, Editor, TemplateEditor, CreateTemplate, DocumentCreatedListView, DocumentWorkFlowAddView, DocumentExecutionListView, DocumentVerificationView


app_name = 'editor'

urlpatterns = [
    path('<int:id>/', login_required(Editor.as_view()), name="editor"),
    path('create-document/', login_required(DocumentCreateView.as_view()), name="create-document"),
    path('api/save-file/', login_required(views.save_file), name="save-file"),
    path('api/file-list/', login_required(views.get_files), name="files-list"),
    path('api/get-file/', login_required(views.editor_file), name="get-file"),

    path('api/save-template/', login_required(views.save_template), name="save-template"),
    path('template-editor/<int:id>/', login_required(TemplateEditor.as_view()), name="template-editor"),
    path('create-template', login_required(CreateTemplate.as_view()), name="create-template"),

    path('add-document/', login_required(DocumentWorkFlowAddView.as_view()), name="add-document"),
    path('created-document-list/', login_required(DocumentCreatedListView.as_view()), name='created-document-list'),
    path('documents-in-workflow/', login_required(DocumentExecutionListView.as_view()), name="documents-in-workflow"),
    path('verify-document/<int:id>', login_required(DocumentVerificationView.as_view()), name="verify-document")

]
