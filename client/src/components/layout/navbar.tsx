import Image from "next/image";
import { useState } from "react";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#424242] text-white rounded-2xl w-full p-3 md:w-auto text-center mt-2.5">
      <div className="flex justify-between items-center font-kode font-bold shadow-gray-400 w-full">
        <div className="flex gap-2 items-center text-2xl">
          <Image src="/electric.png" width={40} height={40} alt="logo" />
          VOLTSENSE
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <div>HOME</div>
          <div>FEATURES</div>
          <div>
            <button className="min-w-20 rounded-2xl bg-[#e3e3e3] p-2 text-black hover:bg-blue-500">
              LOGIN
            </button>
          </div>
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
          ☰
        </button>
      </div>

      {isOpen && (
        <div className="flex flex-col items-center gap-4 mt-2 md:hidden w-full">
          <div>HOME</div>
          <div>FEATURES</div>
          <button className="min-w-20 rounded-2xl bg-[#e3e3e3] p-2 text-black hover:bg-blue-500">
            LOGIN
          </button>
        </div>
      )}
    </nav>
  );
}