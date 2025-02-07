// "use client";
// import { useEffect, useState } from "react";

// export default function Home() {
//   const [messages, setMessages] = useState("");

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const response = await fetch("http://localhost:3001/messages");
//         const data = await response.json();
//         setMessages(data); // Assuming you have a state variable named `messages`
//       } catch (error) {
//         console.error("Error fetching messages:", error);
//       }
//     };

//     fetchMessages();
//   }, []);

//   return (
//     <>

//     </>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// import { DotPattern } from "@/components/ui/dot-pattern";
import { Zap, Shield, Activity, BarChart3, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const powerData = [
  { name: "Jan", value: 4000 },
  { name: "Feb", value: 3000 },
  { name: "Mar", value: 5000 },
  { name: "Apr", value: 4500 },
  { name: "May", value: 4200 },
  { name: "Jun", value: 3800 },
];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* <DotPattern /> */}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Zap className="w-8 h-8 text-blue-600 dark:text-blue-500" />
              <span className="ml-2 text-xl font-bold">VoltSense</span>
            </motion.div>
            <motion.nav
              className="flex items-center space-x-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                href="/features"
                className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-500"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-500"
              >
                Pricing
              </Link>
              <ThemeToggle />
              <Link href="/auth/login">
                <Button variant="outline" className="ml-4">
                  Login
                </Button>
              </Link>
            </motion.nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ opacity }}
        >
          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Monitor Your Power
            <span className="text-blue-600 dark:text-blue-500">
              {" "}
              in Real-Time
            </span>
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Advanced monitoring and control for your electrical infrastructure,
            ensuring safety and efficiency with real-time insights.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <Button size="lg" className="mr-4">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <FeatureCard
              icon={
                <Activity className="h-8 w-8 text-blue-600 dark:text-blue-500" />
              }
              title="Real-Time Monitoring"
              description="Track voltage, current, and power consumption with precision."
            />
            <FeatureCard
              icon={
                <Shield className="h-8 w-8 text-blue-600 dark:text-blue-500" />
              }
              title="Advanced Safety"
              description="Automatic alerts and shutoffs to prevent electrical hazards."
            />
            <FeatureCard
              icon={
                <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-500" />
              }
              title="Analytics"
              description="AI-powered insights for predictive maintenance."
            />
            <FeatureCard
              icon={
                <Zap className="h-8 w-8 text-blue-600 dark:text-blue-500" />
              }
              title="Energy Efficiency"
              description="Optimize power consumption and reduce costs."
            />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <StatCard number="30%" label="Energy Saved" />
            <StatCard number="1M+" label="Devices Monitored" />
            <StatCard number="99.9%" label="Uptime" />
            <StatCard number="24/7" label="Support" />
          </motion.div>
        </div>
      </section>

      {/* Chart Section */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-6">
                  Power Consumption Overview
                </h3>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={powerData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#374151" />
                      <YAxis stroke="#374151" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "none",
                          borderRadius: "0.5rem",
                          color: "#f3f4f6",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ fill: "#3b82f6" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Join thousands of businesses already using VoltSense
            </p>
            <Button size="lg">
              Start Monitoring <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/features"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500"
                  >
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/docs"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/support"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500"
                  >
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500"
                  >
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-600 dark:text-gray-400">
            <p>&copy; 2024 VoltSense. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="relative p-6 rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </motion.div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="relative p-6 rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 text-center"
    >
      <div className="text-3xl font-bold mb-2 text-blue-600 dark:text-blue-500">
        {number}
      </div>
      <p className="text-gray-600 dark:text-gray-400">{label}</p>
    </motion.div>
  );
}
