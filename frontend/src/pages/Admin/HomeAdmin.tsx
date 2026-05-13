import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Store, DollarSign, Settings, 
  Bell, Search, Menu, X, ShieldCheck, TrendingUp, 
  AlertTriangle, CheckCircle, Package, ArrowRight, UserCheck,
  Newspaper, Image as ImageIcon, Plus, Edit2, Calendar, Clock, Quote, ChefHat, Utensils,
  Trash2,
  ShoppingCart,
  Tag
} from 'lucide-react';

// --- DADOS INICIAIS DO MOCK ---
const NOTICIAS_INICIAIS = [
  { 
    id: 1, 
    titulo: 'MANEJO INTELIGENTE', 
    subtitulo: 'Práticas modernas para melhorar a produtividade.',
    categoria: 'MANEJO',
    data: '18 de Abril de 2026', 
    tempoLeitura: '5 min',
    imagem: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=1170&auto=format&fit=crop',
    descricao: 'Otimizar o uso de recursos hídricos e fertilizantes é a chave para uma colheita saudável no sertão.',
    citacao: 'A tecnologia não substitui o produtor, mas potencializa seu conhecimento.'
  }
];

const SOLICITACOES_PENDENTES = [
  { id: 1, nome: 'Sítio Vale Verde', responsavel: 'José Almir', tipo: 'Hortifruti', documento: '45.123.890/0001-12', data: 'Há 2 horas' },
  { id: 2, nome: 'Artesanato Raiz', responsavel: 'Marta Luz', tipo: 'Artesanato', documento: 'CPF: 012.345.678-90', data: 'Há 5 horas' },
  { id: 3, nome: 'Laticínios Sertão', responsavel: 'Carlos Eduardo', tipo: 'Laticínios', documento: '08.999.111/0001-44', data: 'Há 1 dia' },
];

