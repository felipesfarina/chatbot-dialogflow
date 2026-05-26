import obterConexao from "./conexao.js";

export default class PedidoDB {
  async obterAberto(sessionId) {
    const conexao = await obterConexao();
    const sql =
      "SELECT id, session_id, endereco, pagamento, status FROM pedido WHERE session_id = ? AND status = 'aberto' LIMIT 1";
    const [resultado] = await conexao.query(sql, [sessionId]);

    if (resultado.length === 0) {
      return null;
    }

    return resultado[0];
  }

  async obterOuCriar(sessionId) {
    const conexao = await obterConexao();
    const sqlBusca =
      "SELECT id, session_id, endereco, pagamento, status FROM pedido WHERE session_id = ? AND status = 'aberto' LIMIT 1";
    const [resultado] = await conexao.query(sqlBusca, [sessionId]);

    if (resultado.length > 0) {
      return resultado[0];
    }

    const sqlInsere =
      "INSERT INTO pedido (session_id, status, data_criacao) VALUES (?, 'aberto', NOW())";
    const [insertResult] = await conexao.query(sqlInsere, [sessionId]);

    return {
      id: insertResult.insertId,
      session_id: sessionId,
      endereco: null,
      pagamento: null,
      status: "aberto",
    };
  }

  async adicionarItem(pedidoId, produtoId, tamanho, cor, quantidade) {
    const conexao = await obterConexao();
    const sql =
      "INSERT INTO item_pedido (pedido_id, produto_id, tamanho, cor, quantidade) VALUES (?, ?, ?, ?, ?)";
    await conexao.query(sql, [
      pedidoId,
      produtoId,
      tamanho,
      cor,
      quantidade,
    ]);
  }

  async atualizarEndereco(pedidoId, endereco) {
    const conexao = await obterConexao();
    const sql = "UPDATE pedido SET endereco = ? WHERE id = ?";
    await conexao.query(sql, [endereco, pedidoId]);
  }

  async atualizarPagamento(pedidoId, pagamento) {
    const conexao = await obterConexao();
    const sql = "UPDATE pedido SET pagamento = ? WHERE id = ?";
    await conexao.query(sql, [pagamento, pedidoId]);
  }

  async confirmar(pedidoId) {
    const conexao = await obterConexao();
    const sql = "UPDATE pedido SET status = 'confirmado' WHERE id = ?";
    await conexao.query(sql, [pedidoId]);
  }

  async obterResumo(pedidoId) {
    const conexao = await obterConexao();
    const sql =
      "SELECT i.id, i.tamanho, i.cor, i.quantidade, p.nome, p.preco FROM item_pedido i INNER JOIN produto p ON p.codigo = i.produto_id WHERE i.pedido_id = ?";
    const [resultados] = await conexao.query(sql, [pedidoId]);
    return resultados;
  }
}
