import obterConexao from "./conexao.js";
import Produto from "../Model/produto.js";

export default class ProdutoDB {
  async gravar(produto) {}
  async alterar(produto) {}
  async excluir(produto) {}

  async consultar() {
    const conexao = await obterConexao();
    const sql = "SELECT * FROM produto;";
    const [resultados] = await conexao.query(sql);
    const listaProdutos = [];

    for (const resultado of resultados) {
      const produto = new Produto(
        resultado.codigo,
        resultado.nome,
        resultado.descricao,
        resultado.preco,
        resultado.imagem
      );
      listaProdutos.push(produto);
    }

    return listaProdutos;
  }

  async consultarPorNome(nome) {
    const conexao = await obterConexao();
    const sql =
      "SELECT * FROM produto WHERE LOWER(nome) LIKE CONCAT('%', ?, '%') LIMIT 1";
    const [resultados] = await conexao.query(sql, [nome.toLowerCase()]);

    if (resultados.length === 0) {
      return null;
    }

    const resultado = resultados[0];
    return new Produto(
      resultado.codigo,
      resultado.nome,
      resultado.descricao,
      resultado.preco,
      resultado.imagem
    );
  }
}
