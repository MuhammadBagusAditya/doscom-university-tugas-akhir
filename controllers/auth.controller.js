import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";

import prisma from "@utils/prisma";
import config from "@config";
import { zodErrorFormatter } from "@utils/formatter";
import { loginValidator, registerValidator } from "@validators/auth";

/**
 * Login function logic
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 *
 */
export const login = async (req, res) => {
  const {
    success,
    data: userInput,
    error,
  } = loginValidator.safeParse(req.body);

  // validation error
  if (!success) {
    return res.status(400).json({
      status: "failed",
      message: "Input tidak valid",
      errors: zodErrorFormatter(error.format()),
    });
  }

  const user = await prisma.user.findFirst({
    where: {
      email: userInput.email,
    },
  });

  // user not found
  if (!user) {
    return res.status(404).json({
      status: "failed",
      message: "User tidak ditemukan",
    });
  }

  // password is wrong
  if (!bcrypt.compareSync(userInput.password, user.password)) {
    return res.status(401).json({
      status: "failed",
      message: "Login gagal",
    });
  }

  const token = jwt.sign({ id: user.id }, config.app.secret, {
    expiresIn: "7d",
  });

  res.json({
    status: "success",
    message: "Login berhasil",
    token,
  });
};

/**
 * Register function logic
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 *
 */
export const register = async (req, res) => {
  const {
    success,
    data: userInput,
    error,
  } = await registerValidator.spa(req.body);

  // validation error
  if (!success) {
    return res.status(400).json({
      status: "failed",
      message: "Input tidak valid",
      errors: zodErrorFormatter(error.format()),
    });
  }

  // create new user
  const newUser = await prisma.user.create({
    data: {
      ...userInput,
      password: bcrypt.hashSync(userInput.password, 10),
      confirm_password: undefined,
    },
  });

  // sign new token
  const token = jwt.sign({ id: newUser.id }, config.app.secret, {
    expiresIn: "7d",
  });

  res.json({
    status: "success",
    message: "Registrasi berhasil",
    token,
  });
};
