import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import {
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
  try {
    const { orderBy = "name", order = "asc" } = req.query;

    const { id } = req.user;

    // get all classrooms
    const data = await prisma.user.findFirst({
      where: {
        id,
      },
      include: {
        joined_classrooms: {
          orderBy: {
            [orderBy]: order,
          },
          include: {
            creator: {
              omit: {
                password: true,
              },
            },
            thumbnail: true,
          },
        },
      },
    });

    // return 200 - ok
    return getSuccess(res, "Kelas", data.joined_classrooms);
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
      members: {
        some: {
          id: req.user.id,
        },
      },
    },
    include: {
      thumbnail: true,
      materials: true,
      assignments: true,
      creator: {
        omit: {
          password: true,
        },
      },
      members: {
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
      },
    },
  });

  // classroom not found
  if (!classroom) {
    // return 404 - not found
    return recordNotFound(res, "Kelas");
  }

  // return 200 - ok
  return getSuccess(res, "Kelas", classroom);
};

/**
 * Join to classroom
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 *
 */
export const joinClassroom = async (req, res) => {
  // find the classroom
  const classroom = await prisma.classroom.findFirst({
    where: {
      id: parseInt(req.params.id),
    },
  });

  // return 404 - not found
  if (!classroom) return recordNotFound(res, "Kelas");

  try {
    // add current user id as member of this classroom
    await prisma.classroom.update({
      where: {
        id: classroom.id,
      },
      data: {
        members: {
          connect: {
            id: req.user.id,
          },
        },
      },
    });

    // return 201 - created
    return res.status(201).json({
      status: "success",
      message: "Berhasil masuk ke kelas",
    });
  } catch (e) {
    // return 500 -server error
    return serverError(res);
  }
};

/**
 * Quit from classroom
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 *
 */
export const quitClassroom = async (req, res) => {
  // find classroom
  const classroom = await prisma.classroom.findFirst({
    where: {
      id: parseInt(req.params.id),
    },
  });

  // return 404 - not found
  if (!classroom) return recordNotFound(res, "Kelas");

  try {
    // delete user id from this classroom' members
    await prisma.classroom.update({
      where: {
        id: classroom.id,
      },
      data: {
        members: {
          disconnect: {
            id: req.user.id,
          },
        },
      },
    });

    // return 200 - ok
    return res.status(200).json({
      status: "success",
      message: "Berhasil keluar dari kelas",
    });
  } catch (e) {
    // return 500 - server error
    return serverError(res);
  }
};
