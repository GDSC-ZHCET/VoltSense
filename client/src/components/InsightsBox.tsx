import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Lightbulb, Loader2, AlertCircle } from "lucide-react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig"; // Ensure Firebase is initialized

export default function InsightsBox() {
  const [insights, setInsights] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const insightDoc = doc(db, "insights", "latest");

    // Real-time listener for Firestore
    const unsubscribe = onSnapshot(
      insightDoc,
      (docSnap) => {
        if (docSnap.exists()) {
          setInsights(docSnap.data().response);
          setLoading(false);
        } else {
          setError("No insights available.");
          setLoading(false);
        }
      },
      (err) => {
        console.error("Firestore error:", err);
        setError("Failed to load insights. Please try again later.");
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  return (
    <Card className="bg-white shadow-lg border border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
          <Lightbulb className="h-6 w-6 text-purple-600" />
          SenseAI
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 p-4 bg-red-50 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-base text-gray-700 leading-relaxed">
              {insights}
            </p>
            <div className="flex items-center justify-end">
              <button className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1">
                <span>View Details</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
