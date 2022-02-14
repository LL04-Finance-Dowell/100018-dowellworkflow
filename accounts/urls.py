from django.urls import path
from django.contrib.auth.decorators import login_required
from .views import SignUpView, sendUserList

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('users/', login_required(sendUserList), name="get-users")
]