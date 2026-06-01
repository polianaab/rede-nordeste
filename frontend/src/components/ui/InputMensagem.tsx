import React, { useState, KeyboardEvent } from "react";
import { Send } from "lucide-react";

interface InputMensagemProps {
  onEnviar: (texto: string) => void | Promise<void>;
  disabled?: boolean;
}

export const InputMensagem: React.FC<InputMensagemProps> = ({ onEnviar, disabled }) => {
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);

  const enviar = async () => {
    const limpo = texto.trim();
    if (!limpo || enviando || disabled) return;
    setEnviando(true);
    try {
      await onEnviar(limpo);
      setTexto("");
    } finally {
      setEnviando(false);
    }
  };

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviar();
    }
  };

  return (
    <div className="flex items-end gap-2 p-3 border-t border-gray-200 bg-white">
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        onKeyDown={onKey}
        placeholder="Digite uma mensagem..."
        rows={1}
        maxLength={2000}
        disabled={disabled || enviando}
        className="flex-1 resize-none rounded-2xl border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 max-h-32"
      />
      <button
        type="button"
        onClick={enviar}
        disabled={!texto.trim() || enviando || disabled}
        className="shrink-0 w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        aria-label="Enviar mensagem"
      >
        <Send className="w-4 h-4" />
      </button>
    </div>
  );
};
