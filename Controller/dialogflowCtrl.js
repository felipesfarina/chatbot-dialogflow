import Produto from "../Model/produto.js";
import {
  montarCatalogo,
  montarCards,
  montarRichContent,
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
