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
  createAssignmentValidator,
  updateAssignmentValidator,
} from "@utils/validators/assignments";
import { attachmentValidator } from "@utils/validators/attachments";

/**
 * Get all assignments
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 *
 */
export const getAll = async (req, res) => {
  const { orderBy = "name", order = "asc" } = req.query;

  try {
    const assignments = await prisma.assignment.findMany({
      orderBy: {
        [orderBy]: order,
      },
      include: {
        classroom: true,
      },
      where: {
        classroom: {
          creator_id: req.user.id,
        },
      },
    });

    // return 200 - ok
    return getSuccess(res, "Tugas", assignments);
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
 * Get assignment by id
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 *
 */
export const getById = async (req, res) => {
  // get assignment by id
  const assignment = await prisma.assignment.findFirst({
    where: {
      id: parseInt(req.params.id),
      classroom: {
        creator_id: req.user.id,
      },
    },
    include: {
      classroom: true,
    },
  });

  // not found
  if (!assignment) {
    // return 404 - not found
    return recordNotFound(res, "Tugas");
  }

  // return 200 - ok
  return getSuccess(res, "Tugas", assignment);
};

/**
 * Create new assignment
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 *
 */
export const create = async (req, res) => {
  const {
    success,
    error,
    data: userInput,
  } = createAssignmentValidator.safeParse(req.body);

  // validation error
  if (!success) {
    // return 400 - bad request
    return validationError(res, error.format());
  }

  try {
    // find classroom
    const classroom = await prisma.classroom.findFirst({
      where: {
        id: userInput.classroom_id,
      },
      select: {
        id: true,
        creator_id: true,
      },
    });

    // classroom not found
    if (!classroom) {
      // return 404 - not found
      return recordNotFound(res, "Kelas");
    }

    // just for classroom creator only
    if (classroom.creator_id !== req.user.id) {
      // return 403 - forbidden
      return forbiddenError(res, "Kelas");
    }

    // create new assignment in this classroom
    const assignment = await prisma.assignment.create({
      data: {
        ...userInput,
      },
    });

    // return 201 - created
    return postSuccess(res, "Tugas", assignment);
  } catch (e) {
    // return 500 - server error
    return serverError(res);
  }
};

/**
 * Update assignment
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 *
 */
export const update = async (req, res) => {
  const {
    success,
    error,
    data: userInput,
  } = updateAssignmentValidator.safeParse(req.body);

  // validation error
  if (!success) {
    // return 400 - bad request
    return validationError(res, error.format());
  }

  try {
    // find assignment
    const assignment = await prisma.assignment.findFirst({
      where: {
        id: parseInt(req.params.id),
      },
      include: {
        classroom: {
          select: {
            id: true,
            creator_id: true,
          },
        },
      },
    });

    // assignment not found
    if (!assignment) {
      // return 404 - not found
      return recordNotFound(res, "Materi");
    }

    // this action is the assignment's creator only
    if (assignment.classroom.creator_id !== req.user.id) {
      // return 403 - forbidden
      return forbiddenError(res, "Materi");
    }

    // update assignment data
    const newAssignment = await prisma.assignment.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        ...userInput,
      },
      include: {
        classroom: true,
      },
    });

    // return 200 - ok
    return putSuccess(res, "Tugas", newAssignment);
  } catch (e) {
    // return 500 - server error
    return serverError(res);
  }
};

/**
 * Delete assignment
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 *
 */
export const destroy = async (req, res) => {
  try {
    // find assignment
    const assignment = await prisma.assignment.findFirst({
      where: {
        id: parseInt(req.params.id),
      },
      include: {
        classroom: {
          select: {
            id: true,
            creator_id: true,
          },
        },
      },
    });

    // data not found
    if (!assignment) {
      // return 404 - not found
      return recordNotFound(res, "Tugas");
    }

    // this action is for assignment's creator only
    if (assignment.classroom.creator_id !== req.user.id) {
      // return 403 - forbidden
      return forbiddenError(res, "Tugas");
    }

    // delete assignment by id
    await prisma.assignment.delete({
      where: {
        id: assignment.id,
      },
    });

    // return 200 - ok
    return deleteSuccess(res, "Tugas");
  } catch (e) {
    // return 500 - server error
    return serverError(res);
  }
};

/**
 * Add attachment
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const addAttachment = async (req, res) => {
  const {
    success,
    error,
    data: userInput,
  } = attachmentValidator.safeParse(req.body);

  // validation error
  if (!success) {
    // return 400 - bad request
    return validationError(res, error.format());
  }

  try {
    // find assignment
    const assignment = await prisma.assignment.findFirst({
      where: {
        id: parseInt(req.params.id),
      },
      select: {
        id: true,
        classroom: {
          select: {
            id: true,
            creator_id: true,
          },
        },
      },
    });

    // data not found
    if (!assignment) {
      // return 404 - not found
      return recordNotFound(res, "Tugas");
    }

    // this action is for assignment's creator only
    if (assignment.classroom.creator_id !== req.user.id) {
      return forbiddenError(res, "Tugas");
    }

    // add attachment id in assignment
    await prisma.assignment.update({
      where: {
        id: assignment.id,
      },
      data: {
        attachments: {
          connect: {
            id: userInput.id,
          },
        },
      },
    });

    // return 201 - created
    return postSuccess(res, "Lampiran");
  } catch (e) {
    // return 500 - server error
    return serverError(res);
  }
};

/**
 * Remove attachment
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const removeAttachment = async (req, res) => {
  const {
    success,
    error,
    data: userInput,
  } = attachmentValidator.safeParse(req.body);

  // validation error
  if (!success) {
    // return 400 - bad request
    return validationError(res, error.format());
  }

  try {
    // find assignment
    const assignment = await prisma.assignment.findFirst({
      where: {
        id: parseInt(req.params.id),
      },
      select: {
        id: true,
        classroom: {
          select: {
            id: true,
            creator_id: true,
          },
        },
      },
    });

    // data not found
    if (!assignment) {
      // return 404 - not found
      return recordNotFound(res, "Tugas");
    }

    // this action is for assignment's creator only
    if (assignment.classroom.creator_id !== req.user.id) {
      // return 403 - forbidden
      return forbiddenError(res, "Tugas");
    }

    // remove attachment id from this assignment
    await prisma.assignment.update({
      where: {
        id: assignment.id,
      },
      data: {
        attachments: {
          disconnect: {
            id: userInput.id,
          },
        },
      },
    });

    // return 200 - ok
    return deleteSuccess(res, "Lampiran");
  } catch (e) {
    // return 500 - server error
    return serverError(res);
  }
};
