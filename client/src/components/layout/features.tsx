import Image from "next/image";
import { ArrowRight, Smartphone, Wifi, LayoutDashboard, Settings, Shield, Bolt } from "lucide-react"

export default function Features() {
  return (
    <>
      <section id="features" className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">FEATURES</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-teal-400 rounded-md mb-4">
                <Wifi className="h-8 w-8 text-teal-500" />
              </div>
              <h3 className="text-lg font-bold uppercase mb-3">WIRELESS</h3>
              <p className="text-sm">
                Wi-Fi enabled with ESP32-based wireless connectivity for seamless remote access.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-teal-400 rounded-md mb-4">
                <Bolt className="h-8 w-8 text-teal-500" />
              </div>
              <h3 className="text-lg font-bold uppercase mb-3">ENERGY EFFICIENT</h3>
              <p className="text-sm">
                Helps reduce electricity wastage by optimizing power usage with AI-driven recommendations.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-teal-400 rounded-md mb-4">
                <Smartphone className="h-8 w-8 text-teal-500" />
              </div>
              <h3 className="text-lg font-bold uppercase mb-3">EASY CONTROL</h3>
              <p className="text-sm">Control your appliances from anywhere via web dashboard and mobile app.</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-teal-400 rounded-md mb-4">
                <Settings className="h-8 w-8 text-teal-500" />
              </div>
              <h3 className="text-lg font-bold uppercase mb-3">SIMPLE SETUP</h3>
              <p className="text-sm">
                Easy configuration with Wi-Fi Manager in AP Mode for quick and hassle-free installation.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-teal-400 rounded-md mb-4">
                <LayoutDashboard className="h-8 w-8 text-teal-500" />
              </div>
              <h3 className="text-lg font-bold uppercase mb-3">SUPERIOR DESIGN</h3>
              <p className="text-sm">
                Compact, efficient design with integrated sensors and relay control in a single unit.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-teal-400 rounded-md mb-4">
                <Shield className="h-8 w-8 text-teal-500" />
              </div>
              <h3 className="text-lg font-bold uppercase mb-3">HIGHLY COMPATIBLE</h3>
              <p className="text-sm">
                Works with most standard electrical appliances and integrates with existing smart home systems.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
