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
