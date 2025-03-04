const { GoogleGenerativeAI } = require("@google/generative-ai");
const { getFirestore } = require("firebase-admin/firestore");
require("dotenv").config();

// Set up Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const db = getFirestore();

async function generateInsight() {
  try {
    // Fetch recent sensor data
    const sensorDataRef = db
      .collection("sensorData")
      .orderBy("timestamp", "desc")
      .limit(10);
    const snapshot = await sensorDataRef.get();

    let readings = [];
    snapshot.forEach((doc) => readings.push(doc.data()));

    if (readings.length === 0) {
      return "No recent sensor readings available for analysis.";
    }

    const prompt = `
      Analyze the electrical readings and provide a **single, actionable energy efficiency tip** based on the data. 
      Focus on one of these: 
      - Predict high power usage times.
      - Suggest optimal appliance schedules.
      - Identify inefficient appliance usage.
      - Provide a tip for reducing carbon emissions.
      Keep the insight **short and practical** (under 50 words). Here’s the data: ${JSON.stringify(
        readings
      )}
    `;

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    // const response = result.response.text();
    // const response = result.response.text()?.trim() || "No insight generated.";
    const response =
      result.response.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "No insight generated.";

    // Store the insight in Firestore
    await db.collection("insights").doc("latest").set({
      response,
      timestamp: new Date(),
    });

    return response;
  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    return "Unable to generate insight at this time.";
  }
}

// Run every 15 minutes
setInterval(generateInsight, 15 * 60 * 1000);

// Run once at startup
generateInsight();

module.exports = { generateInsight };
