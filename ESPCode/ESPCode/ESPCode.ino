// Temp / Hummidity Sensor
#include <DHT.h>
#define DHTPIN 23     // Pin where the DHT11 is connected to (change accordingly)
#define DHTTYPE DHT11 // DHT 11 sensor type
DHT dht(DHTPIN, DHTTYPE);

// State Information Start
int state = 0;
#define S0 0 // No WIFI
#define S1 1 // Connected to WIFI
#define S2 2 // Has an ID and is sending data
#define S3 3 // Has an ID and is sending data


int RESET = 0; // pull high if you want to use
int READ = 0; // pull high if you want to use
int SEND = 1; // pull high if you want to use

int inProcess = 0;

#define SEC 1000
#define MIN 60000
#define HOUR 3600000

int deviceID = 0;

volatile float periord = 100; // default

#define NOWIFI 5
#define YESWIFI 19
#define SENDING_DATA 18
// State Information End

// IP and Mac Start
char formattedIP[16]; // IPv4 addresses can have up to 15 characters (including dots) plus the null terminator
char formattedMac[18]; // Array to store the formatted MAC address (including colons and null terminator)
// IP and Mac End

// Button Information Start
#define BUTTON_PIN 22 // Example pin for the button (change accordingly)
SemaphoreHandle_t xSemaphore;
void buttonTask(void *pvParameters);
void buttonISR();
// Button Information End

// MQTT Information Start
#include <WiFi.h>
#include <PubSubClient.h>
#include <WiFiClientSecure.h>

const int mqtt_port = 8883;
const char *mqtt_broker = "u88196e4.ala.us-east-1.emqxsl.com";
const char *mqtt_topic = "emqx/esp32";
const char *mqtt_username = "nialab";
const char *mqtt_password = "pi4life";

const char* ssid = "TP-Link_0A20";
const char* password = "04550259";

const char* ca_cert= \
"-----BEGIN CERTIFICATE-----\n" \
"MIIDjjCCAnagAwIBAgIQAzrx5qcRqaC7KGSxHQn65TANBgkqhkiG9w0BAQsFADBh\n" \
"MQswCQYDVQQGEwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMRkwFwYDVQQLExB3\n" \
"d3cuZGlnaWNlcnQuY29tMSAwHgYDVQQDExdEaWdpQ2VydCBHbG9iYWwgUm9vdCBH\n" \
"MjAeFw0xMzA4MDExMjAwMDBaFw0zODAxMTUxMjAwMDBaMGExCzAJBgNVBAYTAlVT\n" \
"MRUwEwYDVQQKEwxEaWdpQ2VydCBJbmMxGTAXBgNVBAsTEHd3dy5kaWdpY2VydC5j\n" \
"b20xIDAeBgNVBAMTF0RpZ2lDZXJ0IEdsb2JhbCBSb290IEcyMIIBIjANBgkqhkiG\n" \
"9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuzfNNNx7a8myaJCtSnX/RrohCgiN9RlUyfuI\n" \
"2/Ou8jqJkTx65qsGGmvPrC3oXgkkRLpimn7Wo6h+4FR1IAWsULecYxpsMNzaHxmx\n" \
"1x7e/dfgy5SDN67sH0NO3Xss0r0upS/kqbitOtSZpLYl6ZtrAGCSYP9PIUkY92eQ\n" \
"q2EGnI/yuum06ZIya7XzV+hdG82MHauVBJVJ8zUtluNJbd134/tJS7SsVQepj5Wz\n" \
"tCO7TG1F8PapspUwtP1MVYwnSlcUfIKdzXOS0xZKBgyMUNGPHgm+F6HmIcr9g+UQ\n" \
"vIOlCsRnKPZzFBQ9RnbDhxSJITRNrw9FDKZJobq7nMWxM4MphQIDAQABo0IwQDAP\n" \
"BgNVHRMBAf8EBTADAQH/MA4GA1UdDwEB/wQEAwIBhjAdBgNVHQ4EFgQUTiJUIBiV\n" \
"5uNu5g/6+rkS7QYXjzkwDQYJKoZIhvcNAQELBQADggEBAGBnKJRvDkhj6zHd6mcY\n" \
"1Yl9PMWLSn/pvtsrF9+wX3N3KjITOYFnQoQj8kVnNeyIv/iPsGEMNKSuIEyExtv4\n" \
"NeF22d+mQrvHRAiGfzZ0JFrabA0UWTW98kndth/Jsw1HKj2ZL7tcu7XUIOGZX1NG\n" \
"Fdtom/DzMNU+MeKNhJ7jitralj41E6Vf8PlwUHBHQRFXGU7Aj64GxJUTFy8bJZ91\n" \
"8rGOmaFvE7FBcf6IKshPECBV1/MUReXgRPTqh5Uykw7+U0b6LJ3/iyK5S9kJRaTe\n" \
"pLiaWN0bfVKfjllDiIGknibVb63dDcY3fe0Dkhvld1927jyNxF1WW6LZZm6zNTfl\n" \
"MrY=\n" \
"-----END CERTIFICATE-----\n";

