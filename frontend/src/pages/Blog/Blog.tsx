import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Volume2, Eye, Ear, Tractor, ChevronRight, Leaf, Lightbulb, Store, Droplets, Package } from "lucide-react"; // Importando ícones intuitivos
import "./Blog.css";

export const postsData = [
  {
    id: 0,
    titulo: "Tecnologia na Agricultura",
    subtitulo: "Como a tecnologia está revolucionando o campo.",
    categoria: "TECNOLOGIA",
    imagem: "https://images.pexels.com/photos/34182385/pexels-photo-34182385.jpeg",
    data: "24 de Abril de 2024",
    leitura: "5 min",
    conteudo: `O cenário do agronegócio brasileiro passa por sua maior transformação desde a mecanização. A entrada da Agricultura 4.0 trouxe dispositivos que hoje são protagonistas de uma colheita eficiente.`
  },
  {
    id: 1,
    titulo: "Agricultura Sustentável",
    subtitulo: "Produzir mais sem prejudicar o meio ambiente.",
    categoria: "SUSTENTABILIDADE",
    imagem: "https://images.pexels.com/photos/14776863/pexels-photo-14776863.jpeg",
    data: "22 de Abril de 2024",
    leitura: "4 min",
    conteudo: "A sustentabilidade é o pilar central das fazendas modernas."
  },
  {
    id: 2,
    titulo: "Inovação no Agronegócio",
    subtitulo: "Novas soluções para o futuro da agricultura.",
    categoria: "INOVAÇÃO",
    imagem: "https://images.pexels.com/photos/5622487/pexels-photo-5622487.jpeg",
    data: "20 de Abril de 2024",
    leitura: "6 min",
    conteudo: "Desde sementes geneticamente aprimoradas até a automação total."
  },
  {
    id: 3,
    titulo: "Manejo Inteligente",
    subtitulo: "Práticas modernas para melhorar a produtividade.",
    categoria: "MANEJO",
    imagem: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=800",
    data: "18 de Abril de 2024",
    leitura: "5 min",
    conteudo: "Otimizar o uso de recursos hídricos e fertilizantes é a chave."
  },
  {
    id: 4,
    titulo: "Dados no Campo",
    subtitulo: "Como dados ajudam produtores a tomar decisões.",
    categoria: "DADOS",
    imagem: "https://images.pexels.com/photos/5230983/pexels-photo-5230983.jpeg",
    data: "15 de Abril de 2024",
    leitura: "7 min",
    conteudo: "Big Data e análise preditiva ajudam a prever safras com precisão."
  },
  {
    id: 5,
    titulo: "Histórias de Sucesso",
    subtitulo: "Produtores que estão transformando a realidade.",
    categoria: "PRODUTOR",
    imagem: "https://images.pexels.com/photos/7456796/pexels-photo-7456796.jpeg",
    data: "12 de Abril de 2024",
    leitura: "8 min",
    conteudo: "Conheça trajetórias reais de produtores que triplicaram sua produtividade."
  }
];

