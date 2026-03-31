"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

import { userType } from "../utils/types";

import axios from "axios";
import { useEffect, useState } from "react";

export default function UserDashboardPage() {
  const { user, isLoading } = useKindeBrowserClient();

  const [userDetails, setUserDetails] = useState<userType | null>();

  useEffect(() => {
    try {
      async function getUserDetails() {
        if (!user) return;
        const data = await axios(`/api/user/${user.id}`);
        const details = await data.data;
        setUserDetails(details);
      }

      getUserDetails();
    } catch (error) {
      console.log(`error from user-dashboard: ${error}`);
    }
  }, [user?.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-xl text-[#6C7275]">
          Loading details...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start w-full max-w-[851px] p-0 md:p-10 lg:p-0 lg:px-[72px] gap-10">
      {/* Account Details Form */}
      <form className="flex flex-col items-start w-full max-w-[707px] p-0 gap-6">
        <h2 className="text-xl font-semibold text-black mb-2">
          Account Details
        </h2>

        {/* First Name */}
        <div className="flex flex-col items-start w-full gap-3">
          <label className="text-xs font-bold uppercase text-[#6C7275]">
            First name *
          </label>
          <div className="flex items-center w-full h-10 px-4 bg-white border border-[#CBCBCB] rounded-md focus-within:border-[#141718] transition-colors">
            <input
              type="text"
              defaultValue={userDetails?.firstName}
              placeholder="First Name"
              className="w-full text-base font-normal text-black bg-transparent outline-none placeholder:text-[#6C7275]"
            />
          </div>
        </div>

        {/* Last Name */}
        <div className="flex flex-col items-start w-full gap-3">
          <label className="text-xs font-bold uppercase text-[#6C7275]">
            Last name *
          </label>
          <div className="flex items-center w-full h-10 px-4 bg-white border border-[#CBCBCB] rounded-md focus-within:border-[#141718] transition-colors">
            <input
              type="text"
              defaultValue={userDetails?.lastName}
              placeholder="Last Name"
              className="w-full text-base font-normal text-black bg-transparent outline-none placeholder:text-[#6C7275]"
            />
          </div>
        </div>

        {/* Display Name */}
        <div className="flex flex-col items-start w-full gap-3">
          <label className="text-xs font-bold uppercase text-[#6C7275]">
            Display name *
          </label>
          <div className="flex items-center w-full h-10 px-4 bg-white border border-[#CBCBCB] rounded-md focus-within:border-[#141718] transition-colors">
            <input
              type="text"
              defaultValue={
                userDetails
                  ? `${userDetails.firstName} ${userDetails.lastName}`
                  : ""
              }
              placeholder="Display Name"
              className="w-full text-base font-normal text-black bg-transparent outline-none placeholder:text-[#6C7275]"
            />
          </div>
          <p className="text-xs italic text-[#6C7275]">
            This will be how your name will be displayed in the account section
            and in reviews
          </p>
        </div>

        {/* Email */}
        <div className="flex flex-col items-start w-full gap-3">
          <label className="text-xs font-bold uppercase text-[#6C7275]">
            Email *
          </label>
          <div className="flex items-center w-full h-10 px-4 bg-white border border-[#CBCBCB] rounded-md focus-within:border-[#141718] transition-colors">
            <input
              type="email"
              defaultValue={userDetails?.email}
              placeholder="Your email"
              className="w-full text-base font-normal text-black bg-transparent outline-none placeholder:text-[#6C7275]"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
