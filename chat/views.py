from django.shortcuts import render
from .models import Room, Message
from django.http import JsonResponse
from django.contrib import messages
from datetime import datetime, timedelta

# Create your views here
def test(request):
    return render(request, "chat/layoutTest.html")



def send(request):
    if request.method=="POST":
        auth_users=request.POST.get('auth_users')
        message = request.POST.get('message')
        username = request.POST.get('username')
        room=request.POST.get('room')

        if username in auth_users:
            if Room.objects.filter(name=room).exists():
                print("Confirmed, Room exists")
                new_message = Message(value=message, user=username, room=room)
                new_message.save()
                #messages.success(request, "Comment sent")

            else:
                new_room = Room(name=room)
                new_room.save()
                new_message = Message(value=message, user=username, room=room)
                new_message.save()
                messages.warning(request, "Comment sent")
        else:
            messages.warning(request, "You do not have the necessary privileges to comment")


def getMessages(request, room):
    user=request.user
    user_messages = Message.objects.filter(user=user, room=room)
    user_messages_count=user_messages.count()
    if user_messages_count > 0:
        first_message=user_messages.order_by('date')[1]
        first_message_date=first_message.date
        messages = Message.objects.filter(room=room, date__gte = first_message_date)
        return JsonResponse({"messages": list(messages.values())})
    else:
        pass
        #messages ={"messages": [{"value": "No Message", "user": "George"}]}
        #return JsonResponse({"messages": list(messages.values())})


