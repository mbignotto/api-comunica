import jwt from "jsonwebtoken";
import request from "supertest";
import { beforeEach, afterEach, describe, expect, test } from "vitest";
import User from "../models/User";
import Address from "../models/Address";
import app from "../server";

const generateToken = (id: number) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });
};

const generateUniqueEmail = () =>
  `test-${Date.now()}-${Math.random().toString(36).substring(7)}@gmail.com`;

describe("Rota de Usuários", () => {
  let token: string;
  let testUserId: number;

  beforeEach(async () => {
    // Limpa os dados antes de cada teste
    await Address.destroy({ where: {} });
    await User.destroy({ where: {} });

    const user = await User.create({
      name: "Usuario Teste",
      email: generateUniqueEmail(),
      password: "senha123",
      age: 30,
    });

    testUserId = user.id;
    token = generateToken(testUserId);
  });

  afterEach(async () => {
    // Limpa os dados após cada teste
    await Address.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  test("GET /users sem token deve retornar 401", async () => {
    const response = await request(app).get("/users");
    expect(response.status).toBe(401);
  });

  test("GET /users com token válido deve retornar 200", async () => {
    const response = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
  });

  test("GET /users/:id sem token deve retornar 401", async () => {
    const response = await request(app).get(`/users/${testUserId}`);
    expect(response.status).toBe(401);
  });

  test("GET /users/:id com token válido deve retornar 200", async () => {
    const response = await request(app)
      .get(`/users/${testUserId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
  });
});
