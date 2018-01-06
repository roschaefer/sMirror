#!/usr/bin/python
import time
import serial
import csv
import paho.mqtt.publish as publish
import httplib2
import os
import datetime
import re
from apiclient import discovery
from oauth2client import client
from oauth2client import tools
from oauth2client.file import Storage

def get_credentials():
    """Gets valid user credentials from storage.

    Returns:
        Credentials, the obtained credential.
    """
    credential_path = os.path.relpath('calendar-python-quickstart.json')

    store = Storage(credential_path)
    credentials = store.get()
    if not credentials or credentials.invalid:
        raise "Stored credentials missing or invalid"
    return credentials

def get_calendar_events(searchedReminder):
    """Shows basic usage of the Google Calendar API.

    Creates a Google Calendar API service object and outputs a list of the next
    10 events on the user's calendar.
    """
    credentials = get_credentials()
    http = credentials.authorize(httplib2.Http())
    service = discovery.build('calendar', 'v3', http=http)

    last_midnight = datetime.datetime.combine(datetime.date.today(), datetime.time.min)
    last_midnight = last_midnight.isoformat() + 'Z'
    print 'Getting the upcoming 250 events'
    eventsResult = service.events().list(
        calendarId='primary', timeMin=last_midnight, singleEvents=True,
        orderBy='startTime').execute()
    events = eventsResult.get('items', [])

    for event in events:
        summary = str.strip(str(event['summary']))
        summary = re.sub('\s+', ' ', summary)
        try:
            reminder = re.search('REMINDER: (\S+)', summary, flags=re.IGNORECASE).group(1)
            if (str.strip(reminder).lower() == str.strip(searchedReminder).lower()):
                return True
        except AttributeError:
            pass # no matches
    return False

last_payload = None
def publish_payload(box, payload):
    global last_payload
    if(last_payload != payload):
        last_payload = payload
        publish.single(box, last_payload, hostname="sMirrorMaster", port=9001, transport="websockets")
        print "Published %s" % last_payload

ser=serial.Serial(
        port='/dev/serial0',
        baudrate=9600,
        parity=serial.PARITY_NONE,
        stopbits=serial.STOPBITS_ONE,
        bytesize=serial.EIGHTBITS,
        timeout=1
        )

actions = []
with open('actions.csv', 'rb') as f:
    reader = csv.reader(f)
    for tag, box, payload, reminder in list(reader):
        actions.append([int(tag), str.strip(box), str.strip(payload), str.strip(reminder)])

while(True):
    reading=ser.readline()
    print "Reading: %s" % reading
    if reading:
        try:
            currentTag = int(reading)
            for tag, box, payload, searchedReminder in actions:
                if(currentTag == tag):
                    if(searchedReminder):
                        if(get_calendar_events(searchedReminder)):
                            publish_payload(box, payload)
                    else:
                        publish_payload(box, payload)
        except ValueError:
            pass


