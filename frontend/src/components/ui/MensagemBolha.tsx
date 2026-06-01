import React from "react";

interface MensagemBolhaProps {
  conteudo: string;
  dataEnvio?: string;
  propria: boolean;
  lida?: boolean;
}

const formatarHora = (iso?: string): string => {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const MensagemBolha: React.FC<MensagemBolhaProps> = ({
  conteudo,
  dataEnvio,
  propria,
  lida,
}) => {
  return (
    <div className={`flex ${propria ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${
          propria
            ? "bg-green-600 text-white rounded-br-sm"
            : "bg-white text-gray-900 rounded-bl-sm border border-gray-200"
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{conteudo}</p>
        <div
          className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
            propria ? "text-green-100" : "text-gray-400"
          }`}
        >
          <span>{formatarHora(dataEnvio)}</span>
          {propria && <span>{lida ? "✓✓" : "✓"}</span>}
        </div>
      </div>
    </div>
  );
};
