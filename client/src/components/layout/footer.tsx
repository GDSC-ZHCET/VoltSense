import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#424242] text-white py-9 mt-20 px-4 w-full">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div>
            <h2 className="text-2xl font-bold">VoltSense</h2>
            <p className="mt-2 text-gray-400">Bringing intelligence to your power.</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-1">
              <li><a href="/" className="text-gray-400 hover:text-white">Home</a></li>
              <li><a href="/about" className="text-gray-400 hover:text-white">About</a></li>
              <li><a href="/features" className="text-gray-400 hover:text-white">Features</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Follow Us</h3>
            <div className="flex justify-center md:justify-start space-x-4 mt-2">
              <a href="#" className="text-gray-400 hover:text-white">🔵 Facebook</a>
              <a href="#" className="text-gray-400 hover:text-white">🟣 Instagram</a>
              <a href="#" className="text-gray-400 hover:text-white">🔵 Twitter</a>
            </div>
          </div>
        </div>
        <div className="mt-6 border-t border-gray-700 pt-4 text-center">
          <p className="text-gray-400">© 2025 VoltSense. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}