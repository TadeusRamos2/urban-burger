
/* =========================================
   URBAN BURGER
   SISTEMA DE CARDÁPIO E CARRINHO
========================================= */

// CONFIGURAÇÕES DO RESTAURANTE

// Coloque o número real com 55 + DDD + número.
// Exemplo de formato: 5548999999999
// Deixe vazio enquanto estiver testando.

const whatsapp = "5548996067450";

// PRODUTOS DO CARDÁPIO

const produtos = [
  {
    nome: "Urban Classic",
    descricao: "Hambúrguer artesanal, queijo, alface e molho especial.",
    preco: 29.90,
    categoria: "burger",
    imagem: "assets/images/classic.jpg"
  },
  {
    nome: "Urban Bacon",
    descricao: "Hambúrguer artesanal, cheddar e bacon crocante.",
    preco: 36.90,
    categoria: "burger",
    imagem: "assets/images/bacon.jpg"
  },
  {
    nome: "Urban Duplo",
    descricao: "Dois hambúrgueres, queijo duplo e molho especial.",
    preco: 42.90,
    categoria: "burger",
    imagem: "assets/images/duplo.jpg"
  },
  {
    nome: "Batata Frita",
    descricao: "Porção de batatas crocantes.",
    preco: 18.90,
    categoria: "acompanhamento",
    imagem: "assets/images/batata.jpg"
  },
  {
    nome: "Refrigerante",
    descricao: "Refrigerante em lata de 350 ml.",
    preco: 7.00,
    categoria: "bebida",
    imagem: "assets/images/refrigerante.jpg"
  }
];

// SELEÇÃO DOS ELEMENTOS HTML

const cardapio = document.querySelector("#products");

const botoesFiltro = document.querySelectorAll(".filtro");

const itensCarrinho = document.querySelector("#itens-carrinho");

const totalCarrinho = document.querySelector("#total-carrinho");

const finalizarPedido = document.querySelector("#finalizar-pedido");

// CARRINHO DE COMPRAS

const carrinho = [];

// FORMATAR PREÇOS

function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

// GERAR LINK DO WHATSAPP

function gerarLinkWhatsApp(mensagem) {
  const numero = whatsapp.replace(/\D/g, "");

  if (!/^\d{12,13}$/.test(numero)) {
    return null;
  }

  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}

// MOSTRAR PRODUTOS

function mostrarProdutos(categoria = "todos") {
  if (!cardapio) return;

  cardapio.innerHTML = "";

  const filtrados = categoria === "todos"
    ? produtos
    : produtos.filter(produto => produto.categoria === categoria);

  filtrados.forEach(produto => {

    const card = document.createElement("article");
    card.className = "produto";

    // IMAGEM

    const imagem = document.createElement("img");
    imagem.src = produto.imagem;
    imagem.alt = produto.nome;
    imagem.loading = "lazy";

    // NOME

    const titulo = document.createElement("h3");
    titulo.textContent = produto.nome;

    // DESCRIÇÃO

    const descricao = document.createElement("p");
    descricao.textContent = produto.descricao;

    // PREÇO

    const preco = document.createElement("strong");
    preco.textContent = formatarPreco(produto.preco);

    // BOTÃO WHATSAPP

    const botaoWhatsApp = document.createElement("a");
    botaoWhatsApp.className = "btn";

    const mensagem = `Olá! Gostaria de pedir ${produto.nome}.`;

    const link = gerarLinkWhatsApp(mensagem);

    if (link) {
      botaoWhatsApp.href = link;
      botaoWhatsApp.target = "_blank";
      botaoWhatsApp.rel = "noopener noreferrer";
      botaoWhatsApp.textContent = "Pedir pelo WhatsApp";
    } else {
      botaoWhatsApp.href = "#contato";
      botaoWhatsApp.textContent = "Pedido demonstrativo";
    }

    // BOTÃO ADICIONAR AO CARRINHO

    const botaoCarrinho = document.createElement("button");

    botaoCarrinho.type = "button";
    botaoCarrinho.className = "btn btn-carrinho";
    botaoCarrinho.textContent = "Adicionar ao carrinho";

    botaoCarrinho.addEventListener("click", () => {
      adicionarCarrinho(produto);
    });

    // MONTAR CARD

    card.append(
      imagem,
      titulo,
      descricao,
      preco,
      botaoWhatsApp,
      botaoCarrinho
    );

    // ADICIONAR CARD AO HTML

    cardapio.appendChild(card);

  });
}

