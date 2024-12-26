import { z } from "zod";

import prisma from "@utils/prisma";

export const createUserValidator = z
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
    role: z
      .string({ required_error: "Role harus diisi" })
      .min(1, "Role harus diisi"),
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

export const updateUserValidator = z
  .object({
    id: z.number({
      required_error: "ID harus diisi",
    }),
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
    role: z
      .string({ required_error: "Role harus diisi" })
      .min(1, "Role harus diisi"),
  })
  .refine(
    async ({ id, email }) => {
      const user = await prisma.user.findFirst({
        select: {
          id: true,
        },
        where: {
          email,
        },
      });

      return user === null || user.id === id;
    },
    {
      message: "Email sudah terdaftar",
      path: ["email"],
    }
  );
