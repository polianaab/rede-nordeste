// Padrão recomendado para o Chat.tsx existente
import { useEffect, useRef, useState } from "react";
import {
  getMensagens,
  abrirChat,
  enviarMensagemREST,
  conectarWebSocket,
  enviarMensagemWS,
  desconectarWebSocket,
} from "../../services/api";

import { useLocation } from "react-router-dom";

export default function Chat() {
  const location = useLocation();
  const queryLojaId = new URLSearchParams(location.search).get("lojaId");
  const lojaId = location.state?.lojaId || (queryLojaId ? Number(queryLojaId) : null);

  const [chatId, setChatId] = useState<number | null>(null);
  const [mensagens, setMensagens] = useState<any[]>([]);
  const [texto, setTexto] = useState("");
  const stompRef = useRef<any>(null);

  useEffect(() => {
    if (!lojaId) return;

    // 1. Abre ou busca chat existente
    abrirChat(lojaId).then((chat) => {
      setChatId(chat.id);

      // 2. Carrega histórico
      getMensagens(chat.id).then((page) => setMensagens(page.content));

      // 3. Conecta WebSocket
      stompRef.current = conectarWebSocket(chat.id, (novaMensagem) => {
        setMensagens((prev) => [...prev, novaMensagem]);
      });
    });

    return () => desconectarWebSocket();
  }, [lojaId]);

  const enviar = async () => {
    if (!texto.trim() || !chatId) return;

    // Tenta WebSocket, fallback para REST
    const enviouWS = enviarMensagemWS(chatId, texto);
    if (!enviouWS) {
      const msg = await enviarMensagemREST(chatId, texto);
      setMensagens((prev) => [...prev, msg]);
    }

    setTexto("");
  };

  return (
    <div>
      {/* renderizar mensagens */}
      {mensagens.map((m) => (
        <div key={m.id}><b>{m.nomeRemetente}:</b> {m.conteudo}</div>
      ))}
      <input value={texto} onChange={(e) => setTexto(e.target.value)} />
      <button onClick={enviar}>Enviar</button>
    </div>
  );
}