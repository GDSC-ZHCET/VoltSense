const { GoogleGenerativeAI } = require("@google/generative-ai");
const { getFirestore } = require("firebase-admin/firestore");
const admin = require("firebase-admin");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const db = getFirestore();

// Thresholds for anomaly detection
const VOLTAGE_THRESHOLD = 280;

/**
 * 🔹 Generate AI-Based Insights (Runs every 15 min)
 */
async function generateInsight() {
  try {
    const sensorDataRef = db
      .collection("sensorData")
      .orderBy("timestamp", "desc")
      .limit(10);
    const snapshot = await sensorDataRef.get();

    let readings = snapshot.docs.map((doc) => doc.data());
    if (readings.length === 0) return "No recent sensor readings available.";

    const prompt = `
      Analyze these electrical readings and provide an **energy efficiency tip**.
      Focus on:
      - Predicting high power usage times.
      - Suggesting optimal appliance schedules.
      - Identifying inefficient appliance usage.
      - Reducing carbon footprint.
      Keep it **under 50 words**. Here’s the data: ${JSON.stringify(readings)}
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response =
      result.response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "No insight generated.";

    await db
      .collection("insights")
      .doc("latest")
      .set({ response, timestamp: new Date() });
    console.log("✅ AI Insight Generated:", response);

    return response;
  } catch (error) {
    console.error("❌ Gemini AI Error:", error);
    return "Unable to generate insight.";
  }
}

/**
 * 🔹 AI-Based Anomaly Detection (Triggered on New Data)
 * @param {Object} newData - Latest sensor reading { voltage, current, power, timestamp }
 */
async function detectAnomalies(newData) {
  try {
    // Fetch past readings for context
    const sensorDataRef = db
      .collection("sensorData")
      .orderBy("timestamp", "desc")
      .limit(50);
    const snapshot = await sensorDataRef.get();
    let pastReadings = snapshot.docs.map((doc) => doc.data());

    if (pastReadings.length === 0) return "No historical data to compare.";

    // Check if values exceed thresholds
    let anomalyMessage = null;
    if (newData.voltage > VOLTAGE_THRESHOLD)
      anomalyMessage = `⚠️ Voltage spike detected: ${newData.voltage}V`;
    if (!anomalyMessage) return "No anomaly detected.";

    // Send data to Gemini AI for verification & explanation
    const prompt = `
      Recent sensor data:
      - Latest: ${JSON.stringify(newData)}
      - Past Trends: ${JSON.stringify(pastReadings)}

      AI Task:
      - Identify if an anomaly exists.
      - Explain why it's unusual.
      - Suggest a fix (e.g., check appliance, reduce load, schedule maintenance).
      **Keep it under 50 words.**
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const aiExplanation =
      result.response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "No AI explanation.";

    // Store the detected anomaly
    const anomalyData = {
      message: anomalyMessage,
      ai_explanation: aiExplanation,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      read: false,
    };

    await db.collection("anomalies").add(anomalyData);
    console.log("🚨 Anomaly Alert Stored:", anomalyData);

    // Send alert notification
    await sendAlertNotification(anomalyMessage, aiExplanation);

    return anomalyData;
  } catch (error) {
    console.error("❌ AI Anomaly Detection Error:", error);
    return "Failed to analyze anomalies.";
  }
}

/**
 * 🔹 Send Anomaly Alert via FCM
 * @param {string} title - Alert title
 * @param {string} body - Detailed AI-generated explanation
 */
async function sendAlertNotification(title, body) {
  try {
    const message = {
      notification: { title, body },
      topic: "alerts",
    };

    await admin.messaging().send(message);
    console.log("✅ AI-generated anomaly notification sent.");
  } catch (error) {
    console.error("❌ Error sending FCM alert:", error);
  }
}

// **Schedule AI Insights Every 15 Minutes**
setInterval(generateInsight, 15 * 60 * 1000);

module.exports = { generateInsight, detectAnomalies };
