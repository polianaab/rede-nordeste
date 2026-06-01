import React from "react";
import { Store, User } from "lucide-react";

interface ChatListItemProps {
  nome: string;
  avatarUrl?: string | null;
  ultimaMensagem?: string | null;
  dataUltimaMensagem?: string | null;
  naoLidas: number;
  ativo: boolean;
  variante: "loja" | "comprador";
  onClick: () => void;
}

const formatarTempo = (iso?: string | null): string => {
  if (!iso) return "";
  const data = new Date(iso);
  const agora = new Date();
  const diffMs = agora.getTime() - data.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "agora";
  if (diffMin < 60) return `${diffMin}min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24 && data.getDate() === agora.getDate()) {
    return data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  }
  const diffDias = Math.floor(diffH / 24);
  if (diffDias === 1) return "ontem";
  if (diffDias < 7) return `${diffDias}d`;
  return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
};

export const ChatListItem: React.FC<ChatListItemProps> = ({
  nome,
  avatarUrl,
  ultimaMensagem,
  dataUltimaMensagem,
  naoLidas,
  ativo,
  variante,
  onClick,
}) => {
  const FallbackIcon = variante === "loja" ? Store : User;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 border-b border-gray-100 text-left transition-colors ${
        ativo ? "bg-green-50" : "bg-white hover:bg-gray-50"
      }`}
    >
      <div className="relative shrink-0">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={nome}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <FallbackIcon className="w-6 h-6 text-green-700" />
          </div>
        )}
        {naoLidas > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center">
            {naoLidas > 99 ? "99+" : naoLidas}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline gap-2">
          <span className={`font-medium truncate ${naoLidas > 0 ? "text-gray-900" : "text-gray-800"}`}>
            {nome}
          </span>
          <span className="text-xs text-gray-500 shrink-0">
            {formatarTempo(dataUltimaMensagem)}
          </span>
        </div>
        <p className={`text-sm truncate ${naoLidas > 0 ? "text-gray-900 font-medium" : "text-gray-500"}`}>
          {ultimaMensagem || <span className="italic">Sem mensagens ainda</span>}
        </p>
      </div>
    </button>
  );
};
