import axios from 'axios';

export const apiService = axios.create({
  baseURL: 'http://localhost:3000', // Ou o link do seu Render/Heroku
});

// --- FUNÇÕES DE REGISTRO ---

export const registrarUsuario = async (dados: any) => {
  try {
    const response = await apiService.post('/usuarios/registrar', dados);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Erro ao registrar');
    }
    throw new Error('Erro de conexão com o servidor');
  }
};

export const registrarLoja = async (dados: any) => {
  try {
    const response = await apiService.post('/lojas/registrar', dados);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Erro ao registrar loja');
    }
    throw new Error('Erro de conexão com o servidor');
  }
};

// --- FUNÇÃO DE LOGIN ---

export const login = async (email: string, senha: string) => {
  try {
    const response = await apiService.post('/usuarios/login', { email, senha });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Credenciais inválidas');
    }
    throw new Error('Erro de conexão com o servidor');
  }
};