"use client";

import { ReactNode } from "react";

interface ChatContainerProps {
  children: ReactNode;
  className?: string;
}


export default function ChatContainer({ children, className = "" }: ChatContainerProps) 
{
  return (
    <div
      className={`
        flex flex-col h-full overflow-hidden
        ${className}
      `}
    >
      {children}
    </div>
  );
}

