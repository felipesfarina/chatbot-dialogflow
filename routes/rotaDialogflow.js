import { Router } from "express";
import DialogflowCtrl from "../Controller/dialogflowCtrl.js";

const rotaDialogflow = Router();
const dialogflowCtrl = new DialogflowCtrl();

rotaDialogflow.post("/", dialogflowCtrl.processar);

export default rotaDialogflow;
