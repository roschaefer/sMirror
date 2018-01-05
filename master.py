#!/usr/bin/env/python
import time
import serial
import paho.mqtt.publish as publish

last_payload = None
def publish_payload(payload):
    global last_payload
        if (last_payload != payload):
            last_payload = payload
            publish.single("slave", last_payload, hostname="sMirrorMaster", port=9001, transport="websockets")
            print "published %s" % last_payload

ser=serial.Serial(
    port='/dev/serial0',
    baudrate=9600,
    parity=serial.PARITY_NONE,
    stopbits=serial.STOPBITS_ONE,
    bytesize=serial.EIGHTBITS,
    timeout=1
)

mapping = {
        '5': "http://localhost:8000/displays/calendar/",
        '25': "http://localhost:8000/displays/weather/",
        '49': "http://localhost:8000/displays/news/",
        '53': "http://localhost:8000/displays/tagesschau100sek/",
        '77': "http://localhost:8000/displays/twitter/",
        '99': "http://localhost:8000/displays/transit/",
        '101': "http://localhost:8000/displays/stocks/",
        '96': "http://localhost:8000/displays/sprueche/",
        '98': "http://localhost:8000/displays/maus/",
}


while(True):
    tagId=ser.readline()
    if tagId:
        print "Reading: %s" % tagId 
        publish_payload(mapping[tagId])



