import cors from "cors";
import "dotenv/config";
import express from "express";
import sequelize from "./config/database";
import errorHandler from "./middlewares/errorHandler";
import authRoutes from "./routes/authRoutes";
import cepRoutes from "./routes/cepRoutes";
import userRoutes from "./routes/userRoutes";

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:8080",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Rotas
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/cep", cepRoutes);

// Middleware de Erros
app.use(errorHandler);

sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Banco de dados conectado");
    return sequelize.sync();
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${port}`);
    });
  })
  .catch((error: Error) => {
    console.error("❌ Erro ao conectar ao banco:", error);
  });

export default app;
