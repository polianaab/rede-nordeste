#  Semeia Nordeste

**Semeia Nordeste** é uma plataforma digital que conecta produtores rurais e empreendedores locais a consumidores e pequenos comerciantes, promovendo a venda direta de produtos regionais e fortalecendo a economia local.

A aplicação busca reduzir a dependência de intermediários (atravessadores), melhorar a renda dos produtores e facilitar o acesso da população a produtos frescos, artesanais e de origem conhecida.

---

# 📌 Problema

Pequenos produtores rurais frequentemente enfrentam:

* isolamento comercial
* dificuldade de escoar sua produção
* dependência de atravessadores
* perda de alimentos perecíveis
* baixa visibilidade no mercado

Ao mesmo tempo, consumidores têm dificuldade em encontrar **produtos locais frescos e de origem confiável**.

---

# 💡 Solução

O **Semeia Nordeste** oferece um marketplace digital simples e acessível que permite:

* produtores cadastrarem seus produtos rapidamente
* consumidores encontrarem alimentos e produtos locais
* negociação direta entre produtor e comprador
* compras seguras dentro da plataforma
* escolha entre **entrega ou retirada**

A plataforma foi projetada com foco em:

* **interface simples**
* **acessibilidade para usuários com pouca familiaridade tecnológica**

---

# 👥 Público-Alvo

### Produtores

* agricultores familiares
* produtores
* artesãos
* pequenos empreendedores locais

### Compradores

* famílias
* donos de mercearias
* restaurantes
* lojas de produtos artesanais
* consumidores interessados em produtos locais

---

# 🚀 Funcionalidades Principais

### 👤 Gestão de Usuários

* cadastro de produtores e consumidores
* autenticação segura
* perfil do usuário

### 🏪 Loja do Produtor

* criação de loja dentro da plataforma
* cadastro de produtos
* gerenciamento de estoque

### 🛒 Marketplace

* busca por produtos
* filtro por categoria
* filtro por município
* visualização de lojas próximas

### 📦 Carrinho e Pedido

* adição de produtos ao carrinho
* pedidos por loja
* cálculo automático do valor total

### 💳 Pagamento

* integração com pagamentos digitais
* confirmação de pagamento

### 🚚 Logística

* escolha entre:

  * entrega
  * retirada no local

### 💬 Chat

* comunicação direta entre comprador e produtor
* negociação dentro da plataforma

---

# 🏗 Arquitetura do Projeto

O sistema segue uma arquitetura baseada em **API REST**, separando frontend e backend.

```
Frontend (React)
        │
        │ HTTP API
        ▼
Backend (Spring Boot)
        │
        ▼
Banco de Dados / Serviços
```

---

# 🧰 Tecnologias Utilizadas

## Backend

* Java 17
* Spring Boot 3
* Spring Security
* Spring Data JPA
* Jackson

## Frontend

* React
* TypeScript
* Vite

## Banco de Dados

* Supabase

## Controle de Versão

* Git
* GitHub

---

# 🗂 Estrutura do Projeto

```
semeia-nordeste
│
├── backend
│   ├── controller
│   ├── service
│   ├── repository
│   ├── model
│   └── security
│
├── frontend
│   ├── components
│   ├── pages
│   ├── services
│   └── context
│
├── docs
│   ├── arquitetura
│   ├── banco-de-dados
│   └── backlog
│
└── README.md
```

---

# 🔐 Segurança

A aplicação utiliza:

* autenticação baseada em **JWT**
* criptografia de senhas
* proteção de endpoints com **Spring Security**

---

# 📊 Modelo de Dados

Principais entidades do sistema:

* Usuário
* Loja
* Produto
* Categoria
* Carrinho
* Pedido
* Pagamento
* Entrega
* Chat
* Mensagem

---

# 📦 Como Executar o Projeto

## Backend

```bash
cd backend
mvn spring-boot:run
```

Backend disponível em:

```
http://localhost:8080
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend disponível em:

```
http://localhost:5173
```

---

# 🌍 Impacto Esperado

O **Semeia Nordeste** pretende:

* fortalecer a economia local
* aumentar a renda de pequenos produtores
* reduzir desperdício de alimentos
* aproximar consumidores da produção regional

---

## 📄 Licença

Este projeto está licenciado sob a licença MIT.

Copyright (c) 2026 Equipe Semeia Nordeste.
---

# ✍️ Autor

Projeto desenvolvido como parte de estudo e desenvolvimento de solução digital para apoio à economia local e agricultura familiar.
