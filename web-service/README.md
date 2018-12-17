#Water Alarm Web Service
The web service in this directory is designed to act as a relay of information between the water detector hardware, and the mobile application.

The hardware will send updates on it's status to the web service, and the mobile application will query this web service to check for changes before reporting to the mobile user.

##Getting it running

To get the web server and service up and running on your machine, all you should need to do is;

1. Ensure JDK (Java Development Kit) 1.8 or laters is installed.
2. Open a terminal in this directory.
3. Run the command `./mvnw spring-boot:run`.
4. Once you see the message `Started WaterAlarmAppWebServiceApplication in X.XX seconds (JVM running for XX.XXX)` the web service is now up and running.
5. Test the web service is running by going to `localhost:8080/water-alarm/update/test/true` in your web browser of choice.
6. You should see some JSON returned that summarises the new status saved for `test`.

