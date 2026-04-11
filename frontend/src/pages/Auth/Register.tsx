import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, Mail, Lock, FileText, Phone, 
  ArrowRight, ChevronLeft 
} from 'lucide-react';
// Importando corretamente o que criamos no api.ts
import { apiService, registrarUsuario } from '../../services/api';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    cpfCnpj: '',
    telefone: '',
    email: '',
    senhaHash: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFinalize = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Usando a função correta que foi importada
      const response = await registrarUsuario(formData);
      
      alert("🎉 Cadastro realizado com sucesso!");
      navigate('/login');
    } catch (error) {
      alert("⚠️ Erro ao cadastrar. Verifique se o Backend está rodando.");
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
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              name="nomeCompleto" 
              placeholder="Nome Completo" 
              className="w-full bg-[#F5F2ED]/50 py-4 pl-12 pr-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#55833d] transition-all" 
              onChange={handleChange}
              required
            />
          </div>

          <div className="relative">
            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              name="cpfCnpj" 
              placeholder="CPF ou CNPJ (apenas números)" 
              className="w-full bg-[#F5F2ED]/50 py-4 pl-12 pr-4 rounded-2xl outline-none" 
              onChange={handleChange}
              required
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              name="telefone" 
              placeholder="Telefone (ex: 81999998888)" 
              className="w-full bg-[#F5F2ED]/50 py-4 pl-12 pr-4 rounded-2xl outline-none" 
              onChange={handleChange}
              required
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              name="email" 
              type="email"
              placeholder="E-mail" 
              className="w-full bg-[#F5F2ED]/50 py-4 pl-12 pr-4 rounded-2xl outline-none" 
              onChange={handleChange}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              name="senhaHash" 
              type="password"
              placeholder="Senha" 
              className="w-full bg-[#F5F2ED]/50 py-4 pl-12 pr-4 rounded-2xl outline-none" 
              onChange={handleChange}
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#55833d] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-[#394158] transition-all active:scale-95 shadow-lg shadow-green-900/10 mt-6"
          >
            Finalizar Cadastro <ArrowRight size={18} />
          </button>
        </form>

        <p className="mt-8 text-center text-xs font-bold text-[#394158]/40 uppercase tracking-widest">
          Já tem uma conta? <Link to="/login" className="text-[#55833d] hover:underline">Entre aqui</Link>
        </p>
      </div>
      
      {/* Texto de apoio abaixo do card */}
      <p className="mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-[#394158]/20">
        © 2026 Rede Nordeste · Segurança e Transparência
      </p>
    </div>
  );
}