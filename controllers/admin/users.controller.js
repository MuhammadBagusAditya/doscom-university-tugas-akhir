import * as bcrypt from "bcrypt";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";

import prisma from "@utils/prisma";
import {
  createUserValidator,
  updateUserValidator,
} from "@utils/validators/users";
import {
  queryError,
  recordNotFound,
  serverError,
  getSuccess,
  validationError,
  postSuccess,
  putSuccess,
  deleteSuccess,
} from "@utils/messages";

/**
 * Get all users
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getAll = async (req, res) => {
  // get query parameters
  const { orderBy = "username", order = "asc" } = req.query;

  try {
    // get all users
    const users = await prisma.user.findMany({
      omit: {
        password: true,
      },
      orderBy: {
        [orderBy]: order,
      },
      include: {
        avatar: {
          include: {
            attachment: true,
          },
        },
      },
    });

    // return 200 - OK
    return getSuccess(res, "User", users);
  } catch (e) {
    // data not found
    if (e instanceof PrismaClientValidationError) {
      // return 404 - not found
      return queryError(res);
    }

    // return 500 - server error
    return serverError(res);
  }
};

/**
 * Find user by id
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getById = async (req, res) => {
  // get user by id
  const user = await prisma.user.findFirst({
    where: {
      id: parseInt(req.params.id),
    },
    omit: {
      password: true,
    },
    include: {
      avatar: true,
    },
  });

  // user not found
  if (!user) {
    // return 404 - not found
    return recordNotFound(res, "User");
  }

  // return 200 - ok
  return getSuccess(res, "User", user);
};

/**
 * Create new user
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const create = async (req, res) => {
  const {
    success,
    data: userInput,
    error,
  } = await createUserValidator.spa(req.body);

  // validation error
  if (!success) {
    // return 400 - bad request
    return validationError(res, error.format());
  }

  try {
    // create new user
    const user = await prisma.user.create({
      data: {
        ...userInput,
        password: bcrypt.hashSync(userInput.password, 10),
      },
      omit: {
        password: true,
      },
      include: {
        avatar: {
          include: {
            attachment: true,
          },
        },
      },
    });

    // return 201 - created
    return postSuccess(res, "User", user);
  } catch (e) {
    // return 500 - server error
    return serverError(res);
  }
};

/**
 * Update user's data
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const update = async (req, res) => {
  const {
    success,
    data: userInput,
    error,
  } = await updateUserValidator.spa({
    id: parseInt(req.params.id),
    ...req.body,
  });

  // validation error
  if (!success) {
    // return 400 - bad request
    return validationError(res, error.format());
  }

  try {
    // update user
    const user = await prisma.user.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        ...userInput,
        password: bcrypt.hashSync(userInput.password, 10),
        id: undefined,
      },
      include: {
        avatar: {
          include: {
            attachment: true,
          },
        },
      },
    });

    // return 200 - ok
    return putSuccess(res, "User", user);
  } catch (e) {
    // data not found
    if (e instanceof PrismaClientKnownRequestError) {
      // return 404 - not found
      return recordNotFound(res, "User");
    }

    // return 500 - server error
    return serverError(res);
  }
};

/**
 * Delete user
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const destroy = async (req, res) => {
  try {
    // delete user by id
    await prisma.user.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });

    // return 200 - ok
    return deleteSuccess(res, "User");
  } catch (e) {
    // user not found
    if (e instanceof PrismaClientKnownRequestError) {
      // return 404 - not found
      return recordNotFound(res, "User");
    }

    // return 500 - server error
    return serverError(res);
  }
};
