from django.urls import path
from django.contrib.auth.decorators import login_required
from . import views

app_name = 'editor'

urlpatterns = [
    path('', login_required(views.editor), name="editor"),
    path('api/save-file/', login_required(views.save_file), name="save-file"),
    path('api/file-list/', login_required(views.get_files), name="files-list"),
    path('api/get-file/', login_required(views.editor_file), name="get-file")
    
]