const char* ca_cert= \
"-----BEGIN CERTIFICATE-----\n" \
"MIIEqjCCA5KgAwIBAgIQAnmsRYvBskWr+YBTzSybsTANBgkqhkiG9w0BAQsFADBh\n" \
"MQswCQYDVQQGEwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMRkwFwYDVQQLExB3\n" \
"d3cuZGlnaWNlcnQuY29tMSAwHgYDVQQDExdEaWdpQ2VydCBHbG9iYWwgUm9vdCBD\n" \
"QTAeFw0xNzExMjcxMjQ2MTBaFw0yNzExMjcxMjQ2MTBaMG4xCzAJBgNVBAYTAlVT\n" \
"MRUwEwYDVQQKEwxEaWdpQ2VydCBJbmMxGTAXBgNVBAsTEHd3dy5kaWdpY2VydC5j\n" \
"b20xLTArBgNVBAMTJEVuY3J5cHRpb24gRXZlcnl3aGVyZSBEViBUTFMgQ0EgLSBH\n" \
"MTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALPeP6wkab41dyQh6mKc\n" \
"oHqt3jRIxW5MDvf9QyiOR7VfFwK656es0UFiIb74N9pRntzF1UgYzDGu3ppZVMdo\n" \
"lbxhm6dWS9OK/lFehKNT0OYI9aqk6F+U7cA6jxSC+iDBPXwdF4rs3KRyp3aQn6pj\n" \
"pp1yr7IB6Y4zv72Ee/PlZ/6rK6InC6WpK0nPVOYR7n9iDuPe1E4IxUMBH/T33+3h\n" \
"yuH3dvfgiWUOUkjdpMbyxX+XNle5uEIiyBsi4IvbcTCh8ruifCIi5mDXkZrnMT8n\n" \
"wfYCV6v6kDdXkbgGRLKsR4pucbJtbKqIkUGxuZI2t7pfewKRc5nWecvDBZf3+p1M\n" \
"pA8CAwEAAaOCAU8wggFLMB0GA1UdDgQWBBRVdE+yck/1YLpQ0dfmUVyaAYca1zAf\n" \
"BgNVHSMEGDAWgBQD3lA1VtFMu2bwo+IbG8OXsj3RVTAOBgNVHQ8BAf8EBAMCAYYw\n" \
"HQYDVR0lBBYwFAYIKwYBBQUHAwEGCCsGAQUFBwMCMBIGA1UdEwEB/wQIMAYBAf8C\n" \
"AQAwNAYIKwYBBQUHAQEEKDAmMCQGCCsGAQUFBzABhhhodHRwOi8vb2NzcC5kaWdp\n" \
"Y2VydC5jb20wQgYDVR0fBDswOTA3oDWgM4YxaHR0cDovL2NybDMuZGlnaWNlcnQu\n" \
"Y29tL0RpZ2lDZXJ0R2xvYmFsUm9vdENBLmNybDBMBgNVHSAERTBDMDcGCWCGSAGG\n" \
"/WwBAjAqMCgGCCsGAQUFBwIBFhxodHRwczovL3d3dy5kaWdpY2VydC5jb20vQ1BT\n" \
"MAgGBmeBDAECATANBgkqhkiG9w0BAQsFAAOCAQEAK3Gp6/aGq7aBZsxf/oQ+TD/B\n" \
"SwW3AU4ETK+GQf2kFzYZkby5SFrHdPomunx2HBzViUchGoofGgg7gHW0W3MlQAXW\n" \
"M0r5LUvStcr82QDWYNPaUy4taCQmyaJ+VB+6wxHstSigOlSNF2a6vg4rgexixeiV\n" \
"4YSB03Yqp2t3TeZHM9ESfkus74nQyW7pRGezj+TC44xCagCQQOzzNmzEAP2SnCrJ\n" \
"sNE2DpRVMnL8J6xBRdjmOsC3N6cQuKuRXbzByVBjCqAA8t1L0I+9wXJerLPyErjy\n" \
"rMKWaBFLmfK/AHNF4ZihwPGOc7w6UHczBZXH5RFzJNnww+WnKuTPI0HfnVH8lg==\n" \
"-----END CERTIFICATE-----\n";






