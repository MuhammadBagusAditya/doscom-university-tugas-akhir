import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import {
  deleteSuccess,
  forbiddenError,
  getSuccess,
  postSuccess,
  putSuccess,
  queryError,
  recordNotFound,
  serverError,
  validationError,
} from "@utils/messages";

import prisma from "@utils/prisma";
import {
  createClassroomValidator,
  updateClassroomValidator,
} from "@utils/validators/classrooms";
import { memberValidator } from "@utils/validators/members";

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
    const classrooms = await prisma.classroom.findMany({
      orderBy: {
        [orderBy]: order,
      },
      include: {
        thumbnail: true,
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
      where: {
        creator_id: id,
      },
    });

    return getSuccess(res, "Kelas", classrooms);
  } catch (e) {
    if (e instanceof PrismaClientValidationError) {
      return queryError(res);
    }

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
      creator_id: req.user.id,
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
    return recordNotFound(res, "Kelas");
  }

  return getSuccess(res, "Kelas", classroom);
};

/**
 * Create new classroom
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const create = async (req, res) => {
  const {
    success,
    data: userInput,
    error,
  } = createClassroomValidator.safeParse(req.body);

  // validation error
  if (!success) {
    return validationError(res, error.format());
  }

  try {
    // create new classroom
    const classroom = await prisma.classroom.create({
      data: {
        ...userInput,
        creator_id: req.user.id,
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

    return postSuccess(res, "Kelas", classroom);
  } catch (e) {
    // cannot create new classroom
    return serverError(res);
  }
};

/**
 * Update classroom's data
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const update = async (req, res) => {
  const {
    success,
    data: userInput,
    error,
  } = updateClassroomValidator.safeParse(req.body);

  // validation error
  if (!success) {
    return validationError(res, error.format());
  }

  try {
    const classroom = await prisma.classroom.findFirst({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!classroom) {
      return recordNotFound(res, "Kelas");
    }

    if (classroom.creator_id !== req.user.id) {
      return forbiddenError(res, "Kelas");
    }

    // update classroom
    const newClassroom = await prisma.classroom.update({
      where: {
        id: classroom.id,
      },
      data: {
        ...userInput,
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

    return putSuccess(res, "Kelas", newClassroom);
  } catch (e) {
    // cannot update classroom
    return serverError(res);
  }
};

/**
 * Delete classroom
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const destroy = async (req, res) => {
  try {
    const classroom = await prisma.classroom.findFirstOrThrow({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (classroom.creator_id !== req.user.id) {
      return forbiddenError(res, "Kelas");
    }

    // delete classroom by id
    await prisma.classroom.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });

    return deleteSuccess(res, "Kelas");
  } catch (e) {
    // classroom not found
    if (e instanceof PrismaClientKnownRequestError) {
      return recordNotFound(res, "Kelas");
    }

    // cannot delete classroom
    return serverError(res);
  }
};

/**
 * Add new member
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 *
 */
export const addMembers = async (req, res) => {
  const {
    success,
    error,
    data: userInput,
  } = memberValidator.safeParse(req.body);

  if (!success) return validationError(res, error.format());

  const classroom = await prisma.classroom.findFirst({
    where: {
      id: parseInt(req.params.id),
    },
  });

  if (!classroom) return recordNotFound(res, "Kelas");

  if (classroom.creator_id !== req.user.id) return forbiddenError(res, "Kelas");

  try {
    await prisma.classroom.update({
      where: {
        id: classroom.id,
      },
      data: {
        members: {
          connect: userInput.user_id.map((val) => ({ id: val })),
        },
      },
    });

    return postSuccess(res, "Anggota");
  } catch (e) {
    return serverError(res);
  }
};

/**
 * Remove member from classroom
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 *
 */
export const removeMembers = async (req, res) => {
  const {
    success,
    error,
    data: userInput,
  } = memberValidator.safeParse(req.body);

  if (!success) return validationError(res, error.format());

  const classroom = await prisma.classroom.findFirst({
    where: {
      id: parseInt(req.params.id),
    },
  });

  if (!classroom) return recordNotFound(res, "Kelas");

  if (classroom.creator_id !== req.user.id) return forbiddenError(res, "Kelas");

  try {
    await prisma.classroom.update({
      where: {
        id: classroom.id,
      },
      data: {
        members: {
          disconnect: userInput.user_id.map((val) => ({ id: val })),
        },
      },
    });

    return deleteSuccess(res, "Anggota");
  } catch (e) {
    return serverError(res);
  }
};
