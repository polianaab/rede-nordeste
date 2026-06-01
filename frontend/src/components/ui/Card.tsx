import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
  hover?: boolean;
}

const paddings = { sm: "p-4", md: "p-6", lg: "p-8" };

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  padding = "md",
  hover = false,
}) => (
  <div
    className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${paddings[padding]} ${
      hover ? "hover:shadow-lg hover:-translate-y-0.5 transition-all" : ""
    } ${className}`}
  >
    {children}
  </div>
);
