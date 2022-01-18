from django.shortcuts import render
from .models import Room, Message
from django.http import HttpResponse, JsonResponse

# Create your views here
def home(request):
    return render(request, "basicChat/chat.html")



def send(request):
    if request.method=="POST":
        message = request.POST.get('message')
        username = request.POST.get('username')
        room=request.POST.get('room')
        
        print(room)
        if Room.objects.filter(name=room).exists():
            print("Confirmed, Room exists")
            new_message = Message(value=message, user=username, room=room)
            new_message.save()
            
        else:
            new_room = Room(name=room)
            new_room.save()
            new_message = Message(value=message, user=username, room=room)
            new_message.save()   
    

def getMessages(request,  room):
    messages = Message.objects.filter(room=room)
    return JsonResponse({"messages": list(messages.values())})

