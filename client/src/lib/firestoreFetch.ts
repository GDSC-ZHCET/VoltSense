import { db } from "./firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

export const fetchDeviceData = async (deviceId: string) => {
  try {
    const deviceRef = doc(db, "devices", deviceId);
    const deviceSnap = await getDoc(deviceRef);

    if (deviceSnap.exists()) {
      return deviceSnap.data();
    } else {
      console.log("No device found!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching device data:", error);
  }
};

export const fetchDeviceMetrics = async (deviceId: string) => {
  try {
    const metricsRef = collection(db, `devices/${deviceId}/metrics`);
    const q = query(metricsRef, orderBy("created_at", "desc"));
    const querySnapshot = await getDocs(q);

    let metrics: any[] = [];
    querySnapshot.forEach((doc) => {
      metrics.push({ id: doc.id, ...doc.data() });
    });

    return metrics;
  } catch (error) {
    console.error("Error fetching metrics:", error);
  }
};

export const fetchSchedules = async (deviceId: string) => {
  try {
    const schedulesRef = collection(db, `devices/${deviceId}/schedules`);
    const querySnapshot = await getDocs(schedulesRef);

    let schedules: any[] = [];
    querySnapshot.forEach((doc) => {
      schedules.push({ id: doc.id, ...doc.data() });
    });

    return schedules;
  } catch (error) {
    console.error("Error fetching schedules:", error);
  }
};

export const fetchAlerts = async (deviceId: string) => {
  try {
    const alertsRef = collection(db, `devices/${deviceId}/alerts`);
    const querySnapshot = await getDocs(alertsRef);

    let alerts: any[] = [];
    querySnapshot.forEach((doc) => {
      alerts.push({ id: doc.id, ...doc.data() });
    });

    return alerts;
  } catch (error) {
    console.error("Error fetching alerts:", error);
  }
};

// Real-time updates for device metrics
export const listenToDeviceMetrics = (deviceId: string, callback: Function) => {
  const metricsRef = collection(db, `devices/${deviceId}/metrics`);
  const q = query(metricsRef, orderBy("created_at", "desc"));

  return onSnapshot(q, (snapshot) => {
    let metrics: any[] = [];
    snapshot.forEach((doc) => {
      metrics.push({ id: doc.id, ...doc.data() });
    });
    callback(metrics);
  });
};
