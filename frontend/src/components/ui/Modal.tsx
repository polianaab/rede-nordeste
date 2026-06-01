import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  /** Em mobile, abre como bottom sheet (drawer) em vez de modal centralizado */
  mobileAsDrawer?: boolean;
}

const sizes = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" };

export const Modal: React.FC<ModalProps> = ({
  open, onClose, title, children, size = "md", mobileAsDrawer = true,
}) => {
  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-end md:items-center justify-center md:p-4">
      <div
        className="absolute inset-0 bg-[#1a1f2e]/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`relative bg-white w-full ${sizes[size]} ${
          mobileAsDrawer
            ? "rounded-t-3xl md:rounded-3xl"
            : "rounded-3xl mx-4"
        } shadow-2xl animate-in slide-in-from-bottom-4 md:zoom-in-95 max-h-[90vh] flex flex-col`}
        role="dialog"
        aria-modal="true"
      >
        {title && (
          <header className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-black uppercase italic tracking-tighter text-[#394158] text-base md:text-lg">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#F5F2ED] rounded-full transition-colors"
              aria-label="Fechar"
            >
              <X size={20} />
            </button>
          </header>
        )}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6">{children}</div>
      </div>
    </div>
  );
};
