import { z } from "zod";

import prisma from "@utils/prisma";
import { putSuccess, serverError, validationError } from "@utils/messages";

// validation schema
const validator = z.object({
  username: z
    .string({ required_error: "Username harus diisi" })
    .min(1, "Username harus diisi")
    .trim(),
  attachment_id: z
    .number({ required_error: "Avatar harus diisi" })
    .min(1, "Avatar harus diisi"),
});

/**
 * Edit profile
 *
 * @param {import("express").Request} req
 * @param {import('express').Response} res
 */
export default async function (req, res) {
  const { success, error, data: userInput } = validator.safeParse(req.body);

  if (!success) {
    // return 400 - bad request
    return validationError(res, error.format());
  }

  try {
    // if user has avatar, update the data.
    if (req.user.avatar_id) {
      await prisma.avatar.update({
        where: {
          id: req.user.avatar_id,
        },
        data: {
          attachment_id: userInput.attachment_id,
        },
      });
    } else {
      // create new avatar data
      const avatar = await prisma.avatar.create({
        data: {
          attachment_id: userInput.attachment_id,
        },
      });

      // connect the user with avatar data
      await prisma.user.update({
        where: {
          id: req.user.id,
        },
        data: {
          avatar_id: avatar.id,
        },
      });
    }

    // update user's username
    await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        username: userInput.username,
      },
    });

    // return 200 - ok
    return putSuccess(res, "Profil");
  } catch (e) {
    // return 500 - server error
    return serverError(res);
  }
}
