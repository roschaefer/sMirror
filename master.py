#!/usr/bin/envpython
import time
import serial
import paho.mqtt.publish as publish

ser=serial.Serial(
        port='/dev/serial0',
        baudrate=9600,
        parity=serial.PARITY_NONE,
        stopbits=serial.STOPBITS_ONE,
        bytesize=serial.EIGHTBITS,
        timeout=1
        )
counter=0

delay = 0
while(True):
    x=ser.readline()
    if x:
        print("Turn on LED")
        publish.single("ledStatus", "1", hostname="raspberrypi")
        delay = 0
    else:
        delay = delay + 1
    if (delay > 200):
        print("Turn off LED")
        publish.single("ledStatus", "0", hostname="raspberrypi")



