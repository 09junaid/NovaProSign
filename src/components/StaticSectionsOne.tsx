import React from "react";
// import Image from "next/image";
import img1 from "/public/images/value.jpeg";
import img2 from "/public/images/warranty.png";
import img3 from "/public/images/shipping.png";
import img4 from "/public/images/service.png";
import img5 from "/public/images/certificate.jpg";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaPhone } from "react-icons/fa";
import { MdEmail } from "react-icons/md";



const dataList = [
  { image: img1, title: "Value for Money" },
  { image: img2, title: "2 Years Warranty" },
  { image: img3, title: "Turnaround 10-12 Working Days" },
  { image: img4, title: "24/7 Support" },
  { image: img5, title: "UL Certified" },
];

export default function StaticSectionOne() {
  return (
    <section className="flex flex-col gap-4 p-4 bg-white">
      <span className="text-end">Any questions or concerns?</span>

      <div className="flex flex-row justify-between items-center gap-4 p-4 rounded-lg">
  <h1 className="text-7xl" style={{ fontFamily: "Arial, sans-serif", color: "#0072FF" }}>
    NovaProSign
  </h1>
  
  <ul className="flex flex-col gap-2 rounded-lg p-4 text-white" style={{ backgroundColor: "#0072FF" }}>
    <li className="flex items-center gap-2">
      <FaPhone /> +1 (440) 300-6000
    </li>
    <li className="flex items-center gap-2">
      <IoLogoWhatsapp style={{ color: "limegreen" }} /> +1 (800) 600-6000
    </li>
    <li className="flex items-center gap-2">
      <MdEmail /> info@novaprosigns.com
    </li>
  </ul>
</div>


      <div className="flex bg-white">
        {/* Left Section with Mockups */}
        <div
          className="flex flex-col gap-6 w-full md:w-1/3 lg:w-full p-4 rounded-xl shadow-lg"
          style={{ backgroundColor: "#0072FF" }}
        >
          {/* First Block */}
          <div
            className="relative border-2 rounded-lg p-4 shadow-lg h-[80vh] bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/investigation.jpg')",
              borderColor: "#0072FF",
            }}
          >
            <span
              className="absolute -top-3 -left-4 text-xl px-6 py-4 font-semibold uppercase tracking-wide rounded-br-full"
              style={{ backgroundColor: "#0072FF", color: "white" }}
            >
              Mockup
            </span>
          </div>

          {/* Second Block */}
          <div
            className="relative border-2 rounded-lg p-2 shadow-lg h-[50vh] bg-white bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/LogoWeb.webp')",
              borderColor: "#0072FF",
            }}
          >
            <span
              className="absolute -top-3 -left-4 text-xl px-6 py-4 font-semibold uppercase tracking-wide rounded-br-full"
              style={{ backgroundColor: "#0072FF", color: "white" }}
            >
              Mockup
            </span>
          </div>
        </div>

        {/* Right Section with Icons */}
        <div className="flex flex-col gap-4 p-2">
          {dataList.map((item, index) => (
            <div
              key={index}
              className=" overflow-hidden bg-white "
            >
              <div
                className="w-full h-25 bg-contain bg-center"
                style={{
                  backgroundImage: `url(${item.image.src})`,
                  backgroundRepeat: "no-repeat",

                }}
              />
              <div className="text-center py-3 px-2 bg-white">
                <span className="text-black font-medium">{item.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
