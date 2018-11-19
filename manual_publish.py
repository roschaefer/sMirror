#!/usr/bin/python
import paho.mqtt.publish as publish
import argparse
parser = argparse.ArgumentParser(description='Publish a url to a display via mqtt')
parser.add_argument('display', help='display to show, e.g. "gutenMorgen/?name=Till", "news", "maus"')
parser.add_argument('--host', default='smirror.canopus.uberspace.de')
parser.add_argument('--port', default=63126)
parser.add_argument('--topic', default='sMirrorMaster', help="Each box subscribes to a topic, which is usually its name e.g. sMirrorSlave005")
args = parser.parse_args()

url = 'http://displays.smirror.canopus.uberspace.de/' + args.display

publish.single(args.topic, url, hostname=args.host, port=args.port, transport="websockets")



