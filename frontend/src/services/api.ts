import axios from "axios";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

// ============================================================
// INSTÂNCIA BASE
// ============================================================
export const apiService = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

// ============================================================
// INTERCEPTOR — injeta token em toda requisição
// ============================================================
apiService.interceptors.request.use((config) => {
  const raw = localStorage.getItem("usuarioLogado");
  if (raw) {
    try {
      const dados = JSON.parse(raw);
      if (dados?.accessToken) {
        config.headers.Authorization = `Bearer ${dados.accessToken}`;
      }
    } catch {
      localStorage.removeItem("usuarioLogado");
    }
  }
  return config;
});

// ============================================================
// INTERCEPTOR — trata erros e faz refresh automático
// ============================================================
apiService.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const raw = localStorage.getItem("usuarioLogado");
        if (!raw) throw new Error("Sem sessão");

        const dados = JSON.parse(raw);
        const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
        const res = await axios.post(`${baseURL}/usuarios/refresh`, {
          refreshToken: dados.refreshToken,
        });

        const novos = { ...dados, ...res.data };
        localStorage.setItem("usuarioLogado", JSON.stringify(novos));
        original.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return apiService(original);
      } catch {
        localStorage.removeItem("usuarioLogado");
        window.location.href = "/login";
        return Promise.reject(new Error("Sessão expirada. Faça login novamente."));
      }
    }

    let mensagem = "Erro inesperado no servidor.";
    if (error.response) {
      const data = error.response.data;
      if (typeof data === "string" && data.trim() !== "") {
        mensagem = data;
      } else if (data && typeof data === "object") {
        mensagem =
          data.message ||
          data.erro ||
          data.error ||
          data.details ||
          "Erro ao processar requisição.";
      }
    } else if (error.request) {
      mensagem =
        "Não foi possível conectar ao servidor. Verifique se o backend está rodando na porta 8080.";
    }

    return Promise.reject(new Error(mensagem));
  }
);

// ============================================================
// AUTH
// ============================================================
export const registrarUsuario = async (dados: {
  nomeCompleto: string;
  cpfCnpj: string;
  telefone: string;
  email: string;
  senha: string;
  tipoPerfil: string;
}) => {
  const res = await apiService.post("/usuarios/registrar", dados);
  return res.data;
};

export const login = async (email: string, senha: string) => {
  const res = await apiService.post("/usuarios/login", { email, senha });
  return res.data;
};

export const refresh = async (refreshToken: string) => {
  const res = await apiService.post("/usuarios/refresh", { refreshToken });
  return res.data;
};

export const getMeuPerfil = async () => {
  const res = await apiService.get("/usuarios/me");
  return res.data;
};

// ============================================================
// LOJA
// ============================================================
export const criarLoja = async (dados: any) => {
  const res = await apiService.post("/produtor/loja", dados);
  return res.data;
};

export const atualizarLoja = async (dados: any) => {
  const res = await apiService.put("/produtor/loja", dados);
  return res.data;
};

export const getMinhaLoja = async () => {
  const res = await apiService.get("/produtor/loja");
  return res.data;
};

export const getLojaPorId = async (id: number | string) => {
  const res = await apiService.get(`/lojas/${id}`);
  return res.data;
};

// ============================================================
// CATEGORIAS
// ============================================================
export const getCategorias = async () => {
  const res = await apiService.get("/categorias");
  return res.data;
};

// ============================================================
// PRODUTOS
// ============================================================
export const criarProduto = async (dados: any) => {
  const res = await apiService.post("/produtor/produtos", dados);
  return res.data;
};

export const atualizarProduto = async (id: number, dados: any) => {
  const res = await apiService.put(`/produtor/produtos/${id}`, dados);
  return res.data;
};

export const deletarProduto = async (id: number) => {
  await apiService.delete(`/produtor/produtos/${id}`);
};

export const getProdutosPorLoja = async (lojaId: number, page = 0) => {
  const res = await apiService.get(`/lojas/${lojaId}/produtos?page=${page}`);
  return res.data;
};

export const buscarProdutos = async (
  nome?: string,
  categoriaId?: number,
  page = 0
) => {
  const params = new URLSearchParams();
  if (nome) params.append("nome", nome);
  if (categoriaId) params.append("categoriaId", String(categoriaId));
  params.append("page", String(page));
  const res = await apiService.get(`/produtos?${params.toString()}`);
  return res.data;
};

