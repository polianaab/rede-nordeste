import React from "react";
import { Camera } from "lucide-react";

interface ProfileHeroProps {
  /** Tom do gradiente do hero. */
  variant?: "vendedor" | "comprador" | "admin";
  fotoUrl: string;
  nome: string;
  subtitulo?: React.ReactNode;
  /** Pill no canto (StatusBadge, etc) */
  badge?: React.ReactNode;
  /** Callback ao clicar no ícone de câmera (trocar foto) */
  onTrocarFoto?: () => void;
  /** Bloco extra abaixo do nome (ex: CTA principal) */
  cta?: React.ReactNode;
}

const VARIANTS: Record<NonNullable<ProfileHeroProps["variant"]>, string> = {
  vendedor:  "from-[#f9943b] to-[#fbac66]",
  comprador: "from-[#55833d] to-[#7ab35a]",
  admin:     "from-[#1a1f2e] to-[#394158]",
};

/**
 * Hero card padronizado para páginas de perfil.
 * Foto + nome + badge + CTA, com gradiente suave por perfil.
 */
export const ProfileHero: React.FC<ProfileHeroProps> = ({
  variant = "comprador",
  fotoUrl,
  nome,
  subtitulo,
  badge,
  onTrocarFoto,
  cta,
}) => (
  <div
    className={`bg-gradient-to-r ${VARIANTS[variant]} rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row items-center gap-5 md:gap-6 text-white relative overflow-hidden page-enter`}
  >
    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 pointer-events-none" />
    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16 pointer-events-none" />

    <div className="relative shrink-0">
      <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white/30 overflow-hidden shadow-inner bg-white/20">
        <img src={fotoUrl} className="w-full h-full object-cover" alt={nome} />
      </div>
      {onTrocarFoto && (
        <button
          onClick={onTrocarFoto}
          className="absolute bottom-0 right-0 bg-white/95 text-[#394158] p-2 rounded-full border-2 border-white shadow-lg active:scale-90 transition-transform hover:bg-white"
          aria-label="Trocar foto"
          title="Trocar foto"
        >
          <Camera size={14} />
        </button>
      )}
    </div>

    <div className="flex-1 text-center md:text-left min-w-0 z-10">
      <h3 className="text-xl md:text-2xl font-black leading-tight mb-1 tracking-tight truncate">
        {nome}
      </h3>
      {subtitulo && (
        <p className="text-xs md:text-sm font-medium opacity-90 mb-3 truncate">{subtitulo}</p>
      )}
      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
        {badge}
      </div>
      {cta && <div className="mt-4 flex justify-center md:justify-start">{cta}</div>}
    </div>
  </div>
);
