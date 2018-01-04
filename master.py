#!/usr/bin/envpython
import time
import serial
import paho.mqtt.publish as publish
from datetime import datetime, timedelta

last_publication = datetime.now()
last_event = None
def publish_event(url):
    global last_publication, last_event
    if (datetime.now() - last_publication > timedelta(seconds=5)):
        if (last_event != url):
            last_event = url
            publish.single("slave", last_event, hostname="sMirrorMaster", port=9001, transport="websockets")
            print "published %s" % last_event
            last_publication = datetime.now()

ser=serial.Serial(
    port='/dev/serial0',
    baudrate=9600,
    parity=serial.PARITY_NONE,
    stopbits=serial.STOPBITS_ONE,
    bytesize=serial.EIGHTBITS,
    timeout=1
)

while(True):
    x=ser.readline()
    if x:
        print "Reading: %s" % x
        publish_event("http://localhost:8000/displays/weather/")
    else:
        print "No reading"
        publish_event("http://localhost:8000/displays/transit/")



