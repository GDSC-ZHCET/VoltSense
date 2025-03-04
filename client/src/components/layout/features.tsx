import Image from "next/image";

export default function Features() {
  return (
    <>
      <div className="font-kode text-center text-3xl md:text-5xl mt-10">
        FEATURES
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center items-center m-5 md:m-10 font-kode pb-10">
        {[
          {
            img: "/monitor.png",
            title: "Real Time Monitoring",
            desc: "Track voltage, current and power consumption with precision.",
          },
          {
            img: "/energy.png",
            title: "Energy Efficiency",
            desc: "Optimize power consumption and reduce costs.",
          },
          {
            img: "/protect.png",
            title: "Advanced Safety",
            desc: "Automatic alerts and shutoffs to prevent electrical hazards.",
          },
        ].map((feature, index) => (
          <div
            key={index}
            className="flex flex-col bg-[#e3e3e3] p-5 rounded-3xl justify-center items-center min-h-[250px] min-w-[280px] md:min-h-[300px] md:min-w-[350px]"
          >
            <Image
              src={feature.img}
              alt={feature.title}
              height={150}
              width={120}
              className="w-auto h-auto"
            />
            <span className="text-black text-center mt-2">
              <b className="text-lg">{feature.title}</b>
              <br />
              {feature.desc}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
