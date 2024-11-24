// app/[lang]/home/FeatureSection.tsx

"use client";

import React from "react";
import { useTranslations } from "@hooks/useTranslations";

interface FeatureCardProps {
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description }) => (
  <div
    className="p-4 md:p-6 bg-white rounded-lg shadow-md transition-all duration-500 
    border border-transparent hover:border-[#FF8C00]
    [filter:grayscale(100%)_brightness(0.95)] hover:[filter:grayscale(0%)_brightness(1)]
    hover:shadow-lg hover:-translate-y-1 transform group"
  >
    <h3
      className="text-base md:text-lg font-semibold mb-2 text-gray-800 
      group-hover:text-[#1A237E] transition-colors duration-300"
    >
      {title}
    </h3>
    <p
      className="text-sm md:text-base text-gray-600 group-hover:text-[#1A237E]/80 
      transition-colors duration-300"
    >
      {description}
    </p>
  </div>
);

const FeatureSection: React.FC = () => {
  const { translations } = useTranslations();

  const features = translations.home.cards.map((card) => ({
    title: card.title || "",
    description: card.description || "",
  }));

  return (
    <section className="px-4 md:px-6 lg:px-8 max-w-4xl mx-auto mb-20">
      {" "}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;
