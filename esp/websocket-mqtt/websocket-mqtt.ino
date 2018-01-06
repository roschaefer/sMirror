#include <Arduino.h>
#include <Stream.h>
#include <Wire.h>
#include <WiFiManager.h>

#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>

//AWS
#include "sha256.h"
#include "Utils.h"

//WEBSockets
#include <Hash.h>
#include <WebSocketsClient.h>

//MQTT PAHO
#include <SPI.h>
#include <IPStack.h>
#include <Countdown.h>
#include <MQTTClient.h>



//AWS MQTT Websocket
#include "Client.h"
#include "AWSWebSocketClient.h"
#include "CircularByteBuffer.h"

unsigned long previousMillis = 0;
const long interval = 5000;  

#include <SimpleDHT.h>

int pinDHT22 = 14;
SimpleDHT22 dht22;
  float temperature = 0.0;
  float humidity = 0.0;
  

#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
#include <avr/power.h>
#endif

#define PIN 4

#define NUM_LEDS 48

#define BRIGHTNESS 255

int wait = 50;
int wait2 = 20;

Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUM_LEDS, PIN, NEO_GRBW + NEO_KHZ800);

//AWS IOT config, change these:
char wifi_ssid[]       = "Kekshuster2";
char wifi_password[]   = "83132007014314226963";
char aws_endpoint[]    = "smirrormaster.local";
const char* aws_topic  = "ledStatus";
const char* dusch_topic = "sMirrorMaster";
int port = 9001;



//MQTT config
const int maxMQTTpackageSize = 512;
const int maxMQTTMessageHandlers = 1;

ESP8266WiFiMulti WiFiMulti;

AWSWebSocketClient awsWSclient(1000);

IPStack ipstack(awsWSclient);
MQTT::Client<IPStack, Countdown, maxMQTTpackageSize, maxMQTTMessageHandlers> *client = NULL;

//# of connections
long connection = 0;

//generate random mqtt clientID
char* generateClientID () {
  char* cID = new char[23]();
  for (int i=0; i<22; i+=1)
    cID[i]=(char)random(1, 256);
  return cID;
}

//count messages arrived
int arrivedcount = 0;

//callback to handle mqtt messages
void messageArrived(MQTT::MessageData& md)
{
  MQTT::Message &message = md.message;

  Serial.print("Message ");
  Serial.print(++arrivedcount);
  Serial.print(" arrived: qos ");
  Serial.print(message.qos);
  Serial.print(", retained ");
  Serial.print(message.retained);
  Serial.print(", dup ");
  Serial.print(message.dup);
  Serial.print(", packetid ");
  Serial.println(message.id);
  Serial.print("Payload ");
  char* msg = new char[message.payloadlen+1]();
  memcpy (msg,message.payload,message.payloadlen);
  Serial.println(msg);
  if (strcmp(msg, "0")  == 0){
    digitalWrite(2, HIGH);
   for(int q = 0;q < 24; q++){
   strip.setPixelColor(q, 0, 0, 0, 0);
   strip.show();
   delay(wait);
   }
  }
  else if (strcmp(msg, "1")  == 0){
    for(int q = 0;q < 24; q++){
   strip.setPixelColor(q, 255, 0, 0, 0);
   strip.show();
   delay(wait);
   }
  }
  else if (strcmp(msg, "2")  == 0){
    for(int q = 0;q < 24; q++){
   strip.setPixelColor(q, 0, 255, 0, 0);
   strip.show();
   delay(wait);
   }
  }
  else if (strcmp(msg, "3")  == 0){
    for(int q = 0;q < 24; q++){
   strip.setPixelColor(q, 0, 0, 255, 0);
   strip.show();
   delay(wait);
   }
  }
  else if (strcmp(msg, "4")  == 0){
    for(int q = 0;q < 24; q++){
   strip.setPixelColor(q, 0, 0, 0, 255);
   strip.show();
   delay(wait);
   }
  }
  else if (strcmp(msg, "5")  == 0){
    for(int q = 24;q < 49; q++){
   strip.setPixelColor(q, 255, 0, 0, 0);
   strip.show();
   delay(wait);
   }
  }
  else if (strcmp(msg, "6")  == 0){
    for(int q = 24;q < 49; q++){
   strip.setPixelColor(q, 0, 255, 0, 0);
   strip.show();
   delay(wait);
   }
  }
  else if (strcmp(msg, "7")  == 0){
    for(int q = 24;q < 49; q++){
   strip.setPixelColor(q, 0, 0, 255, 0);
   strip.show();
   delay(wait);
   }
  }
  else if (strcmp(msg, "8")  == 0){
    for(int q = 24;q < 49; q++){
   strip.setPixelColor(q, 0, 0, 0, 255);
   strip.show();
   delay(wait);
   }
  }
  else if (strcmp(msg, "9")  == 0){
    for(int q = 24;q < 49; q++){
   strip.setPixelColor(q, 0, 0, 0, 0);
   strip.show();
   delay(wait);
   }
  }
  else if (strcmp(msg, "10")  == 0){
    for(int q = 24;q < 49; q++){
   strip.setPixelColor(q, 252, 50, 0, 0);
   strip.show();
   delay(wait);
   }
  }
  else if (strcmp(msg, "11")  == 0){
    for(int q = 0;q < 24; q++){
   strip.setPixelColor(q, 252, 50, 0, 0);
   strip.show();
   delay(wait);
   }
  }
  else if (strcmp(msg, "30")  == 0){
   for(int i = 0; i < 100; i++){ 
    for(int q = 0;q < 49; q++){
   strip.setPixelColor(q, 255, 255, 255, 255);
   }
   strip.show();
   delay(wait2);
   for(int q = 0;q < 49; q++){
   strip.setPixelColor(q, 0, 0, 0, 0);
   }
   strip.show();
   delay(wait2);
   }
  }
   
  
  Serial.println("huhu");
  delete msg;
}

