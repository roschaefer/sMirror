#!/usr/bin/envpython
import time
import serial
import paho.mqtt.publish as publish
from datetime import datetime, timedelta

last_publication = datetime.now()
def publish(url):
    if (datetime.now() - last_publication > timedelta(seconds=5)):
        publish.single("slave", url, hostname="sMirrorMaster", port=9001, transport="websockets")
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
        publish("http://localhost:8000/displays/weather/")
    else:
        print "No reading"
        publish("http://localhost:8000/displays/transit/")



