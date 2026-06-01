import React from "react";
import { CheckCircle, Clock, ShieldOff, XCircle, AlertTriangle } from "lucide-react";

type StatusBadgeVariant =
  | "verificada" | "pendente" | "suspensa" | "rejeitada" | "ativa" | "inativa";

interface StatusBadgeProps {
  variant: StatusBadgeVariant;
  label?: string;
  size?: "sm" | "md";
}

const variants: Record<StatusBadgeVariant, { Icon: React.ComponentType<any>; bg: string; text: string; defaultLabel: string }> = {
  verificada: { Icon: CheckCircle,    bg: "bg-[#55833d]/10",   text: "text-[#55833d]",   defaultLabel: "Verificada" },
  pendente:   { Icon: Clock,           bg: "bg-[#f9943b]/10",   text: "text-[#f9943b]",   defaultLabel: "Aguardando verificação" },
  suspensa:   { Icon: ShieldOff,       bg: "bg-red-100",        text: "text-red-600",     defaultLabel: "Suspensa" },
  rejeitada:  { Icon: XCircle,         bg: "bg-red-100",        text: "text-red-600",     defaultLabel: "Rejeitada" },
  ativa:      { Icon: CheckCircle,     bg: "bg-[#55833d]/10",   text: "text-[#55833d]",   defaultLabel: "Ativa" },
  inativa:    { Icon: AlertTriangle,   bg: "bg-gray-100",       text: "text-gray-500",    defaultLabel: "Inativa" },
};

/**
 * Pill de status reutilizável. Padroniza ícone + cor + texto em todo o app.
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({ variant, label, size = "sm" }) => {
  const v = variants[variant];
  const sizeCls = size === "sm"
    ? "text-[9px] px-2 py-0.5 gap-1"
    : "text-[10px] px-3 py-1 gap-1.5";
  return (
    <span className={`inline-flex items-center font-black uppercase tracking-widest rounded-full ${v.bg} ${v.text} ${sizeCls}`}>
      <v.Icon size={size === "sm" ? 10 : 12} />
      {label ?? v.defaultLabel}
    </span>
  );
};