WiFiClientSecure espClient;
PubSubClient client(espClient);
// MQTT Information End

// Memory Includes Start
#include <Arduino.h> // not sure if we need this lol
// Memory Includes End

// Time Start
#include <NTPClient.h>
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org");
#include <WiFiUdp.h>
// Time END


void setupWifiandMQTT() {
    // Set software serial baud to 115200;
    Serial.begin(115200);
    // connecting to a WiFi network
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.println("Connecting to WiFi..");
    }
    Serial.println("Connected to the WiFi network");

    // set root ca cert
    espClient.setCACert(ca_cert);
    // connecting to a mqtt broker
    client.setServer(mqtt_broker, mqtt_port);
    client.setCallback(callback);
    while (!client.connected()) {
        String client_id = "esp32-client-";
        client_id += String(WiFi.macAddress());
        Serial.printf("The client %s connects to the public mqtt broker\n", client_id.c_str());
        if (client.connect(client_id.c_str(), mqtt_username, mqtt_password)) {
            Serial.println("Public emqx mqtt broker connected");
            client.subscribe(mqtt_topic);
        } else {
            Serial.print("Failed to connect to MQTT broker, rc=");
            Serial.print(client.state());
            Serial.println("Retrying in 5 seconds.");
            delay(5000);
        }
    }
    // publish message
    client.publish(mqtt_topic, "Hi EMQX I'm ESP32 ^^");
}

// updated on dec 18th
void callback(char* topic, byte* payload, unsigned int length) {
    Serial.print("Message arrived in topic: ");
    Serial.println(topic);
    Serial.print("Message:");
    for (int i = 0; i < length; i++) {
        Serial.print((char) payload[i]);
    }
    Serial.println();
    Serial.println("-----------------------");
}

void getCurrentEpochTimeString(char* result) {
  timeClient.update();
  unsigned long epochTime = timeClient.getEpochTime();

  // Convert unsigned long to String
  String epochTimeString = String(epochTime);

  // Copy the contents of the String to the character array
  epochTimeString.toCharArray(result, epochTimeString.length() + 1);
}

void parseCallback(byte* payload){
  char* action = strtok((char*)payload, " ");

  if (strcmp(action, "STATUS") == 0){
    char stringDeviceID[10];  // Adjust the size based on the expected length of the integer
    itoa(deviceID, stringDeviceID, 10);

    randomSeed(analogRead(0));
    float randomFloat = map(random(10000), 0, 10000, 0.0, 3000.0);
    vTaskDelay(randomFloat / portTICK_PERIOD_MS); // Delay for 1000ms

    char returnString[30];
    strcpy(returnString, stringDeviceID);

    if(deviceID == 0){
      strcat(returnString," 0");
    }
    if(deviceID != 0){
      strcat(returnString," 1");
    }
    Serial.print("Returning Status: ");
    Serial.println(returnString);

    sendMQTT("STATUS/IN", returnString);

  // Message has been sent on the EDIT topic
  }else if (strcmp(action, "EDIT") == 0){
    int localDeviceID = atoi(strtok(NULL, " "));

    // If this is the correct device, configure the data
    if(localDeviceID == deviceID){
      char* frequency = strtok(NULL, " ");
      char* units = strtok(NULL, " ");

      Serial.print("Periord has been changed from: ");
      Serial.print(periord);
      periord = CalcPeriord(atof(frequency), (units));
      delay(30);
      Serial.print(" -> ");
      Serial.println(periord);
    }else{Serial.println("Wrong Device");}

  // Message sent on the SETUP topic
  }else if (strcmp(action, "SETUP") == 0){
    Serial.println("Setup Detected");
    char* recievedMacAddress;
    char* recievedDeviceID;
    char* recievedFrequency;

    int frequency = 0;
    char* units;

    recievedMacAddress = strtok(NULL, " ");

    Serial.print("I think the macAddress is: ");
    Serial.println(recievedMacAddress);

    // Check if this is the correct device
    if (strcmp(recievedMacAddress, formattedMac) == 0){
      Serial.println("Formatting New Parameters");

      recievedDeviceID = strtok(NULL, " ");
      deviceID = atoi(recievedDeviceID);

      recievedFrequency = strtok(NULL, " ");
      frequency = atoi(recievedFrequency);
    
      units = strtok(NULL, " ");

      periord = CalcPeriord(frequency, units);

      Serial.print("Finished Formatting Parameters, the periord is: ");
      Serial.println(periord);

      // Change State Parameters
      state = S3;
    }
    else{Serial.println("Device ID Intercepted, Incorrect Device");}
  }
  else{Serial.println("Something Strange");}

  inProcess = 0;
}

