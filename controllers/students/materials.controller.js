import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import {
  forbiddenError,
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
    // find materials in user joined classroom
    const materials = await prisma.material.findMany({
      orderBy: {
        [orderBy]: order,
      },
      include: {
        classroom: {
          include: {
            creator: {
              omit: {
                password: true,
              },
            },
          },
        },
        attachments: true,
      },
      where: {
        classroom: {
          members: {
            some: {
              id: req.user.id,
            },
          },
        },
      },
    });

    // return 200 - ok
    return getSuccess(res, "Materi", materials);
  } catch (e) {
    // invalid query parameters
    if (e instanceof PrismaClientValidationError) {
      // return 400 - bad request
      return queryError(res);
    }

    // return 500 - server error
    return serverError(res);
  }
};

/**
 * Get material by id
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
      classroom: {
        members: {
          some: {
            id: req.user.id,
          },
        },
      },
    },
    include: {
      classroom: {
        include: {
          creator: {
            omit: {
              password: true,
            },
          },
        },
      },
      attachments: true,
    },
  });

  // not found
  if (!material) {
    // return 404 - not found
    return recordNotFound(res, "Materi");
  }

  // return 200 - ok
  return getSuccess(res, "Materi", material);
};
