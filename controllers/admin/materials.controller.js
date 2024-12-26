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
 * Get all materials
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 *
 */
export const getAll = async (req, res) => {
  // get query parameters
  const { orderBy = "name", order = "asc" } = req.query;

  try {
    // get all materials
    const materials = await prisma.material.findMany({
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
    return getSuccess(res, "Materi", materials);
  } catch (e) {
    // Data not found
    if (e instanceof PrismaClientValidationError) {
      // return 404 - Not found
      return queryError(res);
    }

    // return 500 - Server error
    return serverError(res);
  }
};

/**
 * Get materials by id
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 *
 */
export const getById = async (req, res) => {
  // get material by id
  const material = await prisma.material.findFirst({
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

  // not found
  if (!material) {
    // return 404 - not found
    return recordNotFound(res, "Materi");
  }

  // return 200 - OK
  return getSuccess(res, "Materi", material);
};

/**
 * Delete materials
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 *
 */
export const destroy = async (req, res) => {
  try {
    // delete material by id
    await prisma.material.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });

    // return 200 - OK
    return deleteSuccess(res, "Materi");
  } catch (e) {
    // material not found
    if (e instanceof PrismaClientKnownRequestError) {
      // return 404 - not found
      return recordNotFound(res, "Materi");
    }

    // return 500 - server error
    return serverError(res);
  }
};
