import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import {
  deleteSuccess,
  forbiddenError,
  getSuccess,
  postSuccess,
  queryError,
  recordNotFound,
  serverError,
  validationError,
} from "@utils/messages";
import prisma from "@utils/prisma";
import { attachmentValidator } from "@utils/validators/attachments";

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
    // get all assignments where this user joined the related classroom
    const assignments = await prisma.assignment.findMany({
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
    return getSuccess(res, "Tugas", assignments);
  } catch (e) {
    // data not found
    if (e instanceof PrismaClientValidationError) {
      // return 404 - bad request
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
  if (!assignment) {
    return recordNotFound(res, "Tugas");
  }

  // get user's assignment submission, can be null
  const userAssignment = await prisma.userAssignment.findFirst({
    where: {
      assignment_id: assignment.id,
      user_id: req.user.id,
    },
    include: {
      attachments: true,
    },
  });

  assignment.user_assignment = userAssignment;

  // return 200 - ok
  return getSuccess(res, "Tugas", assignment);
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

  if (!success) {
    // return 400 - bad request
    return validationError(res, error.format());
  }

  try {
    // find assignment submission
    let assignment = await prisma.userAssignment.findFirst({
      where: {
        assignment_id: parseInt(req.params.id),
        user_id: req.user.id,
      },
      select: {
        id: true,
      },
    });

    // data not found, create new assignment submission
    if (!assignment) {
      assignment = await prisma.userAssignment.create({
        data: {
          grade: 0,
          assignment_id: parseInt(req.params.id),
          user_id: req.user.id,
        },
      });
    }

    // update assignment submission
    await prisma.userAssignment.update({
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

  if (!success) {
    // return 400 - bad request
    return validationError(res, error.format());
  }

  try {
    // find assignment
    const assignment = await prisma.assignment.findFirst({
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
      select: {
        id: true,
        classroom: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!assignment) {
      // return 404 - not found
      return recordNotFound(res, "Tugas");
    }

    // disconnect attachment from assignment
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
