#!/usr/bin/python
import time
import serial
import paho.mqtt.publish as publish

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

actions = [
    [5,  "sMirrorMaster",   "http://smirrormaster.local/displays/calendar/"],
    [5,  "sMirrorSlave005", "http://smirrormaster.local/displays/calendar/"],
    [25, "sMirrorMaster",   "http://smirrormaster.local/displays/weather/"],
    [49, "sMirrorMaster",   "http://smirrormaster.local/displays/news/"],
    [53, "sMirrorMaster",   "http://smirrormaster.local/displays/tagesschau100sek/"],
    [77, "sMirrorMaster",   "http://smirrormaster.local/displays/twitter/"],
    [99, "sMirrorMaster",   "http://smirrormaster.local/displays/transit/"],
    [101,"sMirrorMaster",   "http://smirrormaster.local/displays/stocks/"],
    [96, "sMirrorMaster",   "http://smirrormaster.local/displays/sprueche/"],
    [98, "sMirrorMaster",   "http://smirrormaster.local/displays/maus/"],
]


while(True):
    reading=ser.readline()
    print "Reading: %s" % reading
    if reading:
        try:
            currentTag = int(reading)
            for tag, box, payload in actions:
                if (currentTag == tag):
                    publish_payload(box, payload)
        except ValueError:
            pass
