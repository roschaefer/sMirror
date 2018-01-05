#!/usr/bin/python
import time
import serial
import paho.mqtt.publish as publish

last_payload = None
def publish_payload(payload):
    global last_payload
    if(last_payload != payload):
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
        5: "http://smirrormaster.local/displays/calendar/",
        25: "http://smirrormaster.local/displays/weather/",
        49: "http://smirrormaster.local/displays/news/",
        53: "http://smirrormaster.local/displays/tagesschau100sek/",
        77: "http://smirrormaster.local/displays/twitter/",
        99: "http://smirrormaster.local/displays/transit/",
        101: "http://smirrormaster.local/displays/stocks/",
        96: "http://smirrormaster.local/displays/sprueche/",
        98: "http://smirrormaster.local/displays/maus/",
        }


while(True):
    reading=ser.readline()
    print "Reading: %s" % reading
    if reading:
        tagId = int(reading)
        payload  = mapping.get(tagId, None)
        if payload:
            publish_payload(payload) 
