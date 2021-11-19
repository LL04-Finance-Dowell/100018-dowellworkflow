from django.shortcuts import render

from .models import Message, Conversation

# Create your views here

def chat_index(request):
    return render(request, 'chat/c_index.html', {})