import { Router } from "express";
import UserModel from "../models/user.model.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = Router();

router.use(isAuthenticated);

router.post("/add/:id", async (req, res, next) => {});
