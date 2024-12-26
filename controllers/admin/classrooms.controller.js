import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";

import {
  deleteSuccess,
  getSuccess,
  queryError,
  recordNotFound,
  serverError,
} from "@utils/messages";

import prisma from "@utils/prisma";

/**
 * Get all classrooms
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getAll = async (req, res) => {
  // get query parameters
  const { orderBy = "name", order = "asc" } = req.query;

  try {
    // get all classrooms include creator
    const classrooms = await prisma.classroom.findMany({
      orderBy: {
        [orderBy]: order,
      },
      include: {
        thumbnail: true,
        creator: {
          omit: {
            password: true,
          },
        },
      },
    });

    // return 200 - OK
    return getSuccess(res, "Kelas", classrooms);
  } catch (e) {
    // invalid query parameters
    if (e instanceof PrismaClientValidationError) {
      // return 400 - Bad request
      return queryError(res);
    }

    // return 500 - server error
    return serverError(res);
  }
};

/**
 * Find classroom by id
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getById = async (req, res) => {
  // get classroom by id
  const classroom = await prisma.classroom.findFirst({
    where: {
      id: parseInt(req.params.id),
    },
    include: {
      thumbnail: true,
      creator: {
        omit: {
          password: true,
        },
      },
    },
  });

  // classroom not found
  if (!classroom) {
    return recordNotFound(res, "Kelas");
  }

  // return 200 - OK
  return getSuccess(res, "Kelas", classroom);
};

/**
 * Delete classroom
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const destroy = async (req, res) => {
  try {
    // delete classroom by id
    await prisma.classroom.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });

    // return 200 - OK
    return deleteSuccess(res, "Kelas");
  } catch (e) {
    // classroom not found
    if (e instanceof PrismaClientKnownRequestError) {
      return recordNotFound(res, "Kelas");
    }

    // return 500 - Server error
    return serverError(res);
  }
};
