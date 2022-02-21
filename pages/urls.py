from django.urls import path
from django.contrib.auth.decorators import login_required

from .views import homePageView, error

app_name = 'pages'

urlpatterns = [
    path('', login_required(error), name='error'),
]