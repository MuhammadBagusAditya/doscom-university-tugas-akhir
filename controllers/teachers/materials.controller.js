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
import { attachmentValidator } from "@utils/validators/attachments";
import {
  createMaterialValidator,
  updateMaterialValidator,
} from "@utils/validators/materials";

/**
 * Get all materials
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 *
 */
export const getAll = async (req, res) => {
  const { orderBy = "name", order = "asc" } = req.query;

  try {
    const materials = await prisma.material.findMany({
      orderBy: {
        [orderBy]: order,
      },
      include: {
        classroom: true,
        attachments: true,
      },
    });

    return getSuccess(res, "Materi", materials);
  } catch (e) {
    if (e instanceof PrismaClientValidationError) {
      return queryError(res);
    }

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
        creator_id: req.user.id,
      },
    },
    include: {
      classroom: true,
      attachments: true,
    },
  });

  // not found
  if (!material) {
    return recordNotFound(res, "Materi");
  }

  return getSuccess(res, "Materi", material);
};

/**
 * Create new material
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
  } = createMaterialValidator.safeParse(req.body);

  if (!success) {
    return validationError(res, error.format());
  }

  try {
    const classroom = await prisma.classroom.findFirst({
      where: {
        id: userInput.classroom_id,
      },
      select: {
        id: true,
        creator_id: true,
      },
    });

    if (!classroom) {
      return recordNotFound(res, "Kelas");
    }

    if (classroom.creator_id !== req.user.id) {
      return forbiddenError(res, "Kelas");
    }

    const material = await prisma.material.create({
      data: {
        ...userInput,
      },
    });

    return postSuccess(res, "Materi", material);
  } catch (e) {
    return serverError(res);
  }
};

/**
 * Update material
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
  } = updateMaterialValidator.safeParse(req.body);

  if (!success) {
    return validationError(res, error.format());
  }

  try {
    const material = await prisma.material.findFirst({
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

    if (!material) {
      return recordNotFound(res, "Materi");
    }

    if (material.classroom.creator_id !== req.user.id) {
      return forbiddenError(res, "Materi");
    }

    const newMaterial = await prisma.material.update({
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

    return putSuccess(res, "Materi", newMaterial);
  } catch (e) {
    return serverError(res);
  }
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
    const material = await prisma.material.findFirst({
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

    if (!material) {
      return recordNotFound(res, "Materi");
    }

    if (material.classroom.creator_id !== req.user.id) {
      return forbiddenError(res, "Materi");
    }

    // delete material by id
    await prisma.material.delete({
      where: {
        id: material.id,
      },
    });

    return deleteSuccess(res, "Materi");
  } catch (e) {
    return serverError(res);
  }
};

/**
 * Add attachment
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const addAttachments = async (req, res) => {
  const {
    success,
    error,
    data: userInput,
  } = attachmentValidator.safeParse(req.body);

  if (!success) {
    return validationError(res, error.format());
  }

  try {
    const material = await prisma.material.findFirst({
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

    if (!material) {
      return recordNotFound(res, "Materi");
    }

    if (material.classroom.creator_id !== req.user.id) {
      return forbiddenError(res, "Materi");
    }

    await prisma.material.update({
      where: {
        id: material.id,
      },
      data: {
        attachments: {
          connect: {
            id: userInput.id,
          },
        },
      },
    });

    return postSuccess(res, "Lampiran");
  } catch (e) {
    return serverError(res);
  }
};

/**
 * Remove attachment
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const removeAttachments = async (req, res) => {
  const {
    success,
    error,
    data: userInput,
  } = attachmentValidator.safeParse(req.body);

  if (!success) {
    return validationError(res, error.format());
  }

  try {
    const material = await prisma.material.findFirst({
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

    if (!material) {
      return recordNotFound(res, "Materi");
    }

    if (material.classroom.creator_id !== req.user.id) {
      return forbiddenError(res, "Materi");
    }

    await prisma.material.update({
      where: {
        id: material.id,
      },
      data: {
        attachments: {
          disconnect: {
            id: userInput.id,
          },
        },
      },
    });

    return deleteSuccess(res, "Lampiran");
  } catch (e) {
    return serverError(res);
  }
};
