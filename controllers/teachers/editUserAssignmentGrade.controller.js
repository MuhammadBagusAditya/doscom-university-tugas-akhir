import { z } from "zod";

import prisma from "@utils/prisma";
import {
  putSuccess,
  recordNotFound,
  serverError,
  validationError,
} from "@utils/messages";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";

const validator = z.object({
  grade: z
    .number({ required_error: "Nilai harus diisi" })
    .min(0, "Nilai harus lebih dari 0"),
  member_id: z
    .number({
      required_error: "ID Member harus diisi",
    })
    .min(1, "ID Member harus diisi"),
});

/**
 * Edit user assignment grade
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export default async function (req, res) {
  const { success, error, data: userInput } = validator.safeParse(req.body);

  if (!success) {
    return validationError(res, error.format());
  }

  try {
    const userAssignment = await prisma.userAssignment.findFirstOrThrow({
      where: {
        user_id: userInput.member_id,
        assignment_id: parseInt(req.params.id),
      },
    });

    await prisma.userAssignment.update({
      where: {
        id: userAssignment.id,
      },
      data: {
        grade: userInput.grade,
      },
    });

    return putSuccess(res, "Nilai");
  } catch (e) {
    // data not found
    if (e instanceof PrismaClientValidationError) {
      return recordNotFound(res, "Penugasan");
    }

    return serverError(res);
  }
}
