import jwt from "jsonwebtoken";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import User from "../models/User";
import Address from "../models/Address";
import app from "../server";

const generateUniqueEmail = () =>
  `test-${Date.now()}-${Math.random().toString(36).substring(7)}@gmail.com`;

const generateToken = (id: number) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });
};

describe("User API", () => {
  let token: string;
  let testUserId: number;

  beforeEach(async () => {
    // Limpa os dados antes de cada teste
    await Address.destroy({ where: {} });
    await User.destroy({ where: {} });

    // Cria um usuário de teste
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

  test("POST /users - Cria um novo usuário", async () => {
    const testUser = {
      name: "Teste Completo",
      email: generateUniqueEmail(),
      password: "senha123",
      age: 25,
    };

    const response = await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${token}`)
      .send(testUser);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      name: testUser.name,
      email: testUser.email.toLowerCase(),
      age: testUser.age,
    });
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
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("GET /users/:id - Busca usuário específico", async () => {
    const response = await request(app)
      .get(`/users/${testUserId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: testUserId,
      name: "Usuario Teste",
    });
  });

  test("PUT /users/:id - Atualiza um usuário", async () => {
    const updatedData = {
      name: "Nome Atualizado",
      email: generateUniqueEmail(),
      password: "novaSenha123",
      age: 45,
    };

    const response = await request(app)
      .put(`/users/${testUserId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      name: updatedData.name,
      email: updatedData.email.toLowerCase(),
      age: updatedData.age,
    });
  });

  test("DELETE /users/:id - Remove um usuário", async () => {
    const newUser = await User.create({
      name: "Usuario para Exclusão",
      email: generateUniqueEmail(),
      password: "senha123",
      age: 50,
    });

    const response = await request(app)
      .delete(`/users/${newUser.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);

    const deletedUser = await User.findByPk(newUser.id);
    expect(deletedUser).toBeNull();
  });

  test("POST /users - Validação de campos obrigatórios", async () => {
    const invalidUsers = [
      { name: "Sem Email", age: 25 },
      { email: generateUniqueEmail(), age: 25 },
      { name: "Email Inválido", email: "email-invalido" },
      { name: "A", email: generateUniqueEmail() },
      { name: "Nome válido", email: generateUniqueEmail(), age: -5 },
    ];

    for (const user of invalidUsers) {
      const response = await request(app)
        .post("/users")
        .set("Authorization", `Bearer ${token}`)
        .send(user);

      expect(response.status).toBe(400);

      if (response.body.errors) {
        expect(Array.isArray(response.body.errors)).toBe(true);
        expect(response.body.errors.length).toBeGreaterThan(0);
      } else if (response.body.error) {
        expect(typeof response.body.error).toBe("string");
        expect(response.body.error).not.toBe("");
      } else {
        throw new Error("Erro de validação não encontrado na resposta.");
      }
    }
  });
});
