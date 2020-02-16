#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>

#define ALARM_POWER D5
#define ALARM_INPUT D8
#define CONNECTION_LED D0
#define ALARM_LED D3

#define SSID "WIFI_SSID_HERE"
#define PASSWORD "WIFI_PASSWORD_HERE"

const String APPLICATION_TOKEN = "APPLICATION_TOKEN_HERE";
const String USER_TOKEN = "USER_TOKEN_HERE";

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
}

void loop() {
  connecting();
  digitalWrite(ALARM_POWER, HIGH);

  if (digitalRead(ALARM_INPUT) == HIGH) {
    digitalWrite(ALARM_LED, HIGH);
    postUpdate();
    delay(240000);
  } else {
    digitalWrite(ALARM_LED, LOW);
  }
  digitalWrite(ALARM_POWER, LOW);
  delay(30000);
}

void connecting() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println();
    Serial.print("Connecting to ");
    Serial.println(SSID);

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

void postUpdate() {
  Serial.println("Connecting to api.pushover.net...");
  client.setInsecure();
  String body = "token=" + APPLICATION_TOKEN + "&user=" + USER_TOKEN
              + "&title=Water%20Detected&message=Water%20was%20detected%20by%20your%20alarm&priority=1";
  String contentLength = "Content-Length: ";
  contentLength += body.length();

  if (client.connect("api.pushover.net", 443)) {
    Serial.println("Connected");

    client.println("POST /1/messages.json HTTP/1.1");
    client.println("Host: api.pushover.net");
    client.println("User-Agent: ESP8266-water-alarm");
    client.println("Content-Type: application/x-www-form-urlencoded");
    client.println(contentLength);
    client.println();
    client.print(body);
    client.println();

    client.flush();
    Serial.println(client.readString());
  } else {
    Serial.println("Failed to connect");
  }
}
