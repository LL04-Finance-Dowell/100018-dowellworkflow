from django.urls import path
from django.contrib.auth.decorators import login_required

from .views import home, company, organization, department, error, home_page,dashboard_pages, one_compact, member

app_name = 'pages'

urlpatterns = [
    # path('', login_required(home), name='home'),
    path('', login_required(home_page), name='home'),
    path('dashboard-pages/', login_required(dashboard_pages), name="dashboard-pages"),
    path('company/', login_required(company), name='company'),
    path('organization/', login_required(organization), name='organizations'),
    path('department/', login_required(department), name='departments'),
    path('member/', login_required(member), name='members'),
    path('one-compact/', login_required(one_compact), name='one-compact'),
    path('error/', error, name='error'),
]