int CalcPeriord(int frequency,char* units) {
  float localPeriord = -1;
  if(strcmp(units, "Second") == 0){
    localPeriord = SEC / frequency;
  }else if(strcmp(units, "Minute") == 0){
    localPeriord = MIN / frequency;
  }else if(strcmp(units, "Hour") == 0){
    localPeriord = HOUR / frequency;
  }
  return localPeriord;
}
// MQTT and WIFI End


void initMacIP(){
  // IP and Mac Initilization Start
  uint8_t mac[6];
  WiFi.macAddress(mac);
  for (int i = 0; i < 6; ++i) {
      if (i < 5) {
          sprintf(formattedMac + i * 3, "%02X:", mac[i]);
      } else {
          sprintf(formattedMac + i * 3, "%02X", mac[i]);
      }
  }

  // Get and print the local IP address
  IPAddress localIP = WiFi.localIP();
  sprintf(formattedIP, "%d.%d.%d.%d", localIP[0], localIP[1], localIP[2], localIP[3]);
}


void setup() {
  // Serial Start
  Serial.begin(115200);
  Serial.println("This has started");
  // Serial End

  // Sensor Setup
  dht.begin();

  // Wifi Setup Start
  Serial.println("Starting Wifi Setup");
  setupWifiandMQTT();
  // Wifi Setup End

  // Free RTOS Tasks Start
  xTaskCreate(SampleSensor, "SampleSensor", 10000, NULL, 1, NULL);         
  xTaskCreate(StateMachine, "StateMachine",10000, NULL, 2, NULL); 

  // Free RTOS Tasks END

  // Button Interupt Code Start
  xSemaphore = xSemaphoreCreateBinary();
  if (xSemaphore == NULL) {
    Serial.println("Semaphore creation failed!");
    while (1);
  }
  attachInterrupt(digitalPinToInterrupt(BUTTON_PIN), buttonISR, FALLING);
  xTaskCreate(buttonTask, "Button Task", 10000, NULL, 1, NULL);
  // Button Interupt Code END

  // Get IP and Mac Start
  initMacIP();
  // Get IP and Mac End

  // Get Time Start
  timeClient.begin();
  timeClient.setTimeOffset(0);
  // Get Time Stop

  // LED Indicators 
  pinMode(NOWIFI, OUTPUT);
  pinMode(YESWIFI, OUTPUT);
  pinMode(SENDING_DATA, OUTPUT);

  digitalWrite(NOWIFI, LOW);
  digitalWrite(YESWIFI, LOW);
  digitalWrite(SENDING_DATA, LOW);
}

void loop() {
    if (!client.connected()) {
    reconnect();
  }
  client.loop();
  delay(100);
}


// Not called as of dec 18th
void subscribeToTopic(const char* topic) {
  client.subscribe(topic);
  Serial.print("Subscribed to topic: ");
  Serial.println(topic);
}

// Updated Dec 18th
void reconnect() {
  while (!client.connected()) {
    Serial.println("Reconnecting to MQTT broker...");
    String client_id = "esp8266-client-";
    client_id += String(WiFi.macAddress());
    if (client.connect(client_id.c_str(), mqtt_username, mqtt_password)) {
        Serial.println("Reconnected to MQTT broker.");
        client.subscribe(mqtt_topic);
    } else {
        Serial.print("Failed to reconnect to MQTT broker, rc=");
        Serial.print(client.state());
        Serial.println("Retrying in 5 seconds.");
        delay(5000);
    }
  }
}

