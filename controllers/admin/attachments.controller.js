import { PrismaClientValidationError } from "@prisma/client/runtime/library";

import {
  addAttachmentValidator,
  editAttachmentDataValidator,
} from "@utils/validators/attachments";
import prisma from "@utils/prisma";
import {
  deleteSuccess,
  getSuccess,
  postSuccess,
  putSuccess,
  queryError,
  recordNotFound,
  serverError,
  validationError,
} from "@utils/messages";
import { deleteFile } from "@utils/filesystem";

/**
 * Get all attachments
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getAll = async (req, res) => {
  // get query parameters
  const { orderBy = "filename", order = "asc" } = req.query;

  try {
    // get all attachments include uploader
    const attachments = await prisma.attachment.findMany({
      orderBy: {
        [orderBy]: order,
      },
      include: {
        uploader: {
          omit: {
            password: true,
          },
        },
      },
    });

    // return 200 - OK
    return getSuccess(res, "Lampiran", attachments);
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
 * Get one attachment by id
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 *
 */
export const getById = async (req, res) => {
  // get attachment by id include uploader
  const attachment = await prisma.attachment.findFirst({
    where: {
      id: parseInt(req.params.id),
    },
    include: {
      uploader: {
        omit: {
          password: true,
        },
      },
    },
  });

  // Attachment not found
  if (!attachment) {
    // return 404 - Not found
    return recordNotFound(res, "Lampiran");
  }

  // return 200 - OK
  return getSuccess(res, "Lampiran", attachment);
};

/**
 * Create new attachment
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
  } = addAttachmentValidator.safeParse({
    ...req.body,
    file: req.file,
  });

  // validation error
  if (!success) {
    // Delete file when validation error
    deleteFile("./storage/attachments/" + req.file.filename);

    // return 400 - Bad request
    return validationError(res, error.format());
  }

  try {
    // create attachment and return with uploader
    const attachment = await prisma.attachment.create({
      data: {
        filename:
          userInput.filename?.length > 0
            ? userInput.filename
            : req.file.filename,
        path: req.file.filename,
        uploader_id: req.user.id,
        file_size: req.file.size,
        file_type: req.file.mimetype,
      },
      include: {
        uploader: {
          omit: {
            password: true,
          },
        },
      },
    });

    // return 201 - Created
    return postSuccess(res, "Lampiran", attachment);
  } catch (e) {
    // delete file when cannot create data
    deleteFile("./storage/attachments/" + req.file.filename);

    // return 500 - Server error
    return serverError(res);
  }
};

/**
 * Update attachment data
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 *
 */
export const update = async (req, res) => {
  const {
    success,
    data: userInput,
    error,
  } = editAttachmentDataValidator.safeParse(req.body);

  // validation error
  if (!success) {
    // return 400 - Bad request
    return validationError(res, error.format());
  }

  try {
    // Update attachment and return with uploader
    const attachment = await prisma.attachment.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        filename: userInput.filename,
      },
      include: {
        uploader: {
          omit: {
            password: true,
          },
        },
      },
    });

    // return 200 - OK
    return putSuccess(res, "Lampiran", attachment);
  } catch (e) {
    // data not found
    if (e instanceof PrismaClientValidationError) {
      // return 404 - Not found
      return recordNotFound(res, "Lampiran");
    }

    // return 500 - Server error
    return serverError(res);
  }
};

/**
 * Delete attachment
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 *
 */
export const destroy = async (req, res) => {
  try {
    // Get attachment by id
    const attachment = await prisma.attachment.findFirst({
      where: {
        id: parseInt(req.params.id),
      },
    });

    // Attachment not found
    if (!attachment) {
      // return 404 - Not found
      return recordNotFound(res, "Lampiran");
    }

    // Delete file
    deleteFile("./storage/attachments/" + attachment.path);

    // Delete it from database
    await prisma.attachment.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });

    // return 200 - OK
    return deleteSuccess(res, "Lampiran");
  } catch (e) {
    // error when delete file
    return serverError(res);
  }
};
