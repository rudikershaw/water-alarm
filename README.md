# Water Alarm with Mobile App

Open source hardware and software water alarm with app which notifies you when water is detected.

The hardware for the water alarm consists primarily of a NodeMCU ESP8266 development board, and a makeshift shield that supports the water detecting probe and two status LED. At the time of writing this, the consumable components for building the water alarm hardware costed approximately £8, including post and packaging. It is worth noting however that many of these components cannot be bought as singular items. Although a white LED costs approximately £0.10, you will find it difficult to buy a single white LED.

## App Setup

In order to receive notifications to a device, we will be using [Pushover](https://pushover.net/).

* Navigate to the [pushover website](https://pushover.net/).
* Sign up for an account.
* Create a new application.
* Subscribe to your application.
* Take note of the application API token, and your user token.

You can now install pushover on your device of choice (Android/IOs) and login. You will be on a 7 day free trail for receiving notifications from your new application. Once you have confirmed your water alarm is working, you can use a 1 time purchase to permanently use pushover for receiving notifications on this device (£4.70 at the time or writing).

## Required Parts
![Visual of required parts](documentation/parts.jpg "Required parts")

### Pictured above (approximately left-to-right);
* Female PCB header x2 (at least 15 sockets in length)
* 220 ohm resistor x2
* 100k ohm resistror
* Solid core wire
* 2 pin screw terminal
* Red LED
* White LED
* Universal circuit board (at least 14 by 20)
* NodeMCU ESP8266 development board
* Solder

### Additionally you will likely need;
* Soldering iron
* Wire cutters
* Wire stripper
* USB to mini USB cable (with data)
* Mini USB power cable
* Small stainless steel sheet (3cm by 6cm should be more than enough)
* Solderless breadboard

## Assembly and Installation

Using the schematic below and a [solderless breadboard](http://wiring.org.co/learning/tutorials/breadboard/), assemble the basic components of the water alarm and connect them up to your NodeMCU ESP8266 development board. Please note, the switch labelled `Water detector` need only be two unconnected loose wires for the time being. When these two loose wires make contact with water a circuit is completed and the alarm will trigger. We will convert them to something more robust when we get to soldering it all down.

![Schematic for the detector](documentation/schematic.jpg "Alarm Schematic")

Once everything is connected as shown above, you will want to flash the `water-alarm.ino` file in this directory onto your board ready for testing. To do this you will need the [Arduino IDE](https://www.arduino.cc/en/main/software) installed, and you will need to follow the instructions for installing the ESP8266 boards on the IDE in order to flash software onto it. You can find instructions for installing these boards using the `Boards Manager`[here](https://arduino-esp8266.readthedocs.io/en/latest/installing.html#installing).

Once the appropriate ESP8266 boards have been installed in your Arduino IDE;

1. Plug the NodeMCU ESP8266 development board into your computer via USB with data.
2. Open your Arduino IDE (if you have not already).
3. From the toolbar select File > Open and then choose the water-alarm.ino from this directory.
4. From the toolbar select Tools > Port > Your port.
5. Change the `SSID`, `PASSWORD`, `APPLICATION_TOKEN`, and `USER_TOKEN` variables to your own values**.
6. From the toolbar select Sketch > Upload.

> ** The `SSID` is for your wireless connection, `PASSWORD` is the password for your wifi, `APPLICATION_TOKEN` is the API token for your pushover application that you should have set up prior to setting the hardware up, and `USER_TOKEN` is a pushover user or user-group token.  

Once the program has finished uploading to the device, the white LED should start to flash to indicate that is connecting to the WIFI. Once it has connected the white LED should be fully illuminated as long as the connection holds. Touch the two loose wires of the water detector into some water and hold them there for up to 30 seconds. The red LED should illuminate to indicate that water was detected. You should now receive a notification on the device via the Pushover app.

Once you've confirmed your setup is working correctly, it is time to solder everything down and finalize your build.

## Final Touches

### The Water Detector

You can make do with just two loose wires if you so desire, but it is possible that they will eventually oxidise and stop conducting. A more robust and permanent solution is to solder a stainless steal plates to each wire and fix them at a specific width apart. You can increase the surface area of the plates by punching small holes or strips into each. This ensures they stay conductive for longer.

![Water Detector](documentation/detector.jpg "Water Detector")

### The Makeshift Shield

Although not strictly essential to the functioning of the device, you might want to solder this all down and make it a bit more permanent. But you probably don't want to make it so permanent that you can't re-use the Node MCU micro-controller.

To that end, we can solder the circuit, and some pin headers, onto a universal board and then use the headers to attach the full soldered circuit to the micro-controller. This "makeshift shield" can then be added to, and removed from, the micro-controller easily.

![Adding Headers](documentation/shield-start.jpg "Adding Headers")

Position the headers on the universal breadboard (as above) and check that this intended position will allow you to attach the headers to your micro-controller. Once you are sure you have the correct position, solder down a few choice pins on the headers so that they stay in place.

From here, reproduce the circuit you got working on the breadboard on your new universal PCB and solder it down. You should end up with something like the following:

![Shield](documentation/makeshift-shield.jpg "Shield")

The 2 pin screw terminal can be used to attach the water detector to your new shield. It is important to use this component, rather than solder the detector directly into the shield, because you may need to replace the detector if it rusts too severely.

### Water Proofing

Given that your device will likely sit somewhere damp, and will likely get wet in the event that it detects water, it is best to add some water proofing.

It is up to you how you achieve this, but an easy fix is to put the device in a tupperware like container, drill small holes for the power and detector cables, and then use some kind of water proof sealant to seal up the holes.