export default function Blog() {
  const navigate = useNavigate();
  const [filtroAtivo, setFiltroAtivo] = useState("Todos");
  const [posts, setPosts] = useState<any[]>(postsData);

  useEffect(() => {
    const carregarPosts = () => {
      const salvas = localStorage.getItem('noticias_globais');
      if (salvas) {
        const parseadas = JSON.parse(salvas);
        const adminPosts = parseadas.filter((n: any) => n.id > 10).map((n: any) => ({
          id: n.id,
          titulo: n.titulo,
          subtitulo: n.subtitulo,
          categoria: "NOTÍCIA",
          imagem: n.imagem,
          data: n.data,
          leitura: n.tempoLeitura || '3 min',
          conteudo: n.descricao || '',
          citacao: n.citacao || ''
        }));
        setPosts([...adminPosts, ...postsData]);
      }
    };
    carregarPosts();
    window.addEventListener('storage', carregarPosts);
    
    return () => {
      window.removeEventListener('storage', carregarPosts);
    };
  }, []);

  const categorias = ["Todos", "Tecnologia", "Sustentabilidade", "Inovação", "Mercado", "Notícia"];

  const postsFiltrados = filtroAtivo === "Todos" 
    ? posts 
    : posts.filter(p => p.categoria.toLowerCase() === filtroAtivo.toLowerCase());

  return (
    <div className="blog-container">
      {/* HERO COM VÍDEO EM TELA CHEIA */}
      <header className="video-hero">
        <nav className="blog-nav">
          <div className="nav-container">
            <div className="logo-brand">
              <img src="/assets/logo-sem-fundo.png" alt="Logo" />
            </div>
            <div className="nav-menu">
              <a href="#" onClick={() => navigate("/")}>Início</a>
              <a href="#" className="active" onClick={() => navigate("/blog")}>Blog</a>
            </div>
          </div>
        </nav>

        <video autoPlay loop muted playsInline>
          <source src="/assets/video-blog.mp4" type="video/mp4" />
          Seu navegador não suporta vídeo HTML5.
        </video>

        <div className="video-overlay">
          <h1>NOTÍCIAS REDE NORDESTE</h1>
          <p>Conectando o produtor ao mercado nacional</p>
          <button
            className="hero-read-btn"
            onClick={() =>
              document.getElementById("cards-section")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            VER NOTÍCIAS
          </button>
        </div>
      </header>

      <main className="blog-main">
        <div className="blog-master">
          <div className="filter-group">
            {categorias.map(cat => (
              <button 
                key={cat} 
                className={`filter-item ${filtroAtivo === cat ? "active" : ""}`}
                onClick={() => setFiltroAtivo(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Seção dos cards com ID para scroll */}
          <div id="cards-section" className="blog-grid">
            {postsFiltrados.map((post, index) => (
              <article 
                key={post.id} 
                className="blog-card reveal-card" 
                style={{ animationDelay: `${index * 0.1}s` }} // Delay para efeito de cascata
                onClick={() => navigate(`/blog/${post.id}`)}
              >
                <div className="card-thumb">
                  <img src={post.imagem} alt={post.titulo} />
                </div>
                
                <div className="card-info">
                  <div className="card-header-info">
                    <span className="card-tag">{post.categoria}</span>
                    <span className="card-date">{post.data}</span>
                  </div>
                  
                  <h3>{post.titulo}</h3>
                  <p>{post.subtitulo}</p>
                  
                  <div className="card-footer-icons">
                    <div className="icon-group">
                      <Eye size={16} /> <span>Ver fotos</span>
                    </div>
                    <div className="icon-group">
                      <Ear size={16} /> <span>Ler história</span>
                    </div>
                    <div className="read-more-link">
                       <ChevronRight size={18} />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* INFOGRÁFICO ANIMADO (Tratorzinho) */}
          <div className="infographic-divider">
            <div className="tractor-path">
              <div className="tractor-animation">
                <Tractor size={40} className="tractor-icon" />
                <span className="delivery-text">Levando o melhor do campo até você...</span>
              </div>
            </div>
          </div>

          {/* NOVO: CANTO DO APRENDIZADO (DICAS DE SUSTENTABILIDADE E EMPREENDEDORISMO) */}
          <section className="learning-corner">
            <div className="learning-grid">
              {/* Quadro de Sustentabilidade */}
              <div className="learning-card sustainability">
                <div className="learning-header">
                  <Leaf size={32} className="learning-icon" />
                  <h4>Semeando Sustentabilidade</h4>
                </div>
                <div className="learning-tips">
                  <div className="tip-item">
                    <Droplets size={20} className="tip-icon" />
                    <p><strong>Reuso de Água:</strong> Utilize a água da lavagem de vegetais para regar suas plantas. Elas agradecem os nutrientes!</p>
                  </div>
                  <div className="tip-item">
                    <Package size={20} className="tip-icon" />
                    <p><strong>Embalagem Consciente:</strong> Troque o plástico por papel reciclado ou palha. É melhor para o planeta e valoriza o artesanato.</p>
                  </div>
                </div>
              </div>

              {/* Quadro de Apoio ao Empreendedor */}
              <div className="learning-card entrepreneur">
                <div className="learning-header">
                  <Lightbulb size={32} className="learning-icon" />
                  <h4>Papo de Empreendedora</h4>
                </div>
                <div className="learning-tips">
                  <div className="tip-item">
                    <Eye size={20} className="tip-icon" />
                    <p><strong>Dica de Ouro:</strong> Fotos atraentes vendem mais! Use a luz natural da manhã para fotografar seus pratos ou artesanatos.</p>
                  </div>
                  <div className="tip-item">
                    <Store size={20} className="tip-icon" />
                    <p><strong>Na Feirinha:</strong> Conte a história por trás do seu produto. Pessoas compram experiências e conexão emocional.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          <footer className="footer-banner">
            <p>🍃 Acompanhe nossas atualizações e fique por dentro do agro!</p>
          </footer>
        </div>
      </main>
    </div>
  );
}