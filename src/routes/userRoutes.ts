import express from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
  getMe,
} from "../controllers/userController";
import authenticate from "../middlewares/jtw";
import { validateCreateUser } from "../validators/userValidator";

const router = express.Router();

type AsyncHandler = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => Promise<void>;

const asyncHandler =
  (fn: AsyncHandler) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

router.get(
  "/",
  authenticate,
  asyncHandler(async (req, res) => {
    await getUsers(req, res);
  })
);

router.get(
  "/me",
  authenticate,
  asyncHandler(async (req, res) => {
    await getMe(req, res);
  })
);

router.get(
  "/:id",
  authenticate,
  asyncHandler(async (req, res) => {
    await getUserById(req, res);
  })
);

router.post(
  "/",
  validateCreateUser,
  asyncHandler(async (req, res) => {
    await createUser(req, res);
  })
);

router.put(
  "/:id",
  authenticate,
  asyncHandler(async (req, res) => {
    await updateUser(req, res);
  })
);

router.delete(
  "/:id",
  authenticate,
  asyncHandler(async (req, res) => {
    await deleteUser(req, res);
  })
);

export default router;
