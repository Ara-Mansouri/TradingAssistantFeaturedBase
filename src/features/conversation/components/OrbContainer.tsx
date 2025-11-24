"use client";

import { ReactNode } from "react";

interface OrbContainerProps {
  children: ReactNode;
  size?: "small" | "large";
}


export default function OrbContainer({ children, size = "large" }: OrbContainerProps) {
  const isSmall = size === "small";

  return (
    <div
      className={`
        flex items-center justify-center
        ${isSmall ? "w-full py-4" : "w-full h-full"}
      `}
    >
      {children}
    </div>
  );
}

