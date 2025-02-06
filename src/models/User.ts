import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class User extends Model {
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare age?: number;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Nome é obrigatório",
        },
        len: {
          args: [2, 100],
          msg: "Nome deve ter entre 2 e 100 caracteres",
        },
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Email inválido",
        },
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "A senha é obrigatória",
        },
        len: {
          args: [6, 255],
          msg: "A senha deve ter no mínimo 6 caracteres",
        },
      },
    },
    age: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: {
          msg: "Idade deve ser um número inteiro",
        },
        min: {
          args: [0],
          msg: "Idade não pode ser negativa",
        },
      },
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    underscored: true,
  }
);

export default User;
