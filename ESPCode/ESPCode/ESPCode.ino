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

#define NOWIFI 21
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
const char* ssid = "TP-Link_0A20";
const char* password = "04550259";
const char* mqtt_server = "192.168.1.7";
WiFiClient espClient;
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

// MQTT and WIFI Start
void initWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi ..");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.println(WiFi.status());
    // Serial.print('.');
    delay(1000);
  }
  Serial.println(WiFi.localIP());
  state = S1;
}

void setupMQTT() {
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);  // Set your callback function for incoming messages
  subscribeToTopic("INIT/IN");  // Replace "your-topic" with the actual topic you want to subscribe to
  subscribeToTopic("CONFIG");
  subscribeToTopic("STATUS/OUT");

}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message received on topic: ");
  Serial.println(topic);
  payload[length] = '\0';  // Ensure null termination
  parseCallback(payload);
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
  initWiFi();
  setupMQTT();
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

void subscribeToTopic(const char* topic) {
  client.subscribe(topic);
  Serial.print("Subscribed to topic: ");
  Serial.println(topic);
}

void reconnect() {
  while (!client.connected()) {
    Serial.println("Connecting to MQTT Broker...");
    if (client.connect("ESP32Client")) {
      Serial.println("Connected to MQTT Broker");
      subscribeToTopic("INIT/IN");  // Replace "your-topic" with the actual topic you want to subscribe to
      subscribeToTopic("CONFIG");  // Replace "your-topic" with the actual topic you want to subscribe to
      subscribeToTopic("STATUS/OUT");

    } else {
      Serial.print("Failed with error code: ");
      Serial.println(client.state());
      delay(2000);
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