// FILTROS DO CARDÁPIO

botoesFiltro.forEach(botao => {

  botao.addEventListener("click", () => {

    botoesFiltro.forEach(item => {
      item.classList.remove("ativo");
      item.setAttribute("aria-pressed", "false");
    });

    botao.classList.add("ativo");
    botao.setAttribute("aria-pressed", "true");

    const categoria = botao.dataset.categoria;

    mostrarProdutos(categoria);

  });

});

// ADICIONAR PRODUTO AO CARRINHO

function adicionarCarrinho(produto) {

  const existente = carrinho.find(
    item => item.nome === produto.nome
  );

  if (existente) {

    existente.quantidade++;

  } else {

    carrinho.push({
      nome: produto.nome,
      preco: produto.preco,
      quantidade: 1
    });

  }

  atualizarCarrinho();
}

// ALTERAR QUANTIDADE

function alterarQuantidade(nome, variacao) {

  const item = carrinho.find(
    produto => produto.nome === nome
  );

  if (!item) return;

  item.quantidade += variacao;

  if (item.quantidade <= 0) {

    const indice = carrinho.indexOf(item);

    carrinho.splice(indice, 1);

  }

  atualizarCarrinho();
}

// CALCULAR TOTAL

function calcularTotal() {

  return carrinho.reduce((soma, item) => {
    return soma + item.preco * item.quantidade;
  }, 0);

}

// ATUALIZAR CARRINHO

function atualizarCarrinho() {

  if (!itensCarrinho || !totalCarrinho || !finalizarPedido) {
    return;
  }

  itensCarrinho.innerHTML = "";

  if (carrinho.length === 0) {

    const mensagemVazio = document.createElement("p");
    mensagemVazio.textContent = "Seu carrinho está vazio.";

    itensCarrinho.appendChild(mensagemVazio);

  }

  carrinho.forEach(item => {

    const linha = document.createElement("div");
    linha.className = "item-carrinho";

    // NOME

    const nome = document.createElement("span");
    nome.textContent = item.nome;

    // CONTROLES

    const controles = document.createElement("div");
    controles.className = "controles-quantidade";

    // DIMINUIR

    const diminuir = document.createElement("button");
    diminuir.type = "button";
    diminuir.textContent = "−";
    diminuir.setAttribute("aria-label", `Diminuir ${item.nome}`);

    diminuir.addEventListener("click", () => {
      alterarQuantidade(item.nome, -1);
    });

    // QUANTIDADE

    const quantidade = document.createElement("span");
    quantidade.textContent = item.quantidade;

    // AUMENTAR

    const aumentar = document.createElement("button");
    aumentar.type = "button";
    aumentar.textContent = "+";
    aumentar.setAttribute("aria-label", `Aumentar ${item.nome}`);

    aumentar.addEventListener("click", () => {
      alterarQuantidade(item.nome, 1);
    });

    // SUBTOTAL

    const subtotal = document.createElement("strong");

    subtotal.textContent = formatarPreco(
      item.preco * item.quantidade
    );

    // MONTAR CONTROLES

    controles.append(
      diminuir,
      quantidade,
      aumentar
    );

    // MONTAR LINHA

    linha.append(
      nome,
      controles,
      subtotal
    );

    itensCarrinho.appendChild(linha);

  });

  // ATUALIZAR TOTAL

  const total = calcularTotal();

  totalCarrinho.textContent = formatarPreco(total);

  finalizarPedido.disabled = carrinho.length === 0;

}

// FINALIZAR PEDIDO PELO WHATSAPP

if (finalizarPedido) {

  finalizarPedido.addEventListener("click", () => {

    if (carrinho.length === 0) {
      return;
    }

    let mensagem = "Olá! Gostaria de fazer o seguinte pedido:\n\n";

    carrinho.forEach(item => {

      const subtotal = item.preco * item.quantidade;

      mensagem += `${item.quantidade}x ${item.nome} - ${formatarPreco(subtotal)}\n`;

    });

    const total = calcularTotal();

    mensagem += `\nTotal: ${formatarPreco(total)}`;

    const link = gerarLinkWhatsApp(mensagem);

    if (!link) {
      alert("Configure um número válido de WhatsApp no script.js.");
      return;
    }

    window.open(link, "_blank", "noopener,noreferrer");

  });

}

// INICIALIZAR O SITE

mostrarProdutos();

atualizarCarrinho();
