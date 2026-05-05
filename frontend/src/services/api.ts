import axios from "axios";


export const apiService = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * INTERCEPTOR DE REQUEST
 * Adiciona o Token de Acesso em todas as chamadas automaticamente
 */
apiService.interceptors.request.use(
  (config) => {
    const usuarioString = localStorage.getItem("usuarioLogado");
    if (usuarioString) {
      const usuario = JSON.parse(usuarioString);
      if (usuario.accessToken) {
        config.headers.Authorization = Bearer ${usuario.accessToken};
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * INTERCEPTOR DE RESPONSE
 * Lida com tokens expirados (Erro 401) usando o Refresh Token
 */
apiService.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;


    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const usuarioString = localStorage.getItem("usuarioLogado");
        if (!usuarioString) throw new Error("Usuário não logado");

        const usuario = JSON.parse(usuarioString);


        const res = await axios.post("http://localhost:8080/api/usuarios/refresh", {
          refreshToken: usuario.refreshToken,
        });

        if (res.status === 200) {
          // Atualiza o token no localStorage
          usuario.accessToken = res.data.accessToken;
          localStorage.setItem("usuarioLogado", JSON.stringify(usuario));


          originalRequest.headers.Authorization = Bearer ${res.data.accessToken};
          return apiService(originalRequest);
        }
      } catch (refreshError) {
        // Se o refresh token também falhar, desloga o usuário
        localStorage.removeItem("usuarioLogado");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// --- FUNÇÕES DE API ---

export const login = async (email: string, senha: string) => {
  const response = await apiService.post("/usuarios/login", { email, senha });
  return response.data;
};

export const registrarUsuario = async (dados: any) => {
  const response = await apiService.post("/usuarios/registrar", dados);
  return response.data;
};


export const listarProdutosMarketplace = async (nome = "", categoriaId = "") => {
  const response = await apiService.get(/produtos?nome=${nome}&categoriaId=${categoriaId});
  return response.data;
};

export const cadastrarProduto = async (produto: any) => {

  const response = await apiService.post("/produtor/produtos", produto);
  return response.data;
};

export default apiService;