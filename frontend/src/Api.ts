import axios from "axios";

// Instância do Axios configurada para o seu Backend Java
export const apiService = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// --- FUNÇÕES DE REGISTRO ---

/**
 * Cadastra um novo usuário (Comprador ou Produtor)
 * Rota no Java: POST http://localhost:8080/api/usuarios/registrar
 */
export const registrarUsuario = async (dados: any) => {
  try {
    const response = await apiService.post("/usuarios/registrar", dados);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Retorna a mensagem de erro vinda do Java (ex: "E-mail já cadastrado")
      throw new Error(error.response.data || "Erro ao registrar usuário");
    }
    throw new Error(
      "Erro de conexão com o servidor. Verifique se o Backend está na porta 8080.",
    );
  }
};

/**
 * Cadastra uma nova loja/perfil de vendedor
 * Rota no Java: POST http://localhost:8080/api/lojas/registrar
 */
export const registrarLoja = async (dados: any) => {
  try {
    const response = await apiService.post("/lojas/registrar", dados);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data || "Erro ao registrar loja");
    }
    throw new Error("Erro de conexão com o servidor");
  }
};

// --- FUNÇÃO DE LOGIN ---

/**
 * Realiza a autenticação
 * Rota no Java: POST http://localhost:8080/api/usuarios/login
 */
export const login = async (email: string, senha: string) => {
  try {
    const response = await apiService.post("/usuarios/login", { email, senha });
    return response.data; // Deve retornar o Token JWT e dados do usuário
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data || "Credenciais inválidas");
    }
    throw new Error("Erro de conexão com o servidor");
  }
};

export default apiService;