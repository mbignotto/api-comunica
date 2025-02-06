import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Address extends Model {
  declare cep: string;
  declare street: string;
  declare neighborhood: string;
  declare city: string;
  declare state: string;
  declare userId: number;
}

Address.init(
  {
    cep: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    street: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    neighborhood: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Address",
    tableName: "addresses",
    timestamps: true,
    underscored: true,
  }
);

export default Address;
