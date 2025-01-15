import express, { Request, Response } from "express";
import mqtt from "mqtt";
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();
const PORT = 3001;
app.use(cors());
dotenv.config();

const client = mqtt.connect(`mqtt://${process.env.MQTT_VM_INSTANCE_IP}`); // Replace with your VM's IP address
// const client = mqtt.connect("mqtt://34.70.188.64"); // Replace with your VM's IP address

let messageData: string = "";

// Subscribe to the topic where ESP32 is publishing messages
client.on("connect", () => {
  console.log("Connected to MQTT Broker");
  client.subscribe("esp32/message", (err) => {
    if (!err) {
      console.log("Subscribed to topic: esp32/message");
    }
  });
});

// Handle incoming MQTT messages
client.on("message", (topic, message) => {
  if (topic === "esp32/message") {
    messageData = message.toString();
    console.log("Received message:", messageData);
  }
});

// Endpoint to fetch the latest message
app.get("/message", (req: Request, res: Response) => {
  res.json({ message: messageData });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
