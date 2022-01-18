from django.urls import path, include
from . import views

app_name = 'chat'

urlpatterns = [
    path('send', views.send, name="send"),
    path('getMessages/<str:room>/', views.getMessages, name="getMessages")
]
