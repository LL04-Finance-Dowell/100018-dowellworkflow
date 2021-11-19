import os
import json
import random
from accounts.models import CustomUser
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.conf import settings
from django.core.files import File
from .models import EditorFile


def editor(request):
    users = CustomUser.objects.all()    
    return render(request, 'editor/editor.html', {'users':users})


def get_name():
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0987654321'
    string = ''

    for _ in range(10):
        string += chars[random.randrange(0, len(chars) - 1 , 1)]

    return string

def save_file(request):
    body = json.loads(request.body)
    fileObj = None
    path = ''

    if body['file_id'] :
        try:
            fileObj = get_object_or_404(EditorFile, id=body['file_id'])
            path = fileObj.file.path
        except:
            return JsonResponse({ 'error': 'File not found'})
    else:
        name = get_name()
        path = os.path.join(settings.MEDIA_ROOT, name + '.json')
        fileObj = EditorFile(name=name, file=path, created_by=request.user)

    with open(path, 'w') as file:
        file.write(json.dumps(body['content']))

    if fileObj:
        fileObj.save()

    file_obj = {
        'file_id': fileObj.id,
        'name': fileObj.name,
        'file': fileObj.file.path,
        'created_by': fileObj.created_by.id
    }


    return JsonResponse({ 'status': 'OK' , 'file': file_obj})

def get_files(request):
    files = EditorFile.objects.filter(created_by=request.user)

    file_list = []

    for file in files:
        data = None
        
        with open(file.file.path, 'r') as ff:
            data = json.loads(ff.read())

        f = {
            'file_id': file.id,
            'name': file.name,
            'file': data,
            'created_by': file.created_by.id
        }

        file_list.append(f)

    return JsonResponse({ 'file': file_list })    

def editor_file(request):
    data = None
    if request.method == 'POST':
        body = json.loads(request.body)
        file = get_object_or_404(EditorFile, id=body['id'])

        with open(file.file.path, 'r') as f:
            data = f.read()

    return JsonResponse({ 'file': data })