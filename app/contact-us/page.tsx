import React from "react";
import ContactUsHeader from "../_components/ContactUsHeader";
import ContactUsFeature from "../_components/ContactUsFeature";
import ContactForm from "../_components/ContactForm";
import Values from "../_components/Values";

export default function page() {
  return (
    <section className="w-full bg-white">
      <div
        className="flex flex-col items-start w-full max-w-[1440px] mx-auto
                      px-8 md:px-10 lg:px-[160px]
                      pt-4 md:pt-8 pb-20
                      gap-12 lg:gap-[48px]"
      >
        {/* Your inner layers (Header, Form, Map, etc.) will go here */}
        <ContactUsHeader />
        <ContactUsFeature />
        <ContactForm />
      </div>
      <Values />
    </section>
  );
}