//connects to websocket layer and mqtt layer
bool connect () {

    if (client == NULL) {
      client = new MQTT::Client<IPStack, Countdown, maxMQTTpackageSize, maxMQTTMessageHandlers>(ipstack);
    } else {

      if (client->isConnected ()) {    
        client->disconnect ();
      }  
      delete client;
      client = new MQTT::Client<IPStack, Countdown, maxMQTTpackageSize, maxMQTTMessageHandlers>(ipstack);
    }


    //delay is not necessary... it just help us to get a "trustful" heap space value
    delay (1000);
    Serial.print (millis ());
    Serial.print (" - conn: ");
    Serial.print (++connection);
    Serial.print (" - (");
    Serial.print (ESP.getFreeHeap ());
    Serial.println (")");




   int rc = ipstack.connect(aws_endpoint, port);
    if (rc != 1)
    {
      Serial.println("error connection to the websocket server");
      return false;
    } else {
      Serial.println("websocket layer connected");
    }


    Serial.println("MQTT connecting");
    MQTTPacket_connectData data = MQTTPacket_connectData_initializer;
    data.MQTTVersion = 3;
    char* clientID = generateClientID ();
    data.clientID.cstring = clientID;
    rc = client->connect(data);
    delete[] clientID;
    if (rc != 0)
    {
      Serial.print("error connection to MQTT server");
      Serial.println(rc);
      return false;
    }
    Serial.println("MQTT connected");
    return true;
}

//subscribe to a mqtt topic
void subscribe () {
   //subscript to a topic
    int rc = client->subscribe(aws_topic, MQTT::QOS0, messageArrived);
    if (rc != 0) {
      Serial.print("rc from MQTT subscribe is ");
      Serial.println(rc);
      return;
    }
    Serial.println("MQTT subscribed");
}

//send a message to a mqtt topic
void sendmessage() {
    //send a message
    MQTT::Message message;
    char buf[100];
    //sprintf(buf, "{\"humidity\": %f, \"temperature\": %f}", humidity, temperature);
    strcpy(buf, "http://smirrormaster.local/displays/tagesschau100sek");
    message.qos = MQTT::QOS0;
    message.retained = false;
    message.dup = false;
    message.payload = (void*)buf;
    message.payloadlen = strlen(buf)+1;
    int rc = client->publish(dusch_topic, message); 
    Serial.print("gesendet");
}


void setup() {
    Serial.begin (115200);
    delay (2000);
    Serial.setDebugOutput(1);
    pinMode(2, OUTPUT);

    strip.setBrightness(BRIGHTNESS);
    strip.begin();
    strip.show(); 

   

    WiFiManager wifiManager;
 wifiManager.autoConnect("AutoConnectAP"); 
    while(WiFiMulti.run() != WL_CONNECTED) {
        delay(100);
        Serial.print (".");
    }
    Serial.println ("\nconnected");

    //fill AWS parameters    
    awsWSclient.setPath ("ws://192.168.178.118");


    awsWSclient.setUseSSL(false);

    if (connect ()){
      subscribe ();
    }

}

void loop() {
  //keep the mqtt up and running
  if (awsWSclient.connected ()) {    
      client->yield();
  } else {
    //handle reconnection
    if (connect ()){
      subscribe ();      
    }
  }

  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;
  int humidity1 = humidity;
  
  Serial.println("=================================");
  Serial.println("Sample DHT22...");
  
  // read without samples.
  // @remark We use read2 to get a float data, such as 10.1*C
  //    if user doesn't care about the accurate data, use read to get a byte data, such as 10*C.

  int err = SimpleDHTErrSuccess;
  if ((err = dht22.read2(pinDHT22, &temperature, &humidity, NULL)) != SimpleDHTErrSuccess) {
    Serial.print("Read DHT22 failed, err="); Serial.println(err);delay(2000);
    return;
  }
  
  Serial.print("Sample OK: ");
  Serial.print(temperature);
  Serial.print(" *C, ");
  Serial.print(humidity);
  Serial.println(" RH%");
  
  if (humidity >= 70 && humidity1 < 70){
    sendmessage();
  }
  }

}
