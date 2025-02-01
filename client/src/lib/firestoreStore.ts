import { db } from "./firebaseConfig";
import { collection, doc, setDoc, addDoc, Timestamp } from "firebase/firestore";

export const storeDeviceData = async (deviceId: string, data: any) => {
  try {
    const deviceRef = doc(db, "devices", deviceId);
    const metricsRef = collection(deviceRef, "metrics");

    await addDoc(metricsRef, {
      voltage: data.voltage,
      current: data.current,
      power: data.power,
      temperature: data.temperature,
      energy_usage: data.energy_usage,
      created_at: Timestamp.now(),
    });

    // Update device status (last updated)
    await setDoc(deviceRef, { last_updated: Timestamp.now() }, { merge: true });

    console.log("Data stored successfully!");
  } catch (error) {
    console.error("Error storing data:", error);
  }
};

export const storeSchedule = async (deviceId: string, scheduleData: any) => {
  try {
    const scheduleRef = collection(db, `devices/${deviceId}/schedules`);
    await addDoc(scheduleRef, {
      start_time: scheduleData.start_time,
      end_time: scheduleData.end_time,
      repeat: scheduleData.repeat,
      days: scheduleData.days,
      action: scheduleData.action,
    });

    console.log("Schedule added successfully!");
  } catch (error) {
    console.error("Error adding schedule:", error);
  }
};

export const storeAlert = async (deviceId: string, alertData: any) => {
  try {
    const alertRef = collection(db, `devices/${deviceId}/alerts`);
    await addDoc(alertRef, {
      type: alertData.type,
      threshold: alertData.threshold,
      triggered_at: Timestamp.now(),
      resolved: false,
    });

    console.log("Alert stored successfully!");
  } catch (error) {
    console.error("Error storing alert:", error);
  }
};
