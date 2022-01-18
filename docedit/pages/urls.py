from django.urls import path
from django.contrib.auth.decorators import login_required

from .views import homePageView

urlpatterns = [
    path('', login_required(homePageView), name='home'),
]