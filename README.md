# LabSensors

### Project Description:
This project aims to develop a network of sensors to monitor and display the temperature and humidity of a lab environment. Each of the sensor modules will be an ESP32 microcontroller and a temperature and humidity sensor. Each module will be powered by a usb power cord. 

We hope to build the first prototype with at least 3 sensor modules. All of the sensor modules will communicate with each other via a networking protocol called MQTT. The host of the system will be a raspberry pi that will be running a MQTT broker software as well as a number of other programs. 

Some of the other programs will be dedicated to the visual dashboard we will build to display the current reading of the sensors as well as historical data. 

In the end we hope to build a well integrated IoT monitoring system that will allow users to easily survey their lab environment.

### Project Structure:
Below is a picture of the system outline. The red box indicates the initial prototype that we will build. After building the initial proof of concept, we will expand the system to include all the features found below.

![UserExperience.](./etcFiles/Images/UserExperience.jpg)

Below is a diagram of the backend of our system. The project's main compoents include a ESP32 microcontrollers and a raspberry pi. The raspberry pi will host a number of scripts including the MQTT broker, the database, and the API to request the sensor data.

![Backround](./etcFiles/Images/BackendStructure.JPG)
