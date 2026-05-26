import Produto from "../Model/produto.js";
import PedidoDB from "../DB/pedidoDB.js";
import {
  montarCatalogo,
  montarCards,
  montarRichContent,
  montarResumoPedido,
} from "../DialogFlow/funcoes.js";

export default class DialogflowCtrl {
  async processar(req, resp) {
    if (req.method !== "POST") {
      resp.status(405).json({
        fulfillmentText: "Metodo nao permitido",
      });
      return;
    }

    const intent = req.body?.queryResult?.intent?.displayName || "";
    const parametros = req.body?.queryResult?.parameters || {};
    const sessionId = req.body?.session || "";

    const obterNumero = (valor) => {
      if (Array.isArray(valor)) {
        return valor.length > 0 ? valor[0] : null;
      }
      return valor ?? null;
    };

    try {
      if (intent === "verCatalogo-sim") {
        const produto = new Produto();
        const listaProdutos = await produto.consultar();
        const texto = montarCatalogo(listaProdutos);
        const cards = montarCards(listaProdutos);
        const richContent = montarRichContent(listaProdutos);

        resp.status(200).json({
          fulfillmentText: texto,
          fulfillmentMessages: [
            {
              text: {
                text: [texto],
              },
            },
            ...cards,
            ...richContent,
          ],
        });
        return;
      }

      if (intent === "registrar-pedido") {
        const produtoNome = parametros.produto;
        const cor = parametros.cor || null;
        const tamanho = obterNumero(parametros.number);

        if (!produtoNome) {
          resp.status(200).json({
            fulfillmentText:
              "Qual calcado voce deseja? Temos tenis, bota, sandalia e sapatenis.",
          });
          return;
        }

        if (!tamanho) {
          resp.status(200).json({
            fulfillmentText: "Qual o numero do seu calcado?",
          });
          return;
        }

        const produtoModel = new Produto();
        const produtoEncontrado = await produtoModel.consultarPorNome(produtoNome);

        if (!produtoEncontrado) {
          resp.status(200).json({
            fulfillmentText:
              "Nao encontrei esse produto no catalogo. Pode escolher outro?",
          });
          return;
        }

        const pedidoDB = new PedidoDB();
        const pedido = await pedidoDB.obterOuCriar(sessionId);
        await pedidoDB.adicionarItem(
          pedido.id,
          produtoEncontrado.codigo,
          tamanho,
          cor,
          1
        );

        const resumo = await pedidoDB.obterResumo(pedido.id);
        const resumoTexto = montarResumoPedido(resumo);

        resp.status(200).json({
          fulfillmentText: `${resumoTexto} Deseja adicionar mais algum calcado?`,
        });
        return;
      }

      if (intent === "continuar-comprando-sim") {
        resp.status(200).json({
          fulfillmentText: "Claro! Qual calcado voce deseja adicionar?",
        });
        return;
      }

      if (intent === "continuar-comprando-nao") {
        resp.status(200).json({
          fulfillmentText:
            "Perfeito! Agora me informe o endereco de entrega.",
        });
        return;
      }

      if (intent === "registrar-endereco") {
        const endereco = parametros.location;
        const pedidoDB = new PedidoDB();
        const pedido = await pedidoDB.obterAberto(sessionId);

        if (!pedido) {
          resp.status(200).json({
            fulfillmentText:
              "Nao encontrei um pedido em aberto. Quer escolher um produto?",
          });
          return;
        }

        if (!endereco) {
          resp.status(200).json({
            fulfillmentText: "Qual o endereco de entrega?",
          });
          return;
        }

        await pedidoDB.atualizarEndereco(pedido.id, endereco);
        resp.status(200).json({
          fulfillmentText:
            "Endereco registrado! Qual sera a forma de pagamento?",
        });
        return;
      }

      if (intent === "registrar-pagamento") {
        const pagamento = parametros.pagamento;
        const pedidoDB = new PedidoDB();
        const pedido = await pedidoDB.obterAberto(sessionId);

        if (!pedido) {
          resp.status(200).json({
            fulfillmentText:
              "Nao encontrei um pedido em aberto. Quer escolher um produto?",
          });
          return;
        }

        if (!pagamento) {
          resp.status(200).json({
            fulfillmentText:
              "Qual sera a forma de pagamento? Pix, credito, debito ou dinheiro?",
          });
          return;
        }

        await pedidoDB.atualizarPagamento(pedido.id, pagamento);
        resp.status(200).json({
          fulfillmentText: "Forma de pagamento registrada! Confirma o pedido?",
        });
        return;
      }

      if (intent === "confirmar-pedido-sim") {
        const pedidoDB = new PedidoDB();
        const pedido = await pedidoDB.obterAberto(sessionId);

        if (!pedido) {
          resp.status(200).json({
            fulfillmentText:
              "Nao encontrei um pedido em aberto. Quer escolher um produto?",
          });
          return;
        }

        const itens = await pedidoDB.obterResumo(pedido.id);
        if (itens.length === 0) {
          resp.status(200).json({
            fulfillmentText: "Seu pedido esta vazio. Quer escolher um produto?",
          });
          return;
        }

        if (!pedido.endereco) {
          resp.status(200).json({
            fulfillmentText: "Preciso do endereco de entrega para confirmar.",
          });
          return;
        }

        if (!pedido.pagamento) {
          resp.status(200).json({
            fulfillmentText: "Preciso da forma de pagamento para confirmar.",
          });
          return;
        }

        await pedidoDB.confirmar(pedido.id);
        resp.status(200).json({
          fulfillmentText: `Pedido registrado! Numero do pedido: ${pedido.id}.`,
        });
        return;
      }

      resp.status(200).json({
        fulfillmentText: "Tudo certo. Em que mais posso ajudar?",
      });
    } catch (erro) {
      console.error("Erro ao consultar catalogo:", erro);
      resp.status(500).json({
        fulfillmentText:
          "Desculpe, tivemos um problema ao consultar o catalogo.",
      });
    }
  }
}
