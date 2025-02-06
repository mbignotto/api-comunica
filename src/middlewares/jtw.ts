import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

interface JwtUserPayload {
  id: number;
  email: string;
}

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log('Headers:', req.headers);
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log('No authorization header');
      res.status(401).json({ message: "Token não fornecido" });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      console.log('No token in authorization header');
      res.status(401).json({ message: "Token não fornecido" });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET não está definido");
      res.status(500).json({ message: "Erro de configuração do servidor" });
      return;
    }

    try {
      console.log('Verificando token...');
      const decoded = jwt.verify(token, jwtSecret) as JwtUserPayload;
      console.log('Token decodificado:', decoded);
      
      const user = await User.findByPk(decoded.id);
      console.log('Usuário encontrado:', user?.id);

      if (!user) {
        console.log('Usuário não encontrado após decodificar token');
        res.status(401).json({ message: "Usuário não encontrado" });
        return;
      }

      req.user = user;
      next();
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        console.log('Token inválido:', err.message);
        res.status(401).json({ message: "Token inválido" });
      } else {
        console.error("Erro na autenticação:", err);
        res.status(500).json({ message: "Erro interno do servidor" });
      }
    }
  } catch (err) {
    console.error("Erro no middleware de autenticação:", err);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

export default authenticate;
