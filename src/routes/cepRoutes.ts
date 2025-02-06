import express from "express";
import authenticate from "../middlewares/jtw";
import { getCEPInfo } from "../services/cepService";

const router = express.Router();

router.get("/:cep", authenticate, async (req, res) => {
  try {
    const data = await getCEPInfo(req.params.cep);
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: "CEP inválido ou não encontrado" });
  }
});

export default router;
