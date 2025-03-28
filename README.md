# VoltSense: AI-Powered Smart Energy Monitoring System

![VoltSense](https://github.com/GDSC-ZHCET/VoltSense/blob/master/client/public/misc/banner.jpg) <!-- Add relevant image or logo -->

## 📌 Overview
VoltSense is an AI-powered IoT-based smart energy monitoring system designed to detect voltage anomalies, prevent electrical failures, and provide real-time insights through a web dashboard and mobile application. The project leverages **Google Cloud Run, Firebase, Vertex AI (Gemini API), WebSockets, and Docker** to create a robust, scalable, and intelligent energy management solution.

## 🎯 Problem Statement
Electrical failures and voltage fluctuations are significant challenges in many regions, especially in India, causing damage to appliances, financial losses, and even safety hazards. **VoltSense** provides a real-time monitoring system with anomaly detection to alert users before major electrical issues occur.

## 🌍 Sustainable Development Goals (SDG)
VoltSense aligns with **SDG 7 (Affordable and Clean Energy)** and **SDG 12 (Responsible Consumption and Production)** by promoting efficient energy usage, reducing electrical hazards, and enabling smart grid advancements.

## 🚀 Features
### 🔌 IoT Smart Switch
- Monitors real-time **voltage and current** using **ZMPT101B (voltage sensor)** and **ACS712 (current sensor)**.
- Controls electrical appliances via **Songle SRD-05VDC-SL-C relay module**.
- Uses **Hi-Link HLK-PM01 (AC 220V to DC 5V)** for power conversion.
- **WiFiManager (AP Mode)** for easy device setup.

### 🌐 Web Dashboard
- **Real-time energy monitoring** with interactive graphs.
- **Anomaly detection using AI (Vertex AI API - Gemini API)**.
- **User authentication (Firebase Authentication)**.
- **Secure WebSocket communication for live data updates**.
- **Deployed using Google Cloud Run (Dockerized)**.

### 📱 Mobile Application
- **Live energy tracking on the go**.
- **Push notifications via Firebase Cloud Messaging (FCM)**.
- **Secure access using Firebase Authentication**.
- **Remote control of appliances**.

---

## 🔧 Tech Stack
| Component       | Technology Used |
|----------------|----------------|
| **Hardware**   | ESP32 Devkit V1, ZMPT101B, ACS712, Songle Relay, Hi-Link HLK-PM01 |
| **Frontend**   | Next.js, Tailwind CSS, Chart.js |
| **Backend**    | Node.js, Express.js, Google Cloud Run, WebSockets |
| **Database**   | Firestore Database (NoSQL) |
| **Deployment** | Google Cloud Run, Docker |
| **AI**        | Vertex AI API (Gemini API) |
| **Authentication** | Firebase Authentication |
| **Notifications** | Firebase Cloud Messaging (FCM) |
| **Storage**    | Firebase Storage |

---

## 📊 Process Flow

![Process Flow](https://github.com/GDSC-ZHCET/VoltSense/blob/master/client/public/misc/process-flow.png) <!-- Add relevant image or logo -->

## 🏗️ System Architecture

![System Architecture](https://github.com/GDSC-ZHCET/VoltSense/blob/master/client/public/misc/architecture.png) <!-- Add relevant image or logo -->

---

## 🛠️ Installation & Setup

### 🚀 Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/GDSC-ZHCET/VoltSense.git
   cd VoltSense/server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up **Firebase credentials** and **Google Cloud Run API keys** in `.env`.
4. Run the server:
   ```bash
   npm start
   ```

### 🌐 Frontend Setup (Web Dashboard)
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```

---

## 📽️ Deployment URLs, Demo Video & Screenshots

[🔗 Dashboard URL](https://www.voltsense.app)

[🔗 Server URL (only for serving API endpoints)](https://voltsense-server-110999938896.asia-south1.run.app)

[📽 Watch Demo Video](https://youtu.be/K3QQnjetbyU)

![Dashboard](https://github.com/GDSC-ZHCET/VoltSense/blob/master/client/public/misc/snapshots.png)

---

## 📌 Future Enhancements
- **Reduce** the **cost of production** of IoT Smart Switch.
- **Reduce** the **form factor** of the switch.
- **Multi-device support** for industrial applications.
- Train our own **ML Prediction Model** using **Vertex AI**, which will predict the estimated cost of electricity according to power consumption.

---

## 📜 License
This project is licensed under the **MIT License**.

---

## 👨‍💻👩‍💻 Our Team
We're a team of engineers from Zakir Husain College of College of Engineering and Technology, Aligarh Muslim University, India. We are a part of Google Developer Groups on Campus, ZHCET.
- **Avyukt Soni *(Team Lead)*** - [LinkedIn](https://www.linkedin.com/in/avyuktsoni0731) | [Email](mailto:soniavyukt@gmail.com)
- **Ziya Ali *(Team Member)*** - [LinkedIn](https://www.linkedin.com/in/ziya-ali-584a2628b) | [Email](mailto:ziyaali0072@gmail.com)
- **Ahmad Ilyas *(Team Member)*** - [LinkedIn](https://www.linkedin.com/in/ahmad-ilyas-b79631278) | [Email](mailto:soniavyukt@gmail.com)
- **Saad Ahmad *(Team Member)*** - [LinkedIn](https://www.linkedin.com/in/saad-ahmad-192909325) | [Email](mailto:sdahmad2867@gmail.com)

---
