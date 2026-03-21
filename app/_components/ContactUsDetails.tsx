import React from "react";
import { Store, Phone, Mail } from "lucide-react";
import { inter } from "../utils/font";

export default function ContactUsDetails() {
  return (
    <div className="w-full max-w-[1120px] mx-auto flex flex-col gap-10 lg:gap-20">
      {/* --- SECTION TITLE --- */}
      <h2 className="font-poppins font-medium text-[28px] lg:text-[40px] leading-tight text-center text-[#121212]">
        Contact Us
      </h2>

      {/* --- INFO CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center p-4 lg:py-4 lg:px-8 gap-4 bg-[#F3F5F7] min-h-[156px] justify-center">
          <Store className="w-8 h-8 text-[#141718]" />
          <div className="flex flex-col items-center gap-2">
            <span
              className={`${inter.className} text-sm font-bold uppercase text-[#6C7275]`}
            >
              Address
            </span>
            <p
              className={`${inter.className} text-base font-semibold text-center text-[#141718]`}
            >
              234 Hai Trieu, Ho Chi Minh City, Viet Nam
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center p-4 lg:py-4 lg:px-8 gap-4 bg-[#F3F5F7] min-h-[156px] justify-center">
          <Phone className="w-8 h-8 text-[#141718]" />
          <div className="flex flex-col items-center gap-2">
            <span
              className={`${inter.className} text-sm font-bold uppercase text-[#6C7275]`}
            >
              Contact Us
            </span>
            <p
              className={`${inter.className} text-base font-semibold text-center text-[#141718]`}
            >
              +84 234 567 890
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center p-4 lg:py-4 lg:px-8 gap-4 bg-[#F3F5F7] min-h-[156px] justify-center">
          <Mail className="w-8 h-8 text-[#141718]" />
          <div className="flex flex-col items-center gap-2">
            <span
              className={`${inter.className} text-sm font-bold uppercase text-[#6C7275]`}
            >
              Email
            </span>
            <p
              className={`${inter.className} text-base font-semibold text-center text-[#141718]`}
            >
              hello@3legant.com
            </p>
          </div>
        </div>
      </div>

      {/* --- FORM & MAP SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Form */}
        <form className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-3">
            <label
              className={`${inter.className} text-xs font-bold uppercase text-[#6C7275]`}
            >
              Full Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              className="w-full h-10 px-4 border border-[#CBCBCB] rounded-md focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label
              className={`${inter.className} text-xs font-bold uppercase text-[#6C7275]`}
            >
              Email Address
            </label>
            <input
              type="email"
              placeholder="Your email"
              className="w-full h-10 px-4 border border-[#CBCBCB] rounded-md focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label
              className={`${inter.className} text-xs font-bold uppercase text-[#6C7275]`}
            >
              Message
            </label>
            <textarea
              rows={4}
              placeholder="Your message"
              className="w-full p-4 border border-[#CBCBCB] rounded-md focus:outline-none focus:border-black transition-colors resize-none"
            />
          </div>

          <button className="w-fit px-10 py-3 bg-[#141718] text-white rounded-lg font-medium hover:bg-black transition-colors">
            Send Message
          </button>
        </form>

        {/* --- MAP SECTION --- */}
        <div className="w-full h-full min-h-[404px] bg-[#F3F5F7] rounded-sm overflow-hidden relative border border-[#CBCBCB]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.460232429402!2d106.7022838!3d10.7752494!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f40a45e5235%3A0xc31006e88e2808!2zMjM0IEjhuqNpIFRyaeG7gXUsIELhur9uIE5naMOpLCBRdeG6rW4gMSwgSOG7kyBDaMOtIE1pbmgsIFZpZXRuYW0!5e0!3m2!1sen!2s!4v1710000000000!5m2!1sen!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Office Location"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
