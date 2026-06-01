import React from "react";
import { ArrowLeft, Store, User, Wifi, WifiOff } from "lucide-react";

interface CabecalhoChatProps {
  nome: string;
  subtitulo?: string;
  avatarUrl?: string | null;
  variante: "loja" | "comprador";
  conectado: boolean;
  /** Em mobile, volta para a lista de conversas. */
  onVoltar?: () => void;
}

export const CabecalhoChat: React.FC<CabecalhoChatProps> = ({
  nome,
  subtitulo,
  avatarUrl,
  variante,
  conectado,
  onVoltar,
}) => {
  const FallbackIcon = variante === "loja" ? Store : User;

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white shadow-sm">
      {onVoltar && (
        <button
          type="button"
          onClick={onVoltar}
          className="md:hidden p-1 -ml-1 rounded-full hover:bg-gray-100"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
      )}

      {avatarUrl ? (
        <img src={avatarUrl} alt={nome} className="w-10 h-10 rounded-full object-cover" />
      ) : (
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
          <FallbackIcon className="w-5 h-5 text-green-700" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <h2 className="font-semibold text-gray-900 truncate">{nome}</h2>
        {subtitulo && <p className="text-xs text-gray-500 truncate">{subtitulo}</p>}
      </div>

      <div
        className={`flex items-center gap-1 text-xs ${
          conectado ? "text-green-600" : "text-amber-600"
        }`}
        title={conectado ? "Conectado em tempo real" : "Modo offline (REST)"}
      >
        {conectado ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
      </div>
    </div>
  );
};
