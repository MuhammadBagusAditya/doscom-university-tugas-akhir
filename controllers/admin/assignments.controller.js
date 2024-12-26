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
 * Get all assignments
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 *
 */
export const getAll = async (req, res) => {
  // get query parameters
  const { orderBy = "name", order = "asc" } = req.query;

  try {
    // get assignments from database include classroom with creator
    const assignments = await prisma.assignment.findMany({
      orderBy: {
        [orderBy]: order,
      },
      include: {
        classroom: {
          include: {
            creator: true,
          },
        },
      },
    });

    // return 200 - OK
    return getSuccess(res, "Tugas", assignments);
  } catch (e) {
    // Invalid query parameters
    if (e instanceof PrismaClientValidationError) {
      // return 400 - Bad Request
      return queryError(res);
    }

    // return 500 - Server error
    return serverError(res);
  }
};

/**
 * Get assignment by id
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 *
 */
export const getById = async (req, res) => {
  // get assignment by id include classroom with creator
  const assignment = await prisma.assignment.findFirst({
    where: {
      id: parseInt(req.params.id),
    },
    include: {
      classroom: {
        include: {
          creator: true,
        },
      },
    },
  });

  // assignment not found
  if (!assignment) {
    // return 404 - Not Found
    return recordNotFound(res, "Tugas");
  }

  // return 200 - OK
  return getSuccess(res, "Tugas", assignment);
};

/**
 * Delete assignments
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 *
 */
export const destroy = async (req, res) => {
  try {
    // delete assignment by id
    await prisma.assignment.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });

    // return 200 - OK
    return deleteSuccess(res, "Tugas");
  } catch (e) {
    // assignment not found
    if (e instanceof PrismaClientKnownRequestError) {
      // return 404 - Not Found
      return recordNotFound(res, "Tugas");
    }

    // return 500 - Server error
    return serverError(res);
  }
};
