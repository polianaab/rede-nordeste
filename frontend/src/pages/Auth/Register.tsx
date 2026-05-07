import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, Mail, Lock, FileText, Phone, 
  ArrowRight, ChevronLeft 
} from 'lucide-react';
import { registrarUsuario } from '../../services/api';

export default function Register() {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(false);
  
  // Estado inicial sincronizado com o DTO do Java (UsuarioRegistroRequest)
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    cpfCnpj: '',
    telefone: '',
    email: '',
    senha: '', // Alterado de senhaHash para senha para casar com o DTO
    tipoPerfil: 'COMPRADOR' // Valor padrão do Enum
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFinalize = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);

    try {

    await registrarUsuario({
    nomeCompleto: formData.nomeCompleto,
    cpfCnpj: formData.cpfCnpj,
    telefone: formData.telefone,
    email: formData.email,
    senha: formData.senha,
    tipoPerfil: formData.tipoPerfil,
});
      
      alert("🎉 Cadastro realizado com sucesso! Faça seu login.");
      navigate('/login');
    } catch (error: any) {
      // Pega a mensagem de erro que o seu ExceptionHandler do Java enviar
      alert(`⚠️ Erro no cadastro: ${error.message}`);
      console.error("Erro detalhado:", error);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F2ED] flex flex-col items-center justify-center py-10 px-6">
      <div className="mb-8">
        <Link to="/">
          <img src="/assets/logo-rede-nordeste.png" alt="Rede Nordeste" className="h-32" />
        </Link>
      </div>

      <div className="bg-white p-10 rounded-[3rem] shadow-xl max-w-md w-full border border-gray-100">
        <header className="flex items-center mb-8">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
            <ChevronLeft size={20} />
          </button>
          <h2 className="flex-1 text-center text-2xl font-black uppercase italic tracking-tighter text-[#394158]">
            Crie sua conta
          </h2>
        </header>

        <form onSubmit={handleFinalize} className="space-y-4">
          {/* Nome Completo */}
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              name="nomeCompleto" 
              type="text"
              placeholder="Nome Completo" 
              className="w-full bg-[#F5F2ED]/50 py-4 pl-12 pr-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#55833d] transition-all" 
              onChange={handleChange}
              value={formData.nomeCompleto}
              required
            />
          </div>

          {/* CPF ou CNPJ */}
          <div className="relative">
            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              name="cpfCnpj" 
              type="text"
              placeholder="CPF ou CNPJ (apenas números)" 
              className="w-full bg-[#F5F2ED]/50 py-4 pl-12 pr-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#55833d] transition-all" 
              onChange={handleChange}
              value={formData.cpfCnpj}
              required
            />
          </div>

          {/* Telefone */}
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              name="telefone" 
              type="tel"
              placeholder="Telefone (ex: 81999998888)" 
              className="w-full bg-[#F5F2ED]/50 py-4 pl-12 pr-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#55833d] transition-all" 
              onChange={handleChange}
              value={formData.telefone}
              required
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              name="email" 
              type="email"
              placeholder="E-mail" 
              className="w-full bg-[#F5F2ED]/50 py-4 pl-12 pr-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#55833d] transition-all" 
              onChange={handleChange}
              value={formData.email}
              required
            />
          </div>

          {/* Senha */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              name="senha" 
              type="password"
              placeholder="Senha" 
              className="w-full bg-[#F5F2ED]/50 py-4 pl-12 pr-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#55833d] transition-all" 
              onChange={handleChange}
              value={formData.senha}
              required
            />
          </div>

          {/* Tipo de Perfil */}
          <div className="relative">
            <select 
              name="tipoPerfil"
              className="w-full bg-[#F5F2ED]/50 py-4 px-4 rounded-2xl outline-none appearance-none font-bold text-[#394158]/60 focus:ring-2 focus:ring-[#55833d] transition-all"
              onChange={handleChange}
              value={formData.tipoPerfil}
              required
            >
              <option value="COMPRADOR">SOU COMPRADOR</option>
              <option value="PRODUTOR">SOU PRODUTOR</option>
            </select>
          </div>

          <button 
            type="submit"
            disabled={carregando}
            className={`w-full ${carregando ? 'bg-gray-400' : 'bg-[#55833d] hover:bg-[#394158]'} text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg mt-6`}
          >
            {carregando ? 'Processando...' : 'Finalizar Cadastro'} <ArrowRight size={18} />
          </button>
        </form>

        <p className="mt-8 text-center text-xs font-bold text-[#394158]/40 uppercase tracking-widest">
          Já tem uma conta? <Link to="/login" className="text-[#55833d] hover:underline">Entre aqui</Link>
        </p>
      </div>
      
      <p className="mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-[#394158]/20">
        ©️ 2026 Rede Nordeste · Segurança e Transparência
      </p>
    </div>
  );
}