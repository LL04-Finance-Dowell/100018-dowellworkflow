from django.contrib import admin
from django.urls import path,include

# for static files
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth.decorators import login_required
from editor.views import dashboard

urlpatterns = [
    path('', login_required(dashboard), name="home"),
    #path('', include('pages.urls')), #  home page
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts.urls')),
    path('accounts/', include('django.contrib.auth.urls')),
    path('organization/',include('organization.urls')),
    path('organizationv2/',include('organizationv2.urls')),
    path('editor/',include('editor.urls')),  #  editor and template routes
    path('workflow/', include('workflow.urls')),
    path('chat/', include('chat.urls')),
    path('admin_v2/', include('admin_v2.urls')),
    #path('', login_required(TemplateView.as_view(template_name='home.html')),name='home'),

] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)         # To add static files






