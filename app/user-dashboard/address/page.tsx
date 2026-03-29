import React from "react";
import { Edit } from "lucide-react";

export default function AddressPage() {
  return (
    <div className="flex flex-col items-start w-full max-w-[851px] p-0 md:px-[72px] gap-5">
      <h2 className="text-2xl font-semibold text-black">Address</h2>

      <div className="flex flex-col md:flex-row items-start w-full gap-6">
        {/* Billing Address Card */}
        <div className="flex flex-col items-center p-4 gap-2 w-full md:w-[342px] h-[140px] border border-[#6C7275] rounded-lg box-border">
          <div className="flex justify-between items-start w-full gap-4">
            <h3 className="text-base font-semibold text-black">
              Billing Address
            </h3>
            <button className="flex items-center gap-1 text-sm font-semibold text-[#6C7275] hover:text-black transition-colors cursor-pointer">
              <Edit className="w-4 h-4 " />
              Edit
            </button>
          </div>
          <div className="flex flex-col items-start gap-1 w-full">
            <p className="text-sm text-black">Sofia Havertz</p>
            <p className="text-sm text-black">(+1) 234 567 890</p>
            <p className="text-sm text-black">
              345 Long Island, NewYork, United States
            </p>
          </div>
        </div>

        {/* Shipping Address Card */}
        <div className="flex flex-col items-center p-4 gap-2 w-full md:w-[342px] h-[140px] border border-[#6C7275] rounded-lg box-border">
          <div className="flex justify-between items-start w-full gap-4">
            <h3 className="text-base font-semibold text-black">
              Shipping Address
            </h3>
            <button className="flex items-center gap-1 text-sm font-semibold text-[#6C7275] hover:text-black transition-colors cursor-pointer">
              <Edit className="w-4 h-4 " />
              Edit
            </button>
          </div>
          <div className="flex flex-col items-start gap-1 w-full">
            <p className="text-sm text-black">Sofia Havertz</p>
            <p className="text-sm text-black">(+1) 234 567 890</p>
            <p className="text-sm text-black">
              345 Long Island, NewYork, United States
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
