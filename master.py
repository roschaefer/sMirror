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
        5: "http://localhost/displays/calendar/",
        25: "http://localhost/displays/weather/",
        49: "http://localhost/displays/news/",
        53: "http://localhost/displays/tagesschau100sek/",
        77: "http://localhost/displays/twitter/",
        99: "http://localhost/displays/transit/",
        101: "http://localhost/displays/stocks/",
        96: "http://localhost/displays/sprueche/",
        98: "http://localhost/displays/maus/",
        }


while(True):
    reading=ser.readline()
    print "Reading: %s" % reading
    if reading:
        tagId = int(reading)
        payload  = mapping.get(tagId, None)
        if payload:
            publish_payload(payload) 
