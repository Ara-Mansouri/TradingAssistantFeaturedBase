"use client";

import { FieldErrors } from "react-hook-form";
import { translateFieldError } from "@/utils/validationErrors";

interface ErrorBoxProps {
  errors: FieldErrors<any>;
  tErr: any;
  tLabels: any;
}

export default function ErrorBox({ errors, tErr, tLabels }: ErrorBoxProps) {
  const fieldNames = Object.keys(errors);

  if (fieldNames.length === 0) return null; 

  return (
    <div className="p-3 rounded-lg bg-[#f5e8f8]/90 border border-[#d4a5e5]/50 animate-fade-in space-y-1 backdrop-blur-sm">
      {fieldNames.map((field) => {
        const err = errors[field];
        if (!err?.message) return null;

        return (
          <p key={field} className="text-[#7a3d8a] text-sm font-medium">
            {translateFieldError(field, err.message as string, tErr, tLabels)}
          </p>
        );
      })}
    </div>
  );
}
