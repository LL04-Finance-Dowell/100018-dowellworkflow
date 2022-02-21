
from django.views.decorators.clickjacking import xframe_options_exempt
from django.urls import reverse_lazy
from django.views.generic import CreateView
from .forms import CustomUserCreationForm
from django.http import JsonResponse
from django.shortcuts import render
from .models import CustomUser


class SignUpView(CreateView):
	form_class = CustomUserCreationForm
	success_url = reverse_lazy('login')
	template_name = 'registration/signup.html'



@xframe_options_exempt
def sendUserList(request):
    users = CustomUser.objects.all()
    user_list = []

    for user in users :
        u = {
            'id': user.id,
            'username': user.username,
        }
        user_list.append(u)

    return JsonResponse({'user_list': user_list })

def user_profile_view(request):
    return render(request, 'accounts/profile.html', {})
