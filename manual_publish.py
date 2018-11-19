#!/usr/bin/python
import paho.mqtt.publish as publish
import argparse
parser = argparse.ArgumentParser(description='Publish a url to a display via mqtt')
parser.add_argument('url', help='the url to publish')
parser.add_argument('--host', default='smirror.canopus.uberspace.de')
parser.add_argument('--port', default=63126)
parser.add_argument('--topic', default='slave')
args = parser.parse_args()

publish.single(args.topic, args.url, hostname=args.host, port=args.port, transport="websockets")