export const getProdutoPorId = async (id: number) => {
  const res = await apiService.get(`/produtos/${id}`);
  return res.data;
};

export const getProdutosHome = async () => {
  const res = await apiService.get("/produtos/home");
  return res.data;
};

// ============================================================
// ADMIN — PRODUTOS PENDENTES
// ============================================================
export const getProdutosPendentes = async (page = 0) => {
  const res = await apiService.get(`/admin/produtos/pendentes?page=${page}`);
  return res.data;
};

export const aprovarOuRejeitarProduto = async (
  id: number,
  status: "APROVADO" | "REJEITADO"
) => {
  const res = await apiService.patch(`/admin/produtos/${id}/status`, { status });
  return res.data;
};

// ============================================================
// CARRINHO (com fallback para localStorage)
// ============================================================
const getCarrinhoLocal = () => {
  const c = localStorage.getItem("mock_carrinho");
  return c ? JSON.parse(c) : { itens: [], totalItens: 0, valorTotal: 0 };
};

const salvarCarrinhoLocal = (carrinho: any) => {
  let totalValor = 0;
  let totalItens = 0;
  carrinho.itens.forEach((i: any) => {
    i.subtotal = i.precoUnitario * i.quantidade;
    totalValor += i.subtotal;
    totalItens += i.quantidade;
  });
  carrinho.valorTotal = totalValor;
  carrinho.totalItens = totalItens;
  localStorage.setItem("mock_carrinho", JSON.stringify(carrinho));
  return carrinho;
};

export const getCarrinho = async () => {
  try {
    const res = await apiService.get("/comprador/carrinho");
    return res.data;
  } catch {
    return getCarrinhoLocal();
  }
};

export const adicionarAoCarrinho = async (
  produtoId: number,
  quantidade: number
) => {
  try {
    const res = await apiService.post("/comprador/carrinho", {
      produtoId,
      quantidade,
    });
    return res.data;
  } catch {
    const cart = getCarrinhoLocal();
    const itemExistente = cart.itens.find((i: any) => i.produtoId === produtoId);
    if (itemExistente) {
      if (window.location.pathname.includes("carrinho")) {
        itemExistente.quantidade = quantidade;
      } else {
        itemExistente.quantidade += quantidade;
      }
    } else {
      let prodDetalhe: any = null;
      try {
        const res = await apiService.get(`/produtos/${produtoId}`);
        prodDetalhe = res.data;
      } catch {
        prodDetalhe = {
          id: produtoId,
          nome: "Produto " + produtoId,
          precoAtual: 15.9,
          imagemUrl: "https://via.placeholder.com/100",
          lojaId: 1,
        };
      }
      cart.itens.push({
        id: Date.now(),
        produtoId,
        nomeProduto: prodDetalhe.nome,
        precoUnitario: prodDetalhe.precoAtual,
        quantidade,
        imagemUrl: prodDetalhe.imagemUrl,
        lojaId: prodDetalhe.lojaId,
        subtotal: prodDetalhe.precoAtual * quantidade,
      });
    }
    return salvarCarrinhoLocal(cart);
  }
};

export const removerDoCarrinho = async (produtoId: number) => {
  try {
    const res = await apiService.delete(`/comprador/carrinho/${produtoId}`);
    return res.data;
  } catch {
    const cart = getCarrinhoLocal();
    cart.itens = cart.itens.filter((i: any) => i.produtoId !== produtoId);
    return salvarCarrinhoLocal(cart);
  }
};

export const limparCarrinho = async () => {
  try {
    await apiService.delete("/comprador/carrinho");
  } catch {
    localStorage.removeItem("mock_carrinho");
  }
};

// ============================================================
// PEDIDOS
// ============================================================
export const checkout = async (dados: {
  metodoPagamento: string;
  retiradaNaLoja: boolean;
  enderecoEntrega?: string;
  cidadeDestino?: string;
  latitudeDestino?: number;
  longitudeDestino?: number;
  observacoes?: string;
}) => {
  const res = await apiService.post("/comprador/pedidos/checkout", dados);
  return res.data;
};