// Task 1 function
void StateMachine(void *pvParameters) {
  for (;;) {
    switch (state)
    {
    // NO WIFI
    case S0:
      digitalWrite(NOWIFI, HIGH);
      digitalWrite(YESWIFI, LOW);
      digitalWrite(SENDING_DATA, LOW);
      break;
    
    // Wifi Connected and Waiting
    case S1:
      digitalWrite(NOWIFI, LOW);
      digitalWrite(YESWIFI, HIGH);
      digitalWrite(SENDING_DATA, LOW);
      break;

    // Sending ID to request database
    case S2:
      digitalWrite(NOWIFI, LOW);
      digitalWrite(YESWIFI, HIGH);
      digitalWrite(SENDING_DATA, LOW);
      break;

    // Device ID intercepted, Sending data Now
    case S3:
      digitalWrite(NOWIFI, LOW);
      digitalWrite(YESWIFI, LOW);
      digitalWrite(SENDING_DATA, HIGH);
      break;
    
    default:
      break;
    }
    Serial.print("The State is:");
    Serial.println(state);
    vTaskDelay(1000 / portTICK_PERIOD_MS); // Delay for 1000ms
  }
}

void createDataString(char returnString[], int localDeviceID,char epochTimeString[], float temperature, float humidity){
  // Convert deviceID to string using casting
  char deviceIDStr[10];
  itoa(localDeviceID, deviceIDStr, 10);

  strcpy(returnString, deviceIDStr);
  strcat(returnString, " ");

  strcat(returnString, epochTimeString);
  strcat(returnString, " ");
    
  // Convert temperature to string using dtostrf
  char tempStr[10];
  dtostrf(temperature, 5, 2, tempStr); // 5 is minimum width, 2 is precision
  strcat(returnString, tempStr);
  strcat(returnString, " ");

  // Convert humidity to string using dtostrf
  char humStr[10];
  dtostrf(humidity, 5, 2, humStr); // 5 is minimum width, 2 is precision

  strcat(returnString, humStr);

  Serial.print("MQTT String to be sent: ");
  Serial.println(returnString);

  
}


// Task 2 function
void SampleSensor(void *pvParameters) {
  for (;;) {
    if(state == S3){
      float humidity = dht.readHumidity();
      float temperature = dht.readTemperature();

      if (isnan(humidity) || isnan(temperature)) {
        Serial.println("Failed to read from DHT sensor!");
        return;
      }
      
      char epochTimeString[20];
      getCurrentEpochTimeString(epochTimeString);
      
      char message[50];
      createDataString(message, deviceID, epochTimeString ,temperature, humidity);
      sendMQTT("DATA", message);
      //Serial.println(message);


      vTaskDelay(periord / portTICK_PERIOD_MS); // frequency goes here
    }else{
      vTaskDelay(500 / portTICK_PERIOD_MS); // Delay for 2000ms
    }
  }
}

void sendMQTT(char* topic, char* message) {
  Serial.println("Sending an MQTT message");
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  if (client.connected()) {
    client.publish(topic, message);
  }
}

void buttonTask(void *pvParameters) {
  for (;;) {
    if (xSemaphoreTake(xSemaphore, portMAX_DELAY)) {
      Serial.println("Button pressed!");

      // If you want to reset the device
      if(RESET){
        Serial.println("Reseting Device ID");
        deviceID = 0;
        vTaskDelay(2000 / portTICK_PERIOD_MS); // Delay for 1000ms
      }

      // If you want to read the ID
      if(READ){
        Serial.println("Reading Device ID");
        Serial.print("The read device ID is: ");
        Serial.println(deviceID);
        vTaskDelay(2000 / portTICK_PERIOD_MS); // Delay for 1000ms
      }

      // Make sure you are in setup mode, and in send mode, and are not already in the process of sending a message
      if((state == S1) && SEND && (deviceID == 0)){ // add inprocess back
        // Create String
        char result[45];
        char* topic = "INIT/OUT";
        strcpy(result, "SETUP");
        strcat(result, " ");
        strcat(result, formattedIP);
        strcat(result, " ");
        strcat(result, formattedMac);

        // TO BE ADDED CALL MQTT COMMAND
        sendMQTT(topic, result);
        inProcess = 1;
        
        vTaskDelay(2000 / portTICK_PERIOD_MS); // Delay for 1000ms
      }
    }
    vTaskDelay(100 / portTICK_PERIOD_MS); // Delay for 2000ms
  }
}

void buttonISR() {
  // Notify the task that the button was pressed
  BaseType_t xHigherPriorityTaskWoken = pdFALSE;
  xSemaphoreGiveFromISR(xSemaphore, &xHigherPriorityTaskWoken);

  // If there was a task that was waiting for the semaphore,
  // request a context switch to the waiting task
  if (xHigherPriorityTaskWoken == pdTRUE) {
    portYIELD_FROM_ISR();
  }
}
