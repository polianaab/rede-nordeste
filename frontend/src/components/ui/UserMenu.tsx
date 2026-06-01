import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Settings, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

interface Props {
  /** Caminho do perfil para este tipo de usuário */
  perfilPath?: string;
}

/**
 * Dropdown de usuário no header — mostra nome, link de perfil e botão Sair.
 * Funciona em qualquer página autenticada.
 */
export const UserMenu: React.FC<Props> = ({ perfilPath = "/perfil" }) => {
  const { usuario, logout } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const [aberto, setAberto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickFora = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setAberto(false);
    };
    document.addEventListener("mousedown", onClickFora);
    return () => document.removeEventListener("mousedown", onClickFora);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      success("Você saiu com segurança. Até logo!");
      navigate("/login", { replace: true });
    } catch {
      error("Erro ao sair. Tente novamente.");
    }
  };

  if (!usuario) return null;

  const iniciais = usuario.nome
    ?.split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setAberto((v) => !v)}
        className="flex items-center gap-2 group"
        aria-label="Menu do usuário"
        aria-expanded={aberto}
      >
        <div className="w-9 h-9 rounded-full bg-[#394158] text-white text-xs font-black flex items-center justify-center shadow-sm group-hover:bg-[#55833d] transition-colors">
          {iniciais}
        </div>
        <ChevronDown
          size={14}
          className={`text-[#394158]/50 hidden md:block transition-transform ${
            aberto ? "rotate-180" : ""
          }`}
        />
      </button>

      {aberto && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="px-4 py-3 border-b border-gray-100 bg-[#F5F2ED]/40">
            <p className="text-xs font-black uppercase text-[#394158] truncate">
              {usuario.nome}
            </p>
            <p className="text-[10px] font-bold text-[#55833d] uppercase tracking-widest mt-0.5">
              {usuario.perfil}
            </p>
          </div>
          <button
            onClick={() => { setAberto(false); navigate(perfilPath); }}
            className="w-full px-4 py-3 flex items-center gap-3 text-xs font-bold text-[#394158] hover:bg-[#F5F2ED] transition-colors"
          >
            <User size={14} /> Meu perfil
          </button>
          {usuario.perfil === "ADMIN" && (
            <button
              onClick={() => { setAberto(false); navigate("/admin"); }}
              className="w-full px-4 py-3 flex items-center gap-3 text-xs font-bold text-[#394158] hover:bg-[#F5F2ED] transition-colors"
            >
              <Settings size={14} /> Painel admin
            </button>
          )}
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 flex items-center gap-3 text-xs font-black text-red-500 hover:bg-red-50 transition-colors uppercase tracking-widest border-t border-gray-100"
          >
            <LogOut size={14} /> Sair
          </button>
        </div>
      )}
    </div>
  );
};
