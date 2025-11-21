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
    <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/30 animate-fade-in space-y-1">
      {fieldNames.map((field) => {
        const err = errors[field];
        if (!err?.message) return null;

        return (
          <p key={field} className="text-red-400 text-sm">
            {translateFieldError(field, err.message as string, tErr, tLabels)}
          </p>
        );
      })}
    </div>
  );
}
