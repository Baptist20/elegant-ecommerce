"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import { poppins, inter } from "../utils/font";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage({ type: "error", text: "Please enter your email address" });
      return;
    }

    // Basic email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      setMessage({ type: "error", text: "Please enter a valid email address" });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: data.message || "Subscribed successfully!",
        });
        setEmail("");
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to subscribe",
        });
      }
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative w-full h-[360px] flex items-center justify-center overflow-hidden bg-[#F2F4F6]">
      {/* 1. Background Image with Blending */}
      {/* Note: Using two images with multiply blend mode as per your Figma CSS */}
      <div className="absolute inset-0 z-0">
        {/* Temporary fix: Using img tag instead of Next.js Image */}
        <img
          src="/newsletter-banner.png"
          alt="Newsletter Background"
          className="w-full h-full object-cover opacity-20 mix-blend-multiply"
        />
      </div>

      {/* 2. Content Container (540px width) */}
      <div className="relative z-10 w-full max-w-[540px] px-4 flex flex-col items-center gap-8">
        {/* Header Text */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h2
            className={`${poppins.className} text-[34px] md:text-[40px] leading-[44px] font-medium tracking-[-0.4px] text-[#141718]`}
          >
            Join Our Newsletter
          </h2>
          <p
            className={`${inter.className} text-base md:text-lg leading-[30px] text-[#141718]`}
          >
            Sign up for deals, new products and promotions
          </p>
        </div>

        {/* 3. Form Input Area (488px width) */}
        <form onSubmit={handleSubmit} className="w-full max-w-[488px]">
          <div className="flex items-center gap-2 border-b border-[#6C7275]/50 py-3 transition-colors focus-within:border-[#141718]">
            <div className="flex items-center gap-2 flex-grow">
              <Mail className="w-6 h-6 text-[#6C7275]" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className={`bg-transparent w-full outline-none ${inter.className} font-medium text-base text-[#141718] placeholder:text-[#6C7275] disabled:opacity-50`}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`${inter.className} font-medium text-base text-[#6C7275] hover:text-[#141718] transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? "Signing up..." : "Signup"}
            </button>
          </div>

          {/* Message Display */}
          {message && (
            <div
              className={`mt-3 flex items-center gap-2 ${message.type === "success" ? "text-green-600" : "text-red-600"}`}
            >
              {message.type === "success" ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span className={`${inter.className} text-sm`}>
                {message.text}
              </span>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
