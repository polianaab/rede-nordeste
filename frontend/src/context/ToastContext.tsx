import React, {
  createContext, useCallback, useContext, useEffect, useState,
} from "react";
import { CheckCircle, AlertTriangle, Info, X } from "lucide-react";

// ── Tipos ────────────────────────────────────────────────────────
type ToastTipo = "success" | "error" | "info" | "warning";

interface Toast {
  id: number;
  tipo: ToastTipo;
  mensagem: string;
  duracao: number;
}

interface ToastContextValue {
  toast: (mensagem: string, tipo?: ToastTipo, duracao?: number) => void;
  success: (msg: string) => void;
  error: (msg: string) => void;
  info: (msg: string) => void;
  warning: (msg: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

// ── Provider ─────────────────────────────────────────────────────
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remover = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (mensagem: string, tipo: ToastTipo = "info", duracao = 4000) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, tipo, mensagem, duracao }]);
    }, []
  );

  const value: ToastContextValue = {
    toast,
    success: (m) => toast(m, "success"),
    error:   (m) => toast(m, "error"),
    info:    (m) => toast(m, "info"),
    warning: (m) => toast(m, "warning"),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={remover} />
    </ToastContext.Provider>
  );
};

// ── Hook ─────────────────────────────────────────────────────────
export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast deve ser usado dentro de <ToastProvider>");
  return ctx;
};

// ── Container fixo no topo (mobile) / topo-direita (desktop) ─────
const ToastContainer: React.FC<{ toasts: Toast[]; onRemove: (id: number) => void }> = ({
  toasts, onRemove,
}) => (
  <div className="fixed top-4 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-4 md:top-4 z-[9999] flex flex-col gap-3 pointer-events-none w-[90vw] max-w-sm">
    {toasts.map((t) => (
      <ToastItem key={t.id} toast={t} onRemove={onRemove} />
    ))}
  </div>
);

// ── Item individual ──────────────────────────────────────────────
const ICONES = {
  success: { Icon: CheckCircle, bg: "bg-[#55833d]",  text: "text-white" },
  error:   { Icon: AlertTriangle, bg: "bg-red-500",  text: "text-white" },
  warning: { Icon: AlertTriangle, bg: "bg-[#f9943b]",text: "text-white" },
  info:    { Icon: Info,         bg: "bg-[#394158]", text: "text-white" },
} as const;

const ToastItem: React.FC<{ toast: Toast; onRemove: (id: number) => void }> = ({
  toast, onRemove,
}) => {
  const { Icon, bg, text } = ICONES[toast.tipo];

  useEffect(() => {
    const t = setTimeout(() => onRemove(toast.id), toast.duracao);
    return () => clearTimeout(t);
  }, [toast.id, toast.duracao, onRemove]);

  return (
    <div
      role="alert"
      className={`pointer-events-auto ${bg} ${text} px-4 py-3 rounded-2xl shadow-2xl flex items-start gap-3 animate-in slide-in-from-top-2 fade-in duration-300`}
    >
      <Icon size={20} className="shrink-0 mt-0.5" />
      <p className="flex-1 text-sm font-semibold leading-snug">{toast.mensagem}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="opacity-70 hover:opacity-100 shrink-0"
        aria-label="Fechar"
      >
        <X size={16} />
      </button>
    </div>
  );
};
