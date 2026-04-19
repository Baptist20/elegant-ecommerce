"use client";

import { useState } from "react";
import { toast } from "sonner";
import { inter } from "../utils/font";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to send message");
        return;
      }

      toast.success(
        "Message sent successfully! Check your email for confirmation.",
      );

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1119px] mx-auto bg-white p-8 md:p-12 rounded-lg shadow-sm">
      <h2 className="font-poppins font-medium text-3xl lg:text-4xl leading-tight tracking-tight text-[#121212] mb-6">
        Send us a Message
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="name"
              className={`${inter.className} block text-sm font-medium text-gray-700 mb-2`}
            >
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`${inter.className} w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors`}
              placeholder="John Doe"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className={`${inter.className} block text-sm font-medium text-gray-700 mb-2`}
            >
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`${inter.className} w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors`}
              placeholder="john@example.com"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="subject"
            className={`${inter.className} block text-sm font-medium text-gray-700 mb-2`}
          >
            Subject *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className={`${inter.className} w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors`}
            placeholder="How can we help you?"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className={`${inter.className} block text-sm font-medium text-gray-700 mb-2`}
          >
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            className={`${inter.className} w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-colors resize-none`}
            placeholder="Tell us more about your inquiry..."
          />
        </div>

        <div className="flex items-center justify-between pt-4">
          <p className={`${inter.className} text-sm text-gray-600`}>
            * Required fields
          </p>
          <button
            type="submit"
            disabled={loading}
            className={`${inter.className} px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </div>
      </form>

      <div className="mt-8 pt-8 border-t border-gray-200">
        <p className={`${inter.className} text-sm text-gray-600`}>
          We typically respond within 24-48 hours. You'll receive a confirmation
          email immediately after submitting this form.
        </p>
      </div>
    </div>
  );
}
