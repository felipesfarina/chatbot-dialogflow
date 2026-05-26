import PedidoDB from "../DB/pedidoDB.js";

export default class Pedido {
  #id;
  #sessionId;
  #endereco;
  #pagamento;
  #status;

  constructor(id, sessionId, endereco, pagamento, status) {
    this.#id = id;
    this.#sessionId = sessionId;
    this.#endereco = endereco;
    this.#pagamento = pagamento;
    this.#status = status;
  }

  get id() {
    return this.#id;
  }

  get sessionId() {
    return this.#sessionId;
  }

  get endereco() {
    return this.#endereco;
  }

  get pagamento() {
    return this.#pagamento;
  }

  get status() {
    return this.#status;
  }

  set endereco(endereco) {
    this.#endereco = endereco;
  }

  set pagamento(pagamento) {
    this.#pagamento = pagamento;
  }

  set status(status) {
    this.#status = status;
  }

  async obterOuCriar(sessionId) {
    const pedidoDB = new PedidoDB();
    return await pedidoDB.obterOuCriar(sessionId);
  }

  async atualizarEndereco(pedidoId, endereco) {
    const pedidoDB = new PedidoDB();
    await pedidoDB.atualizarEndereco(pedidoId, endereco);
  }

  async atualizarPagamento(pedidoId, pagamento) {
    const pedidoDB = new PedidoDB();
    await pedidoDB.atualizarPagamento(pedidoId, pagamento);
  }

  async confirmar(pedidoId) {
    const pedidoDB = new PedidoDB();
    await pedidoDB.confirmar(pedidoId);
  }
}
