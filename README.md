# VoltSense - IoT Smart Switch with Real-Time Metrics and Control

VoltSense is an IoT-enabled smart switch that allows users to monitor power usage, control appliances remotely, and gain insights into energy consumption patterns. It includes a web dashboard and a mobile app for seamless user interaction.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Hardware Components](#hardware-components)
- [Software Components](#software-components)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Backend Server](#backend-server)
- [ESP32 Firmware](#esp32-firmware)
- [Frontend Application](#frontend-application)
- [Google AI Integration](#google-ai-integration)
- [Contributing](#contributing)
- [License](#license)

## Overview

VoltSense aims to provide an affordable and scalable solution for smart energy management in households and small businesses. By leveraging IoT and cloud technologies, it empowers users with real-time data and actionable insights to promote energy conservation.

## Features

- Real-time monitoring of power usage.
- Remote control of appliances.
- Historical data visualization.
- Energy-saving recommendations.
- Carbon footprint tracking.
- Google AI-powered insights and anomaly detection.
- Web dashboard and mobile app for device management.

## Hardware Components

- **ESP32 Microcontroller**: For managing IoT functionalities.
- **ACS712 Current Sensor**: To measure current flow.
- **Relay Module**: To control the connected appliances.
- **Voltage Regulator**: To power the ESP32 and peripherals.
- **Enclosure**: Fireproof casing for safety.

## Software Components

- **Backend**: Express.js server handling MQTT messages and database interactions.
- **Frontend**: Next.js for the web dashboard.
- **MQTT Broker**: Hosted on Google Cloud VM.
- **Database**: Firebase Firestore for storing user data and metrics.
- **Mobile App**: Flutter-based app for mobile control and insights.

## Setup and Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/voltsense.git
cd voltsense
```

### 2. Setting up the Backend
Navigate to the `server` directory and install dependencies:
```
cd server
npm install
```

Start the Express server:
```
npm start
```

### 3. Setting Up the Frontend
Navigate to the `client` directory and install dependencies:
```
cd client
npm install
```
Start the Next.js application:
```
npm run dev
```

### 4. Configuring the ESP32
Flash the provided firmware onto the ESP32 to start sending MQTT messages to the broker.

## Usage
1. Web Dashboard: Access the web dashboard at http://localhost:3000 to monitor and control connected appliances.
2. Mobile App: Install the Flutter app on your mobile device for remote management.
3. MQTT Broker: Ensure the MQTT broker is running on your Google Cloud VM and accessible from your network.

## Backend Server
The backend is built using Express.js and handles the following:
- Connecting to the MQTT broker to receive messages.
- Storing and retrieving data from Firebase Firestore.
- Exposing APIs for the frontend to fetch real-time and historical data.

## API Endpoints
- `GET /message`: Fetches the latest MQTT message.
- `POST /control`: Sends control commands to the ESP32.

## ESP32 Firmware
The ESP32 firmware is programmed to:
- Connect to the specified MQTT broker.
- Publish power usage data to the esp32/messages topic.
- Listen for control commands on the esp32/control topic.

## Frontend Application
The frontend is a Next.js application that:
- Provides a user-friendly interface for monitoring and controlling appliances.
- Visualizes power usage data and insights.
- Fetches data from the Express backend through REST APIs.


## Google AI Integration
The project integrates with Google AI to:
- Analyze power usage data.
- Provide insights into energy consumption patterns.
- Detect anomalies and suggest energy-saving practices.

## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes. Ensure that your code adheres to the project's coding standards and includes relevant tests.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.

