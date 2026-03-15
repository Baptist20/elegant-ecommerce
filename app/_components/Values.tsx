import React from "react";
import { Truck, DollarSign, Lock, Phone } from "lucide-react";
import { poppins } from "../utils/font";

const valuesData = [
  {
    id: 1,
    title: "Free Shipping",
    description: "Order above $200",
    icon: <Truck className="w-12 h-12 stroke-[1.5]" />,
  },
  {
    id: 2,
    title: "Money-back",
    description: "30 days guarantee",
    icon: <DollarSign className="w-12 h-12 stroke-[1.5]" />,
  },
  {
    id: 3,
    title: "Secure Payments",
    description: "Secured by Stripe",
    icon: <Lock className="w-12 h-12 stroke-[1.5]" />,
  },
  {
    id: 4,
    title: "24/7 Support",
    description: "Phone and Email support",
    icon: <Phone className="w-12 h-12 stroke-[1.5]" />,
  },
];

export default function Values() {
  return (
    <section className="bg-white py-12 md:py-20">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-40">
        {/* The Grid Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {valuesData.map((item) => (
            <div
              key={item.id}
              className="bg-[#F3F5F7] px-8 py-12 flex flex-col items-start gap-4 min-h-[220px]"
            >
              {/* Icon Container (48x48px from Figma) */}
              <div className="text-[#141718]">{item.icon}</div>

              {/* Text Content */}
              <div className="flex flex-col gap-2">
                <h3
                  className={`${poppins.className} text-xl font-medium leading-7 text-[#141718]`}
                >
                  {item.title}
                </h3>
                <p
                  className={`${poppins.className} text-sm font-normal leading-6 text-[#6C7275]`}
                >
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
