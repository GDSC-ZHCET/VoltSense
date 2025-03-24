import Image from "next/image";

export default function Tagline() {
  return (
    <div className="text-black dark:text-white flex flex-col justify-center items-center font-kode m-5 md:m-20 text-center">
      <div className="text-5xl md:text-8xl w-full">
        Monitor Your Power <span className="text-blue-500"> in Real-Time</span>
      </div>
      <div className="mt-6 md:mt-10 text-xl md:text-3xl">
        Advanced monitoring and control for your electrical infrastructure.
      </div>
      <button className="mt-6 md:mt-10 bg-[#e3e3e3] dark:bg-[#333333] p-2 rounded-3xl text-black dark:text-white w-40 font-semibold hover:bg-blue-300 dark:hover:bg-blue-700">
        GET STARTED
      </button>
      <div className="flex flex-col md:flex-row gap-6 items-center text-xl md:text-2xl p-4 md:p-8 m-5 md:m-20">
        <Image
          className="mr-0 md:mr-8"
          src="/voltsense-prototype.jpg"
          alt="Device"
          width={300}
          height={200}
        />
        <p className="max-w-lg text-black dark:text-white">
          Voltsense is an IoT-enabled smart switch that monitors power usage,
          provides energy-saving tips, tracks carbon footprint, and allows
          remote control of appliances.
        </p>
      </div>
    </div>
  );
}
