#!/usr/bin/python
import paho.mqtt.publish as publish
import argparse
parser = argparse.ArgumentParser(description='Publish a url to a display via mqtt')
parser.add_argument('url', help='the url to publish')
parser.add_argument('--host', default='smirrormaster.local')
parser.add_argument('--topic', default='slave')
args = parser.parse_args()

publish.single(args.topic, args.url, hostname=args.host, port=9001, transport="websockets")



