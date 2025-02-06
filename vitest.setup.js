import { afterAll, beforeAll } from "vitest";
import sequelize from "./src/config/database";
import Address from "./src/models/Address";
import "./src/models/associations";
import User from "./src/models/User";
import app from "./src/server";

const server = app.listen(0);
let dbSetup = false;

beforeAll(async () => {
  if (dbSetup) return;

  const transaction = await sequelize.transaction();

  try {
    await sequelize.authenticate();

    await sequelize.query('DROP TABLE IF EXISTS "addresses" CASCADE', {
      transaction,
    });
    await sequelize.query('DROP TABLE IF EXISTS "users" CASCADE', {
      transaction,
    });

    await User.sync({ transaction });
    await Address.sync({ transaction });

    await transaction.commit();
    dbSetup = true;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
});

afterAll(async () => {
  try {
    if (server) {
      server.close();
    }
    await sequelize.close();
  } catch (error) {
    console.error("Test cleanup failed:", error);
  }
});
