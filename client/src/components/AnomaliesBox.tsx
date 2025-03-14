import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  AlertCircle,
  Bolt,
  Plug,
  Activity,
  Loader2,
  CheckCircle,
} from "lucide-react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  getDocs,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

export default function AnomaliesBox() {
  const [anomaly, setAnomaly] = useState<{
    message: string;
    ai_explanation: string;
    read: boolean;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchLatestAnomaly = async () => {
      try {
        const anomaliesRef = collection(db, "anomalies");
        const q = query(anomaliesRef, orderBy("timestamp", "desc")); // Fetch latest entry
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const latestDoc = querySnapshot.docs[0].data();
          console.log("📥 Firestore Latest Anomaly:", latestDoc);
          setAnomaly({
            message: latestDoc.message,
            ai_explanation: latestDoc.ai_explanation,
            read: latestDoc.read || false,
          });
        } else {
          console.warn("⚠️ No anomaly documents found!");
          setError("No anomalies found.");
        }
      } catch (err) {
        console.error("❌ Firestore Error:", err);
        setError("Failed to load anomalies.");
      } finally {
        setLoading(false);
      }
    };

    fetchLatestAnomaly();
  }, []);

  const markAsRead = async () => {
    if (!anomaly) return;

    try {
      // Query Firestore for the latest anomaly
      const anomaliesRef = collection(db, "anomalies");
      const q = query(anomaliesRef, orderBy("timestamp", "desc"), limit(1));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.warn("⚠️ No anomalies found to mark as read.");
        return;
      }

      // Get the latest document ID
      const latestAnomalyDoc = querySnapshot.docs[0];
      const latestAnomalyId = latestAnomalyDoc.id;

      // Update the "read" field to true
      await updateDoc(doc(db, "anomalies", latestAnomalyId), { read: true });

      // Update local state
      setAnomaly((prev) => (prev ? { ...prev, read: true } : prev));
      console.log("✅ Anomaly marked as read.");
    } catch (error) {
      console.error("❌ Error marking as read:", error);
    }
  };

  const detectAnomalyType = (message: string) => {
    if (message.includes("Voltage")) return "voltage";
    if (message.includes("Current")) return "current";
    if (message.includes("Power")) return "power";
    return "general";
  };

  const anomalyType = anomaly ? detectAnomalyType(anomaly.message) : "general";

  const anomalyThemes = {
    voltage: {
      title: "Voltage Anomaly",
      bg: "bg-yellow-50 border-yellow-400",
      icon: <Bolt className="h-6 w-6 text-yellow-600" />,
      text: "text-yellow-700",
    },
    current: {
      title: "Current Anomaly",
      bg: "bg-blue-50 border-blue-400",
      icon: <Plug className="h-6 w-6 text-blue-600" />,
      text: "text-blue-700",
    },
    power: {
      title: "Power Anomaly",
      bg: "bg-red-50 border-red-400",
      icon: <Activity className="h-6 w-6 text-red-600" />,
      text: "text-red-700",
    },
    general: {
      title: "Anomaly Detected",
      bg: "bg-gray-50 border-gray-400",
      icon: <AlertCircle className="h-6 w-6 text-gray-600" />,
      text: "text-gray-700",
    },
  };

  const theme = anomalyThemes[anomalyType];

  return (
    <Card className={`shadow-lg border ${theme.bg}`}>
      <CardHeader>
        <CardTitle
          className={`flex items-center gap-2 text-xl font-semibold ${theme.text}`}
        >
          {theme.icon}
          {theme.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 p-4 bg-gray-100 rounded-lg">
            <AlertCircle className="h-5 w-5 text-gray-500" />
            <p className="text-sm text-gray-600">{error}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p
              className={`text-base leading-relaxed font-medium ${theme.text}`}
            >
              {anomaly?.message}
            </p>
            <p className="text-sm text-gray-600">{anomaly?.ai_explanation}</p>
            {!anomaly?.read && (
              <button
                onClick={markAsRead}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition"
              >
                <CheckCircle className="h-4 w-4" />
                Mark as Read
              </button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
