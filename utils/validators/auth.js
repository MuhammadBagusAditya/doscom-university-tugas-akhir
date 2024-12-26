import { z } from "zod";

import prisma from "@utils/prisma";

export const registerValidator = z
  .object({
    username: z
      .string({ required_error: "Username harus diisi" })
      .min(1, "Username harus diisi")
      .trim(),
    email: z
      .string({ required_error: "Email harus diisi" })
      .min(1, "Email harus diisi")
      .email("Email tidak valid"),
    password: z
      .string({ required_error: "Password harus diisi" })
      .min(8, "Password minimal 8 karakter"),
    confirm_password: z
      .string({ required_error: "Password harus dikonfirmasi" })
      .min(1, "Password harus dikonfirmasi"),
  })
  .refine(({ password, confirm_password }) => password === confirm_password, {
    message: "Konfirmasi password harus sama dengan Password",
    path: ["confirm_password"],
  })
  .refine(
    async ({ email }) => {
      const user = await prisma.user.findFirst({
        select: {
          id: true,
        },
        where: {
          email,
        },
      });

      return user === null;
    },
    {
      message: "Email sudah terdaftar",
      path: ["email"],
    }
  );

export const loginValidator = z.object({
  email: z
    .string({ required_error: "Email harus diisi" })
    .min(1, "Email harus diisi")
    .email("Email tidak valid"),
  password: z
    .string({ required_error: "Password harus diisi" })
    .min(1, "Password harus diisi"),
});