export default function HomeAdmin() {
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState('dashboard');
  const [menuAberto, setMenuAberto] = useState(false);
  const [notifAberta, setNotifAberta] = useState(false);
  
  // Modais
  const [modalNoticia, setModalNoticia] = useState(false);
  const [modalReceita, setModalReceita] = useState(false);
  
  // Modal de Confirmação de Exclusão
  const [confirmarExclusao, setConfirmarExclusao] = useState<{aberto: boolean, id: number | null}>({
    aberto: false,
    id: null
  });

  // --- ESTADOS DO BLOG E RECEITAS ---
  const [noticiasGlobais, setNoticiasGlobais] = useState<any[]>([]);
  const [formNoticia, setFormNoticia] = useState<any>({
    id: null, titulo: '', subtitulo: '', imagem: '', descricao: '', citacao: '', tempo: '3 min', categoria: 'NOTÍCIA'
  });

  const [receitasGlobais, setReceitasGlobais] = useState<any[]>([]);
  const [formReceita, setFormReceita] = useState({
    titulo: '', descricao: '', imagem: '', ingredientes: '', preparo: '', tempo: '40 min', porcoes: '4 porções', dificuldade: 'Fácil'
  });

  // --- ESTADOS DESTAQUES HOME ---
  const [destaquesHome, setDestaquesHome] = useState<any[]>([]);
  const [modalDestaque, setModalDestaque] = useState(false);
  const [formDestaque, setFormDestaque] = useState<any>({
    id: null, tipo: 'DESTAQUE', titulo: '', subtitulo: '', img: '', corDestaque: 'text-[#f9943b]', blogId: ''
  });

  // Proteção e Carregamento de Dados
  useEffect(() => {
    localStorage.setItem('user_role', 'admin');
    
    const carregarDados = () => {
      const nSalvas = localStorage.getItem('noticias_globais');
      if (nSalvas) {
        setNoticiasGlobais(JSON.parse(nSalvas));
      } else { 
        localStorage.setItem('noticias_globais', JSON.stringify(NOTICIAS_INICIAIS)); 
        setNoticiasGlobais(NOTICIAS_INICIAIS); 
      }
      
      const rSalvas = localStorage.getItem('receitas_globais');
      if (rSalvas) setReceitasGlobais(JSON.parse(rSalvas));

      const dSalvas = localStorage.getItem('destaques_home');
      if (dSalvas) {
        setDestaquesHome(JSON.parse(dSalvas));
      } else {
        const initialDestaques = [
          { id: 1, tipo: "SAFRA DO MÊS", titulo: "A melhor época para comprar manga", subtitulo: "Produtos frescos e com preços especiais direto do produtor.", img: "https://images.unsplash.com/photo-1591073113125-e46713c829ed?q=80&w=2000", corDestaque: "text-[#f9943b]", blogId: 3 },
          { id: 2, tipo: "HISTÓRIA DE SUCESSO", titulo: "Como o seu João dobrou a renda com os morangos", subtitulo: "Conheça a trajetória do agricultor que apostou na venda direta.", img: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=2000&auto=format&fit=crop", corDestaque: "text-[#55833d]", blogId: 5 },
          { id: 3, tipo: "TECNOLOGIA NO CAMPO", titulo: "A revolução digital chegou ao roçado", subtitulo: "Drones e dados auxiliam na precisão da colheita familiar.", img: "https://images.pexels.com/photos/34182385/pexels-photo-34182385.jpeg?auto=compress&cs=tinysrgb&w=1260", corDestaque: "text-[#C4D663]", blogId: 0 }
        ];
        localStorage.setItem('destaques_home', JSON.stringify(initialDestaques));
        setDestaquesHome(initialDestaques);
      }
    };

    carregarDados();
    window.addEventListener('storage', carregarDados);
    return () => window.removeEventListener('storage', carregarDados);
  }, []);

  // Funções de Exclusão
  const handleApagarNoticia = (id: number) => {
    const listaAtualizada = noticiasGlobais.filter(n => n.id !== id);
    setNoticiasGlobais(listaAtualizada);
    localStorage.setItem('noticias_globais', JSON.stringify(listaAtualizada));
    window.dispatchEvent(new Event('storage'));
    setConfirmarExclusao({ aberto: false, id: null });
  };

  // Upload Imagem (Notícia)
  const handleNoticiaImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormNoticia({ ...formNoticia, imagem: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  // Upload Imagem (Receita)
  const handleReceitaImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormReceita({ ...formReceita, imagem: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  // Upload Imagem (Destaque)
  const handleDestaqueImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormDestaque({ ...formDestaque, img: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const salvarNoticia = () => {
    if (!formNoticia.titulo || !formNoticia.imagem) return alert("Preencha ao menos o título e adicione uma imagem!");
    
    let listaAtualizada;
    if (formNoticia.id) {
       listaAtualizada = noticiasGlobais.map(n => 
          n.id === formNoticia.id ? { ...formNoticia, data: n.data, tempoLeitura: formNoticia.tempo || '3 min' } : n
       );
    } else {
       const novaNoticia = { ...formNoticia, id: Date.now(), data: new Date().toLocaleDateString('pt-BR'), tempoLeitura: formNoticia.tempo || '3 min' };
       listaAtualizada = [novaNoticia, ...noticiasGlobais];
    }
    
    setNoticiasGlobais(listaAtualizada);
    localStorage.setItem('noticias_globais', JSON.stringify(listaAtualizada));
    window.dispatchEvent(new Event('storage'));
    setModalNoticia(false);
    setFormNoticia({ id: null, titulo: '', subtitulo: '', imagem: '', descricao: '', citacao: '', tempo: '3 min', categoria: 'NOTÍCIA' });
  };
  
  const handleEditarNoticia = (noticia: any) => {
    setFormNoticia({
      id: noticia.id,
      titulo: noticia.titulo,
      subtitulo: noticia.subtitulo || '',
      imagem: noticia.imagem || '',
      descricao: noticia.descricao || noticia.conteudo || '',
      citacao: noticia.citacao || '',
      tempo: noticia.tempoLeitura || noticia.tempo || '3 min',
      categoria: noticia.categoria || 'NOTÍCIA'
    });
    setModalNoticia(true);
  };

  const salvarReceita = () => {
    if (!formReceita.titulo || !formReceita.imagem || !formReceita.ingredientes) return alert("Preencha o título, imagem e ingredientes!");
    const novaReceita = { ...formReceita, id: Date.now(), data: new Date().toLocaleDateString('pt-BR') };
    const listaAtualizada = [novaReceita, ...receitasGlobais];
    setReceitasGlobais(listaAtualizada);
    localStorage.setItem('receitas_globais', JSON.stringify(listaAtualizada));
    window.dispatchEvent(new Event('storage'));
    setModalReceita(false);
    setFormReceita({ titulo: '', descricao: '', imagem: '', ingredientes: '', preparo: '', tempo: '40 min', porcoes: '4 porções', dificuldade: 'Fácil' });
    navigate('/receitas');
  };

  const salvarDestaque = () => {
    if (!formDestaque.titulo || !formDestaque.img) return alert("Preencha o título e adicione uma imagem!");
    
    let listaAtualizada;
    if (formDestaque.id) {
       listaAtualizada = destaquesHome.map(d => d.id === formDestaque.id ? formDestaque : d);
    } else {
       listaAtualizada = [{ ...formDestaque, id: Date.now() }, ...destaquesHome];
    }
    
    setDestaquesHome(listaAtualizada);
    localStorage.setItem('destaques_home', JSON.stringify(listaAtualizada));
    window.dispatchEvent(new Event('storage'));
    setModalDestaque(false);
    setFormDestaque({ id: null, tipo: 'DESTAQUE', titulo: '', subtitulo: '', img: '', corDestaque: 'text-[#f9943b]', blogId: '' });
  };

  const handleApagarDestaque = (id: number) => {
    const listaAtualizada = destaquesHome.filter(d => d.id !== id);
    setDestaquesHome(listaAtualizada);
    localStorage.setItem('destaques_home', JSON.stringify(listaAtualizada));
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="min-h-screen bg-[#F5F2ED] text-[#394158] font-sans flex flex-col md:flex-row overflow-x-hidden">
      
      {/* SIDEBAR RESPONSIVA */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen bg-[#1a1f2e] text-white p-6 flex flex-col z-[100] transition-transform duration-300 w-72 shadow-2xl ${menuAberto ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="mb-10 flex flex-col items-center gap-2 pt-4 border-b border-white/10 pb-8 relative">
          <button onClick={() => setMenuAberto(false)} className="absolute top-0 right-0 md:hidden p-2 text-white/50"><X size={20}/></button>
          <img src="/assets/logo-admin.png" alt="Logo" className="h-12 object-contain translate-x-0" />
          <div className="bg-[#f9943b] text-white text-[8px] font-black uppercase tracking-[0.3em] px-3 py-1 rounded-full mt-2 flex items-center gap-1">
            <ShieldCheck size={10} /> Central Admin
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
          {[
            { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard },
            { id: 'verificacao', label: 'Verificação de Usuários', icon: UserCheck },
            { id: 'destaques', label: 'Banners da Home', icon: ImageIcon },
            { id: 'noticias', label: 'Alimentar Blog', icon: Newspaper },
            { id: 'receitas', label: 'Alimentar Receitas', icon: ChefHat },
            { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => { setAbaAtiva(item.id); setMenuAberto(false); }}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1rem] transition-all font-black uppercase text-[10px] tracking-widest ${
                abaAtiva === item.id ? 'bg-[#f9943b] text-white shadow-lg' : 'text-white/40 hover:bg-white/10'
              }`}
            >
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10">
          <button onClick={() => navigate('/home2')} className="w-full px-6 py-4 text-[#f9943b] font-black uppercase text-[10px] tracking-widest hover:bg-[#f9943b]/10 rounded-[1rem] transition-all flex items-center gap-3">
             <ArrowRight size={16} rotate={180}/> Sair do Painel
          </button>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white py-6 px-6 md:px-12 border-b border-gray-100 flex justify-between items-center sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-4">
             <button onClick={() => setMenuAberto(true)} className="md:hidden p-2 bg-[#F5F2ED] rounded-full text-[#394158]"><Menu size={20}/></button>
             <h1 className="text-lg md:text-2xl font-black uppercase italic tracking-tighter text-[#394158]">
               {abaAtiva === 'dashboard' && 'Dashboard'}
               {abaAtiva === 'destaques' && 'Banners da Home'}
               {abaAtiva === 'noticias' && 'Gestão do Blog'}
               {abaAtiva === 'receitas' && 'Gestão de Receitas'}
               {abaAtiva === 'verificacao' && 'Moderação e Verificação'}
             </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
                <button onClick={() => setNotifAberta(!notifAberta)} className="p-2.5 bg-[#F5F2ED] rounded-full hover:bg-[#f9943b] hover:text-white transition-all">
                    <Bell size={20}/>
                </button>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#1a1f2e] border-2 border-white shadow-md flex items-center justify-center text-white text-xs font-black">AD</div>
          </div>
        </header>

        <div className="p-6 md:p-12">
          {/* DASHBOARD GERAL */}
          {abaAtiva === 'dashboard' && (
            <div className="animate-in fade-in duration-500 space-y-10">
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { label: 'Movimentação Total', valor: 'R$ 45.890', icon: DollarSign, cor: 'text-[#55833d]', bg: 'bg-[#55833d]/10' },
                  { label: 'Lojas Ativas', valor: '142', icon: Store, cor: 'text-[#f9943b]', bg: 'bg-[#f9943b]/10' },
                  { label: 'Novos Membros', valor: '+45', icon: Users, cor: 'text-blue-500', bg: 'bg-blue-500/10' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-8 rounded-[1rem] shadow-sm border border-gray-100 flex justify-between items-center">
                    <div><p className="text-[10px] font-black uppercase text-gray-400 mb-1">{stat.label}</p><h3 className={`text-2xl font-black italic ${stat.cor}`}>{stat.valor}</h3></div>
                    <div className={`p-4 ${stat.bg} ${stat.cor} rounded-2xl`}><stat.icon size={24}/></div>
                  </div>
                ))}
              </section>
            </div>
          )}

          {/* VERIFICAÇÃO DE USUÁRIOS */}
          {abaAtiva === 'verificacao' && (
            <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-8">
              <div className="bg-white p-8 rounded-[1rem] border border-gray-100 shadow-sm mb-6">
                 <h2 className="text-xl font-black uppercase italic tracking-tighter text-[#394158]">Aprovações Pendentes</h2>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Verifique os documentos antes de liberar o vendedor</p>
              </div>

              <div className="bg-white rounded-[1rem] shadow-sm border border-gray-100 overflow-hidden">
                 <div className="p-6 md:p-8 space-y-4">
                    {SOLICITACOES_PENDENTES.map(solic => (
                       <div key={solic.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-gray-50 border border-gray-100 rounded-[1rem] hover:border-[#f9943b]/30 transition-all">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-[#394158]/5 text-[#394158] rounded-full flex items-center justify-center"><Store size={20}/></div>
                             <div>
                                <h4 className="font-black text-sm uppercase text-[#394158]">{solic.nome}</h4>
                                <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">Resp: {solic.responsavel} | {solic.tipo}</p>
                                <p className="text-[10px] font-black text-[#55833d] uppercase mt-1">DOC: {solic.documento}</p>
                             </div>
                          </div>
                          <div className="flex gap-2 w-full md:w-auto">
                             <button className="flex-1 md:flex-none px-6 py-3 bg-white border border-gray-200 text-[#394158] text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-colors">Analisar Perfil</button>
                             <button className="flex-1 md:flex-none px-6 py-3 bg-red-50 text-red-500 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-red-100 transition-colors">Recusar</button>
                             <button className="flex-1 md:flex-none px-6 py-3 bg-[#55833d] text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-[#436b2f] transition-colors flex items-center justify-center gap-1"><CheckCircle size={14}/> Aprovar</button>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
            </div>
          )}

          {/* DESTAQUES DA HOME */}
          {abaAtiva === 'destaques' && (
            <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-8 rounded-[1rem] border border-gray-100 gap-4 shadow-sm">
                  <div>
                    <h2 className="text-xl font-black uppercase italic tracking-tighter text-[#394158]">Banners da Home</h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Gerencie as imagens que passam no topo da página inicial</p>
                 </div>
                 <button onClick={() => { setFormDestaque({ id: null, tipo: 'DESTAQUE', titulo: '', subtitulo: '', img: '', corDestaque: 'text-[#f9943b]', blogId: '' }); setModalDestaque(true); }} className="w-full sm:w-auto bg-[#f9943b] text-white px-8 py-4 rounded-[1rem] font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 shadow-lg hover:bg-[#e08635] transition-all">
                    <Plus size={16}/> Novo Banner
                 </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {destaquesHome.map(destaque => (
                    <div key={destaque.id} className="bg-white rounded-[1.5rem] overflow-hidden shadow-xl border border-white flex flex-col group relative">
                       <div className="aspect-video relative overflow-hidden">
                          <img src={destaque.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={destaque.titulo} />
                          <div className={`absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[8px] font-black uppercase shadow-sm ${destaque.corDestaque}`}>
                             {destaque.tipo}
                          </div>
                       </div>
                       <div className="p-6 flex-1 flex flex-col">
                          <h3 className="font-black text-sm uppercase text-[#394158] leading-tight mb-2 line-clamp-1">{destaque.titulo}</h3>
                          <p className="text-[10px] font-bold text-gray-400 uppercase leading-relaxed line-clamp-2 italic">"{destaque.subtitulo}"</p>
                          <div className="mt-auto pt-4 flex justify-between items-center">
                             <span className="text-[9px] font-black uppercase text-gray-400">Link p/ Blog ID: {destaque.blogId || 'Nenhum'}</span>
                             <div className="flex gap-2">
                                <button onClick={() => { setFormDestaque(destaque); setModalDestaque(true); }} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F5F2ED] text-[#394158] hover:bg-[#f9943b] hover:text-white transition-colors"><Edit2 size={12}/></button>
                                <button onClick={() => handleApagarDestaque(destaque.id)} className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={12}/></button>
                             </div>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
            </div>
          )}

          {/* ALIMENTAR BLOG (NOTÍCIAS) */}
          {abaAtiva === 'noticias' && (
            <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-8 rounded-[1rem] border border-gray-100 gap-4 shadow-sm">
                  <div>
                    <h2 className="text-xl font-black uppercase italic tracking-tighter text-[#394158]">Alimentar Notícias</h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Publique novidades e dicas para os usuários</p>
                 </div>
                 <button onClick={() => { setFormNoticia({ id: null, titulo: '', subtitulo: '', imagem: '', descricao: '', citacao: '', tempo: '3 min', categoria: 'NOTÍCIA' }); setModalNoticia(true); }} className="w-full sm:w-auto bg-[#55833d] text-white px-8 py-4 rounded-[1rem] font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 shadow-lg hover:bg-[#436b2f] transition-all">
                    <Plus size={16}/> Nova Publicação
                 </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {noticiasGlobais.map(noticia => (
                    <div key={noticia.id} className="bg-white rounded-[1.5rem] overflow-hidden shadow-xl border border-white flex flex-col group relative">
                       <div className="aspect-video relative overflow-hidden">
                          <img src={noticia.imagem} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          {/* Tag de categoria visual nos cards do painel */}
                          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[8px] font-black uppercase text-[#55833d] shadow-sm flex items-center gap-1">
                             <Tag size={10} /> {noticia.categoria}
                          </div>
                       </div>
                       <div className="p-6 flex-1 flex flex-col">
                          <h3 className="font-black text-sm uppercase text-[#394158] leading-tight mb-2 line-clamp-1">{noticia.titulo}</h3>
                          <p className="text-[10px] font-bold text-gray-400 uppercase leading-relaxed line-clamp-3 italic">"{noticia.subtitulo}"</p>
                          <div className="mt-auto pt-6 flex justify-between items-center border-t border-gray-50">
                             <div className="flex items-center gap-2 text-gray-300"><Clock size={12}/> <span className="text-[9px] font-bold uppercase">{noticia.tempoLeitura}</span></div>
                             <div className="flex items-center gap-1">
                                <button 
                                   onClick={() => handleEditarNoticia(noticia)} 
                                   className="p-2 text-gray-300 hover:text-[#f9943b] transition-colors cursor-pointer"
                                >
                                   <Edit2 size={16}/>
                                </button>
                                <button 
                                   onClick={() => setConfirmarExclusao({ aberto: true, id: noticia.id })} 
                                   className="p-2 text-gray-300 hover:text-red-500 transition-colors cursor-pointer"
                                >
                                   <Trash2 size={16}/>
                                </button>
                             </div>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
            </div>
          )}

          {/* ALIMENTAR RECEITAS */}
          {abaAtiva === 'receitas' && (
            <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-8 rounded-[1rem] border border-gray-100 gap-4 shadow-sm">
                 <div>
                    <h2 className="text-xl font-black uppercase italic tracking-tighter text-[#394158]">Alimentar Receitas</h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Ensine a utilizar os produtos da nossa terra</p>
                 </div>
                 <button onClick={() => setModalReceita(true)} className="w-full sm:w-auto bg-[#f9943b] text-white px-8 py-4 rounded-[1rem] font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 shadow-lg hover:bg-[#e88127] transition-all">
                    <Plus size={16}/> Nova Receita
                 </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {receitasGlobais.map(receita => (
                    <div key={receita.id} className="bg-white rounded-[1.5rem] overflow-hidden shadow-xl border border-white flex flex-col group relative">
                       <div className="aspect-square relative overflow-hidden">
                          <img src={receita.imagem} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[8px] font-black uppercase text-[#f9943b] flex items-center gap-1 shadow-sm">
                             <ChefHat size={10}/> Receita Oficial
                          </div>
                       </div>
                       <div className="p-6 flex-1 flex flex-col">
                          <h3 className="font-black text-sm uppercase text-[#394158] leading-tight mb-2 line-clamp-2">{receita.titulo}</h3>
                          <p className="text-[10px] font-bold text-gray-400 leading-relaxed line-clamp-2">{receita.descricao}</p>
                          <div className="mt-auto pt-6 flex justify-between items-center border-t border-gray-50">
                             <div className="flex gap-4">
                                <div className="flex items-center gap-1 text-gray-400"><Clock size={12}/> <span className="text-[9px] font-bold uppercase">{receita.tempo}</span></div>
                                <div className="flex items-center gap-1 text-gray-400"><Utensils size={12}/> <span className="text-[9px] font-bold uppercase">{receita.porcoes}</span></div>
                             </div>
                             <button onClick={() => setReceitasGlobais(receitasGlobais.filter(r => r.id !== receita.id))} className="p-2 text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MODAL CONFIRMAÇÃO DE EXCLUSÃO */}
      {confirmarExclusao.aberto && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#1a1f2e]/60 backdrop-blur-sm" onClick={() => setConfirmarExclusao({ aberto: false, id: null })}></div>
          <div className="relative bg-white w-full max-w-sm rounded-[1.5rem] p-8 shadow-2xl text-center animate-in zoom-in-95">
             <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={32} />
             </div>
             <h3 className="text-lg font-black uppercase italic text-[#394158] mb-2">Tem certeza?</h3>
             <p className="text-sm text-gray-500 mb-8 leading-relaxed">Essa notícia será removida permanentemente do painel e do blog oficial.</p>
             <div className="flex gap-3">
                <button 
                   onClick={() => setConfirmarExclusao({ aberto: false, id: null })}
                   className="flex-1 py-4 bg-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-all"
                >
                   Não, cancelar
                </button>
                <button 
                   onClick={() => confirmarExclusao.id && handleApagarNoticia(confirmarExclusao.id)}
                   className="flex-1 py-4 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all"
                >
                   Sim, apagar
                </button>
             </div>
          </div>
        </div>
      )}

      {/* MODAL NOVA NOTÍCIA COM CAMPO DE CATEGORIA */}
      {modalNoticia && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#1a1f2e]/90 backdrop-blur-md" onClick={() => setModalNoticia(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[1.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95">
            <header className="p-6 border-b flex justify-between items-center bg-[#F5F2ED]"><h3 className="font-black uppercase italic tracking-widest text-[#394158]">Alimentar Blog</h3><button onClick={() => { setFormNoticia({ id: null, titulo: '', subtitulo: '', imagem: '', descricao: '', citacao: '', tempo: '3 min', categoria: 'NOTÍCIA' }); setModalNoticia(false); }} className="p-2 hover:bg-white rounded-full"><X size={24}/></button></header>
            <div className="p-8 space-y-6 max-h-[75vh] overflow-y-auto no-scrollbar">
               <div className="grid grid-cols-1 gap-5">
                  
                  {/* CAMPO: PRA QUAL CATEGORIA ESTA NOTICIA VAI (NOVO) */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-[#55833d] tracking-widest ml-2">Pra qual categoria esta notícia vai?</label>
                    <select 
                      value={formNoticia.categoria} 
                      onChange={e => setFormNoticia({...formNoticia, categoria: e.target.value})}
                      className="w-full p-4 bg-[#F5F2ED]/50 text-[#394158] font-bold rounded-[1rem] outline-none border-2 border-transparent focus:border-[#f9943b] appearance-none"
                    >
                      <option value="TECNOLOGIA">TECNOLOGIA</option>
                      <option value="SUSTENTABILIDADE">SUSTENTABILIDADE</option>
                      <option value="INOVAÇÃO">INOVAÇÃO</option>
                      <option value="MANEJO">MANEJO</option>
                      <option value="PRODUTOR">PRODUTOR</option>
                      <option value="MERCADO">MERCADO</option>
                      <option value="NOTÍCIA">NOTÍCIA GERAL</option>
                    </select>
                  </div>

                  <div className="space-y-1"><label className="text-[10px] font-black uppercase text-[#55833d] tracking-widest ml-2">Título da Notícia</label><input type="text" value={formNoticia.titulo} onChange={e => setFormNoticia({...formNoticia, titulo: e.target.value})} placeholder="Ex: Manejo Inteligente no Sertão" className="w-full p-4 bg-[#F5F2ED]/50 text-[#394158] font-bold rounded-[1rem] outline-none border-2 border-transparent focus:border-[#f9943b]" /></div>
                  <div className="space-y-1"><label className="text-[10px] font-black uppercase text-[#55833d] tracking-widest ml-2">Subtítulo ou Chamada</label><input type="text" value={formNoticia.subtitulo} onChange={e => setFormNoticia({...formNoticia, subtitulo: e.target.value})} placeholder="Ex: Técnicas que ajudam a economizar água..." className="w-full p-4 bg-[#F5F2ED]/50 text-[#394158] font-medium rounded-[1rem] outline-none border-2 border-transparent focus:border-[#f9943b]" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1"><label className="text-[10px] font-black uppercase text-[#55833d] tracking-widest ml-2">Tempo de Leitura</label><input type="text" value={formNoticia.tempo} onChange={e => setFormNoticia({...formNoticia, tempo: e.target.value})} placeholder="Ex: 5 min" className="w-full p-4 bg-[#F5F2ED]/50 text-[#394158] font-bold rounded-[1rem] outline-none border-2 border-transparent focus:border-[#f9943b]" /></div>
                    <div className="space-y-1"><label className="text-[10px] font-black uppercase text-[#55833d] tracking-widest ml-2">Imagem de Capa</label><label className="w-full p-4 bg-[#F5F2ED]/50 text-gray-400 font-bold rounded-[1rem] border-2 border-dashed border-gray-200 hover:border-[#f9943b] flex items-center justify-center gap-2 cursor-pointer truncate"><ImageIcon size={18}/> {formNoticia.imagem ? 'Imagem Selecionada' : 'Escolher Foto'}<input type="file" className="hidden" onChange={handleNoticiaImage} accept="image/*" /></label></div>
                  </div>
                  <div className="space-y-1"><label className="text-[10px] font-black uppercase text-[#55833d] tracking-widest ml-2">Descrição Completa</label><textarea rows={4} value={formNoticia.descricao} onChange={e => setFormNoticia({...formNoticia, descricao: e.target.value})} placeholder="Escreva aqui o conteúdo da notícia..." className="w-full p-4 bg-[#F5F2ED]/50 text-[#394158] font-medium rounded-[1rem] outline-none border-2 border-transparent focus:border-[#f9943b] resize-none" /></div>
                  <div className="space-y-1"><label className="text-[10px] font-black uppercase text-[#f9943b] tracking-widest ml-2 flex items-center gap-2"><Quote size={12}/> Adicionar Frase de Impacto (Citação)</label><textarea rows={2} value={formNoticia.citacao} onChange={e => setFormNoticia({...formNoticia, citacao: e.target.value})} placeholder="Uma frase que aparecerá no card colorido..." className="w-full p-4 bg-[#f9943b]/5 text-[#394158] font-medium italic rounded-[1rem] outline-none border-2 border-transparent focus:border-[#f9943b] resize-none" /></div>
               </div>
               <button onClick={salvarNoticia} className="w-full py-5 bg-[#55833d] text-white rounded-[1rem] font-black uppercase text-xs tracking-widest shadow-xl hover:bg-[#436b2f] active:scale-95 transition-all flex justify-center items-center gap-3"><CheckCircle size={18} /> Publicar no Blog</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NOVA RECEITA */}
      {modalReceita && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#1a1f2e]/90 backdrop-blur-md" onClick={() => setModalReceita(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[1.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95">
            <header className="p-6 border-b flex justify-between items-center bg-[#F5F2ED]"><h3 className="font-black uppercase italic tracking-widest text-[#394158]">Alimentar Receitas</h3><button onClick={() => setModalReceita(false)} className="p-2 hover:bg-white rounded-full"><X size={24}/></button></header>
            <div className="p-8 space-y-6 max-h-[75vh] overflow-y-auto no-scrollbar">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="col-span-2 space-y-1"><label className="text-[10px] font-black uppercase text-[#f9943b] tracking-widest ml-2">Título da Receita</label><input type="text" value={formReceita.titulo} onChange={e => setFormReceita({...formReceita, titulo: e.target.value})} placeholder="Ex: Baião de Dois Especial" className="w-full p-4 bg-[#F5F2ED]/50 text-[#394158] font-bold rounded-[1rem] outline-none border-2 border-transparent focus:border-[#f9943b]" /></div>
                  <div className="space-y-1"><label className="text-[10px] font-black uppercase text-[#f9943b] tracking-widest ml-2">Tempo (Min/Horas)</label><input type="text" value={formReceita.tempo} onChange={e => setFormReceita({...formReceita, tempo: e.target.value})} placeholder="Ex: 40 min" className="w-full p-4 bg-[#F5F2ED]/50 text-[#394158] font-medium rounded-[1rem] outline-none border-2 border-transparent focus:border-[#f9943b]" /></div>
                  <div className="space-y-1"><label className="text-[10px] font-black uppercase text-[#f9943b] tracking-widest ml-2">Rendimento</label><input type="text" value={formReceita.porcoes} onChange={e => setFormReceita({...formReceita, porcoes: e.target.value})} placeholder="Ex: 4 porções" className="w-full p-4 bg-[#F5F2ED]/50 text-[#394158] font-medium rounded-[1rem] outline-none border-2 border-transparent focus:border-[#f9943b]" /></div>
                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-black uppercase text-[#f9943b] tracking-widest ml-2">Nível de Dificuldade</label>
                    <select value={formReceita.dificuldade} onChange={e => setFormReceita({...formReceita, dificuldade: e.target.value})} className="w-full p-4 bg-[#F5F2ED]/50 text-[#394158] font-medium rounded-[1rem] outline-none border-2 border-transparent focus:border-[#f9943b] appearance-none">
                      <option value="Fácil">Fácil</option>
                      <option value="Média">Média</option>
                      <option value="Difícil">Difícil</option>
                    </select>
                  </div>
                  
                  <div className="col-span-2 space-y-1"><label className="text-[10px] font-black uppercase text-[#f9943b] tracking-widest ml-2">Foto do Prato Pronto</label><label className="w-full p-4 bg-[#F5F2ED]/50 text-gray-400 font-bold rounded-[1rem] border-2 border-dashed border-gray-200 hover:border-[#f9943b] flex items-center justify-center gap-2 cursor-pointer truncate"><ImageIcon size={18}/> {formReceita.imagem ? 'Imagem Selecionada' : 'Escolher Foto'}<input type="file" className="hidden" onChange={handleReceitaImage} accept="image/*" /></label></div>
                  <div className="col-span-2 space-y-1"><label className="text-[10px] font-black uppercase text-[#f9943b] tracking-widest ml-2">Breve Descrição</label><textarea rows={2} value={formReceita.descricao} onChange={e => setFormReceita({...formReceita, descricao: e.target.value})} placeholder="Um textinho chamativo sobre o sabor..." className="w-full p-4 bg-[#F5F2ED]/50 text-[#394158] font-medium rounded-[1rem] outline-none border-2 border-transparent focus:border-[#f9943b] resize-none" /></div>
                  
                  <div className="col-span-2 space-y-1">
                     <label className="text-[10px] font-black uppercase text-[#55833d] tracking-widest ml-2 flex items-center gap-2"><ShoppingCart size={12}/> Ingredientes Mágicos (Um por linha)</label>
                     <p className="text-[9px] text-gray-400 ml-2 mb-2 italic">Digite um ingrediente por linha. Isso virará um botão de compra na tela do cliente!</p>
                     <textarea rows={4} value={formReceita.ingredientes} onChange={e => setFormReceita({...formReceita, ingredientes: e.target.value})} placeholder="Ex:&#10;500g de Feijão Verde&#10;300g de Queijo Coalho&#10;1 maço de Coentro" className="w-full p-4 bg-[#55833d]/5 text-[#394158] font-medium rounded-[1rem] outline-none border-2 border-transparent focus:border-[#55833d] resize-none leading-loose" />
                  </div>

                  <div className="col-span-2 space-y-1">
                     <label className="text-[10px] font-black uppercase text-[#394158] tracking-widest ml-2">Modo de Preparo</label>
                     <textarea rows={5} value={formReceita.preparo} onChange={e => setFormReceita({...formReceita, preparo: e.target.value})} placeholder="Passo 1: Ferva a água...&#10;Passo 2: Misture..." className="w-full p-4 bg-[#F5F2ED]/50 text-[#394158] font-medium rounded-[1rem] outline-none border-2 border-transparent focus:border-[#f9943b] resize-none" />
                  </div>
               </div>
               <button onClick={salvarReceita} className="w-full py-5 bg-gradient-to-r from-[#f9943b] to-[#e88127] text-white rounded-[1rem] font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all flex justify-center items-center gap-3"><CheckCircle size={18} /> Publicar Receita</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NOVO DESTAQUE HOME */}
      {modalDestaque && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#1a1f2e]/90 backdrop-blur-md" onClick={() => setModalDestaque(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[1.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95">
            <header className="p-6 border-b flex justify-between items-center bg-[#F5F2ED]">
              <h3 className="font-black uppercase italic tracking-widest text-[#394158]">Banner da Home</h3>
              <button onClick={() => setModalDestaque(false)} className="p-2 hover:bg-white rounded-full"><X size={24}/></button>
            </header>
            <div className="p-8 space-y-6 max-h-[75vh] overflow-y-auto no-scrollbar">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-[#f9943b] tracking-widest ml-2">Tag do Banner</label>
                    <input type="text" value={formDestaque.tipo} onChange={e => setFormDestaque({...formDestaque, tipo: e.target.value})} placeholder="Ex: SAFRA DO MÊS" className="w-full p-4 bg-[#F5F2ED]/50 text-[#394158] font-bold rounded-[1rem] outline-none border-2 border-transparent focus:border-[#f9943b]" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-[#f9943b] tracking-widest ml-2">Cor da Tag</label>
                    <select value={formDestaque.corDestaque} onChange={e => setFormDestaque({...formDestaque, corDestaque: e.target.value})} className="w-full p-4 bg-[#F5F2ED]/50 text-[#394158] font-bold rounded-[1rem] outline-none border-2 border-transparent focus:border-[#f9943b] appearance-none">
                      <option value="text-[#f9943b]">Laranja (Site)</option>
                      <option value="text-[#55833d]">Verde (Site)</option>
                      <option value="text-[#C4D663]">Verde Limão</option>
                      <option value="text-blue-400">Azul</option>
                      <option value="text-red-400">Vermelho</option>
                    </select>
                  </div>

                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-black uppercase text-[#f9943b] tracking-widest ml-2">Título Grande</label>
                    <input type="text" value={formDestaque.titulo} onChange={e => setFormDestaque({...formDestaque, titulo: e.target.value})} placeholder="Ex: A melhor época para comprar manga" className="w-full p-4 bg-[#F5F2ED]/50 text-[#394158] font-black text-xl italic rounded-[1rem] outline-none border-2 border-transparent focus:border-[#f9943b]" />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-black uppercase text-[#f9943b] tracking-widest ml-2">Subtítulo (Opcional)</label>
                    <input type="text" value={formDestaque.subtitulo} onChange={e => setFormDestaque({...formDestaque, subtitulo: e.target.value})} placeholder="Ex: Produtos frescos e com preços..." className="w-full p-4 bg-[#F5F2ED]/50 text-[#394158] font-medium rounded-[1rem] outline-none border-2 border-transparent focus:border-[#f9943b]" />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-[#f9943b] tracking-widest ml-2">Imagem de Fundo (Alta Q.)</label>
                    <label className="w-full p-4 bg-[#F5F2ED]/50 text-gray-400 font-bold rounded-[1rem] border-2 border-dashed border-gray-200 hover:border-[#f9943b] flex items-center justify-center gap-2 cursor-pointer truncate">
                      <ImageIcon size={18}/> {formDestaque.img ? 'Imagem Selecionada' : 'Escolher Foto'}
                      <input type="file" className="hidden" onChange={handleDestaqueImage} accept="image/*" />
                    </label>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-[#f9943b] tracking-widest ml-2">Link p/ Notícia (Blog ID)</label>
                    <select value={formDestaque.blogId} onChange={e => setFormDestaque({...formDestaque, blogId: e.target.value})} className="w-full p-4 bg-[#F5F2ED]/50 text-[#394158] font-bold rounded-[1rem] outline-none border-2 border-transparent focus:border-[#f9943b] appearance-none">
                       <option value="">Nenhuma notícia (Apenas Banner)</option>
                       {noticiasGlobais.map(n => (
                          <option key={n.id} value={n.id}>{n.titulo}</option>
                       ))}
                    </select>
                  </div>
               </div>
               <button onClick={salvarDestaque} className="w-full py-5 bg-[#f9943b] text-white rounded-[1rem] font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all flex justify-center items-center gap-3"><CheckCircle size={18} /> Salvar Banner</button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER MOBILE */}
      <footer className="md:hidden bg-white border-t p-6 text-center"><span className="text-[8px] font-black uppercase text-gray-300">© 2026 Admin — Rede Nordeste</span></footer>
    </div>
  );
}