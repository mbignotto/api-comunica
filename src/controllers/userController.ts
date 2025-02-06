import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import sequelize from "../config/database";
import { User, Address } from "../models/associations";

type ControllerFunction = (req: Request, res: Response) => Promise<void>;

export const getUsers: ControllerFunction = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      include: [{ model: Address, as: "address" }],
    });
    res.json(users);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
};

export const getUserById: ControllerFunction = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Address, as: "address" }],
    });
    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado" });
    } else {
      res.json(user);
    }
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
};

export const createUser: ControllerFunction = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { name, email, password, age, address } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create(
      {
        name,
        email,
        password: hashedPassword,
        age,
      },
      { transaction }
    );

    if (address) {
      await Address.create(
        {
          ...address,
          userId: user.id,
        },
        { transaction }
      );
    }

    await transaction.commit();

    const userWithAddress = await User.findByPk(user.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Address, as: "address" }],
    });
    res.status(201).json(userWithAddress);
  } catch (error: any) {
    if (transaction) {
      try {
        await transaction.rollback();
      } catch (rollbackError) {
        console.error("Rollback error:", rollbackError);
      }
    }
    console.error("Erro ao criar usuário:", error);
    res.status(400).json({ error: error.message });
  }
};

export const updateUser: ControllerFunction = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { name, email, password, age, address } = req.body;

    const user = await User.findByPk(id, { transaction });

    if (!user) {
      await transaction.rollback();
      res.status(404).json({ error: "Usuário não encontrado" });
    } else {
      const updateData: any = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateData.password = hashedPassword;
      }
      if (age) updateData.age = age;

      await user.update(updateData, { transaction });

      if (address) {
        const existingAddress = await Address.findOne({
          where: { userId: id },
          transaction,
        });

        if (existingAddress) {
          await Address.update(
            address,
            {
              where: { userId: id },
              transaction,
            }
          );
        } else {
          await Address.create(
            {
              ...address,
              userId: id,
            },
            { transaction }
          );
        }
      }

      await transaction.commit();

      const updatedUser = await User.findByPk(id, {
        attributes: { exclude: ['password'] },
        include: [{ model: Address, as: "address" }],
      });
      res.json(updatedUser);
    }
  } catch (error: any) {
    if (transaction) {
      try {
        await transaction.rollback();
      } catch (rollbackError) {
        console.error("Rollback error:", rollbackError);
      }
    }
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser: ControllerFunction = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      await transaction.rollback();
      res.status(404).json({ error: "Usuário não encontrado" });
    } else {
      await Address.destroy({
        where: { userId: id },
        transaction,
      });

      await User.destroy({
        where: { id },
        transaction,
      });

      await transaction.commit();
      res.status(204).send();
    }
  } catch (error) {
    if (transaction) {
      try {
        await transaction.rollback();
      } catch (rollbackError) {
        console.error("Rollback error:", rollbackError);
      }
    }
    console.error("Erro ao excluir usuário:", error);
    res.status(500).json({ error: "Erro ao excluir usuário" });
  }
};

export const getMe: ControllerFunction = async (req, res) => {
  try {
    console.log('Request user:', req.user);
    
    if (!req.user || !(req.user instanceof User)) {
      console.log('User validation failed:', { 
        exists: !!req.user, 
        type: req.user ?? 'undefined'
      });
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const userId = req.user.id;
    console.log('Buscando usuário com ID:', userId);
    
    const user = await User.findOne({
      where: { id: userId },
      attributes: { exclude: ['password'] },
      include: [{ model: Address, as: "address" }],
    });

    if (!user) {
      console.log('Usuário não encontrado com ID:', userId);
      res.status(404).json({ error: "Usuário não encontrado" });
      return;
    }

    console.log('Usuário encontrado:', user.id);
    res.json(user);
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    res.status(500).json({ error: "Erro ao buscar dados do usuário" });
  }
};
