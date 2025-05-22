# Teste Rápido Montink - Loja de Camisetas

## 📋 Sobre o Projeto

Este é um projeto de e-commerce para venda de camisetas, desenvolvido com React, TypeScript e Tailwind CSS. A aplicação permite que os usuários visualizem produtos, escolham diferentes cores e tamanhos, adicionem itens ao carrinho e verifiquem disponibilidade de entrega.

## ✨ Funcionalidades

- **Visualização de produtos** com múltiplas imagens
- **Seleção de variantes** (cores e tamanhos)
- **Carrinho de compras** com persistência local
- **Verificação de disponibilidade** de entrega por CEP
- **Armazenamento local** das seleções do usuário e itens do carrinho

## 🛠️ Tecnologias Utilizadas

- **React 19** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Superset tipado de JavaScript
- **Tailwind CSS 4** - Framework CSS utilitário
- **Vite** - Ferramenta de build rápida para desenvolvimento web

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Node.js (versão recomendada: 18+)
- npm ou yarn

### Instalação

1. Clone o repositório

   ```bash
   git clone [url-do-repositorio]
   ```

2. Acesse a pasta do projeto

   ```bash
   cd teste-rapido-montink
   ```

3. Instale as dependências

   ```bash
   npm install
   # ou
   yarn
   ```

4. Execute o projeto em modo de desenvolvimento

   ```bash
   npm run dev
   # ou
   yarn dev
   ```

5. Acesse `http://localhost:5173` no seu navegador

## 📦 Estrutura do Projeto

```
teste-rapido-montink/
├── public/             # Arquivos públicos
├── src/                # Código fonte
│   ├── assets/         # Recursos estáticos
│   ├── components/     # Componentes React
│   │   ├── CartModal.tsx       # Modal do carrinho
│   │   ├── DeliveryCheck.tsx   # Verificação de entrega
│   │   ├── ProductImages.tsx   # Galeria de imagens
│   │   └── ProductPage.tsx     # Página principal do produto
│   ├── App.tsx         # Componente principal
│   └── main.tsx        # Ponto de entrada
├── package.json        # Dependências e scripts
└── README.md           # Documentação
```

## 🔄 Recursos Implementados

- **Persistência de dados**: As seleções do usuário (cor e tamanho) são salvas no localStorage por 15 minutos
- **Carrinho persistente**: Os itens do carrinho são salvos no localStorage por 30 minutos
- **Interface responsiva**: Design adaptável para diferentes tamanhos de tela
- **Experiência de usuário aprimorada**: Feedback visual para seleções e ações

## 👥 Autor

Pedro Alencar - pedroalencar.ssr@gmail.com

---

Desenvolvido como parte de um teste para a Montink.