export const getMeusPedidos = async (page = 0) => {
  const res = await apiService.get(`/comprador/pedidos?page=${page}`);
  return res.data;
};

export const getPedidoDetalhe = async (id: number) => {
  const res = await apiService.get(`/comprador/pedidos/${id}`);
  return res.data;
};

export const getPedidosDaLoja = async (page = 0) => {
  const res = await apiService.get(`/produtor/pedidos?page=${page}`);
  return res.data;
};

export const atualizarStatusEntrega = async (
  pedidoId: number,
  status: string
) => {
  const res = await apiService.patch(
    `/produtor/pedidos/${pedidoId}/status?status=${status}`
  );
  return res.data;
};

// ============================================================
// FRETE
// ============================================================
export const simularFrete = async (
  lojaId: number,
  latitudeDestino: number,
  longitudeDestino: number
) => {
  const res = await apiService.post("/frete/simular", {
    lojaId,
    latitudeDestino,
    longitudeDestino,
  });
  return res.data;
};

// ============================================================
// ENTREGADORES
// ============================================================
export const cadastrarEntregador = async (dados: {
  nomeCompleto: string;
  cpf: string;
  telefone: string;
  cidade: string;
  latitudeBase?: number;
  longitudeBase?: number;
  tipoVeiculo: string;
  placaVeiculo?: string;
  numeroCnh?: string;
}) => {
  const res = await apiService.post("/entregadores/cadastrar", dados);
  return res.data;
};

export const alterarDisponibilidade = async (
  id: number,
  disponivel: boolean
) => {
  await apiService.patch(
    `/entregadores/${id}/disponibilidade?disponivel=${disponivel}`
  );
};

// ============================================================
// CHAT — REST
// ============================================================
export const abrirChat = async (lojaId: number) => {
  const res = await apiService.post(`/comprador/chats/abrir?lojaId=${lojaId}`);
  return res.data;
};

export const getChatsComprador = async () => {
  const res = await apiService.get("/comprador/chats");
  return res.data;
};

export const getChatsDaLoja = async () => {
  const res = await apiService.get("/produtor/chats");
  return res.data;
};

export const getMensagens = async (chatId: number, page = 0) => {
  const res = await apiService.get(
    `/chats/${chatId}/mensagens?page=${page}&sort=dataEnvio,asc`
  );
  return res.data;
};

export const enviarMensagemREST = async (chatId: number, conteudo: string) => {
  const res = await apiService.post(`/chats/${chatId}/mensagens`, { conteudo });
  return res.data;
};

export const getNaoLidas = async () => {
  const res = await apiService.get("/chats/nao-lidas");
  return res.data;
};

// ============================================================
// CHAT — WebSocket com STOMP
// ============================================================
let stompClient: Client | null = null;

export const conectarWebSocket = (
  chatId: number,
  onMensagem: (msg: any) => void,
  onNotificacao?: (notif: any) => void
) => {
  const raw = localStorage.getItem("usuarioLogado");
  const token = raw ? JSON.parse(raw).accessToken : null;
  const wsBase =
    import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:8080";

  stompClient = new Client({
    webSocketFactory: () => new SockJS(`${wsBase}/ws/chat`) as WebSocket,
    connectHeaders: { Authorization: `Bearer ${token}` },
    onConnect: () => {
      stompClient?.subscribe(`/topic/chat/${chatId}`, (frame) => {
        onMensagem(JSON.parse(frame.body));
      });
      if (onNotificacao) {
        stompClient?.subscribe("/user/queue/notificacoes", (frame) => {
          onNotificacao(JSON.parse(frame.body));
        });
      }
    },
    onDisconnect: () => console.log("WebSocket desconectado"),
    onStompError: (frame) => console.error("STOMP error:", frame),
    reconnectDelay: 5000,
  });

  stompClient.activate();
  return stompClient;
};

export const enviarMensagemWS = (chatId: number, conteudo: string) => {
  if (stompClient?.connected) {
    stompClient.publish({
      destination: `/app/chat/${chatId}`,
      body: JSON.stringify({ conteudo }),
    });
    return true;
  }
  return false;
};

export const desconectarWebSocket = () => {
  stompClient?.deactivate();
  stompClient = null;
};

export default apiService;