import React, { forwardRef } from "react";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  hint?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, iconLeft, iconRight, hint, className = "", ...rest }, ref) => (
    <div className="space-y-1.5">
      {label && (
        <label className="text-[10px] font-black uppercase text-[#55833d] tracking-widest ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        {iconLeft && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {iconLeft}
          </span>
        )}
        <input
          ref={ref}
          {...rest}
          className={`w-full ${iconLeft ? "pl-12" : "pl-4"} ${
            iconRight ? "pr-12" : "pr-4"
          } py-3.5 bg-[#F5F2ED]/50 text-[#394158] font-medium rounded-2xl outline-none border-2 transition-all ${
            error ? "border-red-500" : "border-transparent focus:border-[#55833d]"
          } ${className}`}
        />
        {iconRight && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            {iconRight}
          </span>
        )}
      </div>
      {error ? (
        <p className="text-[10px] font-bold text-red-500 ml-1">{error}</p>
      ) : hint ? (
        <p className="text-[10px] text-gray-400 ml-1 italic">{hint}</p>
      ) : null}
    </div>
  )
);

FormField.displayName = "FormField";
