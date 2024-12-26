import { PrismaClientValidationError } from "@prisma/client/runtime/library";

import {
  addAttachmentValidator,
  editAttachmentDataValidator,
} from "@utils/validators/attachments";
import prisma from "@utils/prisma";
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
import { deleteFile } from "@utils/filesystem";

/**
 * Get all attachments
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getAll = async (req, res) => {
  try {
    // get query parameters
    const { orderBy = "filename", order = "asc" } = req.query;

    // get all attachments
    const attachments = await prisma.attachment.findMany({
      orderBy: {
        [orderBy]: order,
      },
      where: {
        uploader_id: req.user.id,
      },
    });

    // return 200 - ok
    return getSuccess(res, "Lampiran", attachments);
  } catch (e) {
    // data not found
    if (e instanceof PrismaClientValidationError) {
      // return 400 - bad request
      return queryError(res);
    }

    // return 500 - server error
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
  // get attachment by id
  const attachment = await prisma.attachment.findFirst({
    where: {
      id: parseInt(req.params.id),
      uploader_id: req.user.id,
    },
  });

  // data not found
  if (!attachment) {
    // return 404 - not found
    return recordNotFound(res, "Lampiran");
  }

  // return 200 - ok
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
    // delete file when validation error
    deleteFile("./storage/attachments/" + req.file.filename);

    // return 400 - bad request
    return validationError(res, error.format());
  }

  try {
    // create attachment
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
    });

    // return 201 - created
    return postSuccess(res, "Lampiran", attachment);
  } catch (e) {
    // delete file when cannot create data
    deleteFile("./storage/attachments/" + req.file.filename);

    // return 500 - server error
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
    // return 400 - bad request
    return validationError(res, error.format());
  }

  try {
    // find attachment from database
    const attachment = await prisma.attachment.findFirst({
      where: {
        id: parseInt(req.params.id),
      },
    });

    // data not found
    if (!attachment) {
      // return 404 - not found
      return recordNotFound(res, "Lampiran");
    }

    if (attachment.uploader_id !== req.user.id) {
      // if current user is not the attachment's uploader, return 403 - forbidden
      return forbiddenError(res, "Lampiran");
    }

    // update attachment
    const newAttachment = await prisma.attachment.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        filename: userInput.filename,
      },
    });

    // return 200 - ok
    return putSuccess(res, "Lampiran", newAttachment);
  } catch (e) {
    // return 500 - server error
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
    // find attachment
    const attachment = await prisma.attachment.findFirst({
      where: {
        id: parseInt(req.params.id),
      },
    });

    // data not found
    if (!attachment) {
      // return 404 - not found
      return recordNotFound(res, "Lampiran");
    }

    if (attachment.uploader_id !== req.user.id) {
      // if current user is not attachment's uploader, return 403 - forbidden
      return forbiddenError(res, "Lampiran");
    }

    // delete file from storage
    deleteFile("./storage/attachments/" + attachment.path);

    // delete data from database
    await prisma.attachment.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });

    // return 200 - ok
    return deleteSuccess(res, "Lampiran");
  } catch (e) {
    // return 500 - server error
    return serverError(res);
  }
};
