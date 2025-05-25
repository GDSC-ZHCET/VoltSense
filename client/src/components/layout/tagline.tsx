import Image from "next/image";
import Link from "next/link";

export default function Tagline() {
  return (
   <section className="text-black flex flex-col justify-center items-center font-sans m-5 md:m-20 text-center">
      <div className="text-5xl md:text-8xl w-full">
        Monitor Your Power in <span className="text-blue-500">Real-Time</span>
      </div>
      <div className="mt-6 md:mt-10 text-xl md:text-3xl">
        Advanced monitoring and control for your electrical infrastructure.
      </div>
      <Link href="/dashboard" className="mt-6 md:mt-10 border-2 rounded-md border-black bg-[#e3e3e3] dark:bg-[#333333] p-2  text-black dark:text-white w-40 font-semibold hover:bg-black hover:text-white transition-colors ">
        GET STARTED
      </Link>
      <br/>
      <div className="flex flex-col md:flex-row gap-6 bg-gray-50 items-center text-xl md:text-2xl p-4 md:p-8 m-5 md:m-10 ">
        <Image
          className="mr-0 md:mr-8 border-2 border-black shadow-md"
          src="/voltsense-mvp.jpg"
          alt="Device"
          width={500}
          height={200}
        />
        <p className="max-w-lg text-black text-2xl md:text-3xl">
          Voltsense is an IoT-enabled smart switch that monitors power usage,
          provides energy-saving tips, tracks carbon footprint, and allows
          remote control of appliances.
        </p>
      </div>
      <br/>
    </section>
  );
}
