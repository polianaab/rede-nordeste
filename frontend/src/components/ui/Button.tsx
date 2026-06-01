import React from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "warning";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:   "bg-[#55833d] text-white hover:bg-[#436b2f] active:bg-[#365824]",
  secondary: "bg-[#394158] text-white hover:bg-[#2c3346]",
  ghost:     "bg-transparent text-[#394158] hover:bg-[#F5F2ED] border border-gray-200",
  danger:    "bg-red-500 text-white hover:bg-red-600",
  warning:   "bg-[#f9943b] text-white hover:bg-[#e88127]",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-[10px]",
  md: "px-6 py-3 text-xs",
  lg: "px-8 py-4 text-sm",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  fullWidth,
  loading,
  iconLeft,
  iconRight,
  disabled,
  children,
  className = "",
  ...rest
}) => {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={`${base} ${variantClasses[variant]} ${sizeClasses[size]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : iconLeft}
      {children}
      {!loading && iconRight}
    </button>
  );
};
