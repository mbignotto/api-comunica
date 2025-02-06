import { body, param } from "express-validator";

// Validação de dados para criar um usuário
export const validateCreateUser = [
  body("name").notEmpty().withMessage("O nome é obrigatório"),
  body("email").isEmail().withMessage("O email deve ser válido"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("A senha deve ter no mínimo 6 caracteres"),
];

// Validação de dados para atualizar um usuário
export const validateUpdateUser = [
  param("id").isInt().withMessage("O ID deve ser um número inteiro"),
  body("name").optional().notEmpty().withMessage("O nome não pode estar vazio"),
  body("email").optional().isEmail().withMessage("O email deve ser válido"),
];
