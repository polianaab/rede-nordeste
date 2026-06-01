import React from "react";
import { BackButton } from "./BackButton";

interface PageHeaderProps {
  /**
   * Título principal (geralmente nome da página).
   * Em mobile aparece centralizado; em desktop aparece à esquerda.
   */
  titulo: string;

  /** Subtítulo curto (ex: nome da loja, contexto). Opcional. */
  subtitulo?: string;

  /**
   * Para onde o botão "voltar" leva.
   *  - string  → navigate(string)
   *  - "back"  → navigate(-1) [default]
   *  - function → callback custom (útil para sub-telas com estado interno)
   *  - false   → não renderiza o botão (use só para Homes principais)
   */
  voltarPara?: string | "back" | (() => void) | false;

  /** Texto do botão voltar. Default "Voltar". */
  labelVoltar?: string;

  /**
   * Conteúdo do canto direito (ex: UserMenu, ações contextuais).
   */
  acoesDireita?: React.ReactNode;

  /** Classe extra para o container externo. */
  className?: string;
}

/**
 * Header padronizado **inline** — vive DENTRO do `<main>`, não é sticky.
 *
 * Padrão de UX inspirado em Mercado Livre / Shopee / Amazon:
 *  - Botão "voltar" SEMPRE à esquerda (pílula branca, primeiro elemento)
 *  - Título grande logo abaixo (ou ao lado em desktop)
 *  - Slot de ações à direita (UserMenu, botões contextuais)
 *
 * NÃO USA position: sticky — esse padrão (botão voltar dentro do main) é o que
 * a maioria dos apps mobile-first faz hoje porque libera espaço vertical na
 * navbar e dá ao botão um "ancoramento" semântico com o conteúdo da página.
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  titulo,
  subtitulo,
  voltarPara = "back",
  labelVoltar = "Voltar",
  acoesDireita,
  className = "",
}) => {
  const showVoltar = voltarPara !== false;

  return (
    <div className={`mb-4 md:mb-6 ${className}`}>
      {/* Linha 1: botão voltar + ações (mobile-first) */}
      {(showVoltar || acoesDireita) && (
        <div className="flex items-center justify-between gap-2 mb-3 md:mb-4">
          {showVoltar ? (
            <BackButton para={voltarPara as any} label={labelVoltar} />
          ) : (
            <div aria-hidden />
          )}
          {acoesDireita && (
            <div className="flex items-center gap-2">{acoesDireita}</div>
          )}
        </div>
      )}

      {/* Linha 2: título + subtítulo */}
      <div className="px-1">
        <h1 className="text-xl md:text-2xl font-black uppercase italic tracking-tight text-[#394158]">
          {titulo}
        </h1>
        {subtitulo && (
          <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
            {subtitulo}
          </p>
        )}
      </div>
    </div>
  );
};
