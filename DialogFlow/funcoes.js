export function formatarPreco(valor) {
  if (typeof valor !== "number") {
    return valor;
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

export function montarCatalogo(listaProdutos) {
  if (!Array.isArray(listaProdutos) || listaProdutos.length === 0) {
    return "No momento estamos sem produtos no catalogo.";
  }

  const itens = listaProdutos.map((produto, indice) => {
    const preco = formatarPreco(produto.preco);
    const descricao = produto.descricao ? ` (${produto.descricao})` : "";
    return `${indice + 1}) ${produto.nome} - ${preco}${descricao}`;
  });

  return `Aqui esta nosso catalogo: ${itens.join("; ")}.`;
}

export function montarCards(listaProdutos) {
  if (!Array.isArray(listaProdutos) || listaProdutos.length === 0) {
    return [];
  }

  return listaProdutos
    .filter((produto) => Boolean(produto.imagem))
    .map((produto) => {
      const preco = formatarPreco(produto.preco);
      const descricao = produto.descricao ? ` - ${produto.descricao}` : "";

      return {
        card: {
          title: produto.nome,
          subtitle: `${preco}${descricao}`,
          imageUri: produto.imagem,
        },
      };
    });
}

export function montarRichContent(listaProdutos) {
  if (!Array.isArray(listaProdutos) || listaProdutos.length === 0) {
    return [];
  }

  const itens = listaProdutos
    .filter((produto) => Boolean(produto.imagem))
    .map((produto) => {
      const preco = formatarPreco(produto.preco);
      const descricao = produto.descricao ? ` - ${produto.descricao}` : "";

      return {
        type: "info",
        title: produto.nome,
        subtitle: `${preco}${descricao}`,
        image: {
          src: {
            rawUrl: produto.imagem,
          },
        },
      };
    });

  if (itens.length === 0) {
    return [];
  }

  return [
    {
      payload: {
        richContent: [itens],
      },
    },
  ];
}

export function montarResumoPedido(itensPedido) {
  if (!Array.isArray(itensPedido) || itensPedido.length === 0) {
    return "Nenhum item no pedido.";
  }

  const linhas = itensPedido.map((item) => {
    const preco = formatarPreco(item.preco);
    const tamanho = item.tamanho ? ` tam ${item.tamanho}` : "";
    const cor = item.cor ? ` cor ${item.cor}` : "";
    return `${item.quantidade}x ${item.nome}${tamanho}${cor} - ${preco}`;
  });

  return `Resumo do pedido: ${linhas.join("; ")}.`;
}
