"""config URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include

# for static files
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth.decorators import login_required
from editor.views import DashboardView

urlpatterns = [
    path('', login_required(DashboardView.as_view()), name="home"),
    #path('', include('pages.urls')), #  home page
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts.urls')),
    path('accounts/', include('django.contrib.auth.urls')),
    path('organization/',include('organization.urls')),
    path('editor/',include('editor.urls')),  #  editor and template routes
    path('workflow/', include('workflow.urls')),
    path('chat/', include('chat.urls')),
    #path('', login_required(TemplateView.as_view(template_name='home.html')),name='home'),

] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)         # To add static files






