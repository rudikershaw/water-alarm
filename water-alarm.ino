#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>

#define ALARM_POWER D5
#define ALARM_INPUT D8
#define CONNECTION_LED D0
#define ALARM_LED D3

#define SSID "FILL_IN_WIFI_SSID_HERE"
#define PASSWORD "PASSWORD_HERE"

const String APPLICATION_TOKEN = "APPLICATION_TOKEN_HERE";
const String USER_TOKEN = "USER_TOKEN_HERE";

bool alarm = false;
WiFiClientSecure client;

void setup() {
  pinMode(ALARM_POWER, OUTPUT);
  pinMode(ALARM_INPUT, INPUT);
  pinMode(CONNECTION_LED, OUTPUT);
  pinMode(ALARM_LED, OUTPUT);
  digitalWrite(CONNECTION_LED, LOW);
  digitalWrite(ALARM_LED, LOW);
  digitalWrite(ALARM_POWER, LOW);

  Serial.begin(9600);
  Serial.println();

  WiFi.disconnect(true);
  WiFi.begin(SSID, PASSWORD);

  Serial.print("Wifi connecting to ");
  Serial.println(SSID);
  connecting();
}

void loop() {
  connecting();
  delay(30000);
  digitalWrite(ALARM_POWER, HIGH);
  if (digitalRead(ALARM_INPUT) == HIGH) {
    alarm = true;
    digitalWrite(ALARM_LED, HIGH);
    postUpdate("true");
  } else {
    digitalWrite(ALARM_LED, LOW);
    alarm = false;
    postUpdate("false");
  }
  digitalWrite(ALARM_POWER, LOW);
}

void connecting() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println();
    Serial.print("Connecting");

    while(WiFi.status() != WL_CONNECTED) {
      digitalWrite(CONNECTION_LED, HIGH);
      delay(500);
      digitalWrite(CONNECTION_LED, LOW);
      delay(500);
      Serial.print(".");
    }

    digitalWrite(CONNECTION_LED, HIGH);
    Serial.println();
    Serial.println("Connected");
  }
}

void postUpdate(String parameter) {
  if (client.connect("api.pushover.net", 443)) {

    Serial.println("Connected to api.pushover.net");

    client.println("GET /1/messages.json HTTP/1.1");
    client.println("Host: api.pushover.net");
    client.println("Connection: close");
    client.println("User-Agent: ESP8266-water-alarm");
    client.println("");
    client.print("token=" + APPLICATION_TOKEN);
    client.print("&user=" + USER_TOKEN);
    client.print("&title=Water%20Detected");
    client.print("&message=Water%20was%20detected%20by%20your%20alarm");
    client.print("&priority=1");
    client.println("");

    long timeout = millis() + 2000;
    long timeNow = 0;

    while ((timeNow = millis()) < timeout) {
      while (client.available()) {
        char c = client.read();
        Serial.print(c);
      }
    }
  }
}
