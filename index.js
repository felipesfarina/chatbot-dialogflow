import express from "express";
import dotenv from "dotenv";
import rotaProduto from "./routes/rotaProduto.js";
import rotaDialogflow from "./routes/rotaDialogflow.js";

dotenv.config();

const porta = 3000;
const host = "0.0.0.0";
const app = express();
app.use(express.json());

app.use("/produto", rotaProduto);
app.use("/dialogflow", rotaDialogflow);
app.use("/webhook", rotaDialogflow);

app.listen(porta, host, () => {
  console.log(`Servidor rodando em http://${host}:${porta}`);
});
