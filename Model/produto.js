import ProdutoDB from "../DB/produtoDB.js";

export default class Produto {
  #codigo;
  #nome;
  #descricao;
  #preco;
  #imagem;

  constructor(codigo, nome, descricao, preco, imagem) {
    this.#codigo = codigo;
    this.#nome = nome;
    this.#descricao = descricao;
    this.#preco = preco;
    this.#imagem = imagem;
  }

  get codigo() {
    return this.#codigo;
  }

  get nome() {
    return this.#nome;
  }

  get descricao() {
    return this.#descricao;
  }

  get preco() {
    return this.#preco;
  }

  get imagem() {
    return this.#imagem;
  }

  set codigo(codigo) {
    this.#codigo = codigo;
  }

  set nome(nome) {
    this.#nome = nome;
  }

  set descricao(descricao) {
    this.#descricao = descricao;
  }

  set preco(preco) {
    this.#preco = preco;
  }

  set imagem(imagem) {
    this.#imagem = imagem;
  }

  toJSON() {
    return {
      codigo: this.#codigo,
      nome: this.#nome,
      descricao: this.#descricao,
      preco: this.#preco,
      imagem: this.#imagem,
    };
  }

  async gravar() {}
  async alterar() {}
  async excluir() {}

  async consultar() {
    const produtoDB = new ProdutoDB();
    return await produtoDB.consultar();
  }

  async consultarPorNome(nome) {
    const produtoDB = new ProdutoDB();
    return await produtoDB.consultarPorNome(nome);
  }
}
