import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

interface BackButtonProps {
  /**
   * Destino do botão.
   *  - string  → navigate(string)
   *  - "back"  → navigate(-1) [default]
   *  - function → callback custom (útil para sub-telas internas com estado)
   */
  para?: string | "back" | (() => void);
  /** Texto exibido ao lado do ícone. Default "Voltar". */
  label?: string;
  /** Classe extra para o container. */
  className?: string;
  /** Variante visual. Default "soft" (pílula com sombra). */
  variant?: "soft" | "ghost";
}

/**
 * Botão de voltar **inline** — fica DENTRO do main (não no header sticky).
 *
 * Padrão de UX:
 *  - Sempre o PRIMEIRO elemento da seção, alinhado à esquerda
 *  - Pílula branca com sombra (variant=soft) para destacar sobre o fundo bege
 *  - Em mobile economiza espaço (label some)
 *  - active:scale-95 + hover sutil para feedback tátil
 */
export const BackButton: React.FC<BackButtonProps> = ({
  para = "back",
  label = "Voltar",
  className = "",
  variant = "soft",
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (typeof para === "function") return para();
    if (para === "back") return navigate(-1);
    return navigate(para);
  };

  const base =
    "group inline-flex items-center gap-2 active:scale-95 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f9943b]";
  const styles =
    variant === "ghost"
      ? "text-[#394158] hover:text-[#f9943b] py-2"
      : "bg-white text-[#394158] hover:text-[#f9943b] px-4 py-2 rounded-full shadow-sm border border-gray-50 hover:shadow-md";

  return (
    <button
      onClick={handleClick}
      aria-label="Voltar"
      className={`${base} ${styles} ${className}`}
    >
      <ChevronLeft
        size={16}
        className="transition-transform group-hover:-translate-x-0.5"
      />
      <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest">
        {label}
      </span>
    </button>
  );
};
