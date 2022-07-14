import json
import requests
from datetime import datetime


def get_event_id():
    dd=datetime.now()
    time=dd.strftime("%d:%m:%Y,%H:%M:%S")
    url="https://100003.pythonanywhere.com/event_creation"
    data={
        "platformcode":"FB",
        "citycode":"101",
        "daycode":"0",
        "dbcode":"pfm" ,
        "ip_address":"192.168.0.41",
        "login_id":"lav",
        "session_id":"new",
        "processcode":"1",
        "regional_time":time,
        "dowell_time":time,
        "location":"22446576",
        "objectcode":"1",
        "instancecode":"100051",
        "context":"afdafa ",
            "document_id":"3004",
            "rules":"some rules",
            "status":"work"
        }


    r=requests.post(url,json=data)
    return r.text

def get_dowellclock():
    response_dowell = requests.get('https://100009.pythonanywhere.com/dowellclock')
    data = response_dowell.json()
    return data['t1']


def save_template_entry(template):
    url = "http://100002.pythonanywhere.com/"
    #   searchstring="ObjectId"+"("+"'"+"6139bd4969b0c91866e40551"+"'"+")"

    event_id = get_event_id()
    dowelltime = get_dowellclock()
    print("EVENT_ID", event_id)
    print("DOWELLTIME", dowelltime)
    payload = json.dumps({
        "cluster": "Documents",
        "database": "Documentation",
        "collection": "TemplateReports",
        "document": "templatereports",
        "team_member_ID": "11689044433",
        "function_ID": "ABCDE",
        "command": "insert",
        "field": {
            'eventId': event_id,
            'dowelltime': dowelltime,
            'template_name': template.template_name,
            'created_by': template.created_by.username,
        },
        "update_field": {
            "order_nos": 21
        },

        "platform": "bangalore"
    })

    headers = {
        'Content-Type': 'application/json'
    }

    response = requests.request("POST", url, headers=headers, data=payload)

    return response.text




def save_workflow_report(workflow, user):
    url = "http://100002.pythonanywhere.com/"
    #   searchstring="ObjectId"+"("+"'"+"6139bd4969b0c91866e40551"+"'"+")"

    event_id = get_event_id()
    dowelltime = get_dowellclock()

    payload = json.dumps({
        "cluster": "Documents",
        "database": "Documentation",
        "collection": "WorkflowReports",
        "document": "workflowreports",
        "team_member_ID": "11689044433",
        "function_ID": "ABCDE",
        "command": "insert",
        "field": {
            'event_id': event_id,
            'dowelltime': dowelltime,
            'workflow_title': workflow.title,
            'created_by': user.username
        },
        "update_field": {
            "order_nos": 21
        },

        "platform": "bangalore"
    })

    headers = {
        'Content-Type': 'application/json'
    }

    response = requests.request("POST", url, headers=headers, data=payload)

    return response.text



def save_document_entry(document):
    url = "http://100002.pythonanywhere.com/"
    #   searchstring="ObjectId"+"("+"'"+"6139bd4969b0c91866e40551"+"'"+")"

    event_id = get_event_id()
    dowelltime = get_dowellclock()

    payload = json.dumps({
        "cluster": "Documents",
        "database": "Documentation",
        "collection": "DocumentReports",
        "document": "documentreports",
        "team_member_ID": "11689044433",
        "function_ID": "100018",
        "command": "insert",
        "field": {
            'event_id': event_id,
            'dowelltime': dowelltime,
            'document_title': document.document_name,
            'created_by': document.created_by.username
        },
        "update_field": {
            "order_nos": 21
        },

        "platform": "bangalore"
    })

    headers = {
        'Content-Type': 'application/json'
    }

    response = requests.request("POST", url, headers=headers, data=payload)

    return response.text
