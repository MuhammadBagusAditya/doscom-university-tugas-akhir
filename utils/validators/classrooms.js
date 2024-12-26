import { z } from "zod";

export const createClassroomValidator = z.object({
  name: z
    .string({ required_error: "Nama harus diisi" })
    .min(1, "Nama harus diisi")
    .trim(),
  description: z
    .string({ required_error: "Deskripsi harus diisi" })
    .min(1, "Deskripsi harus diisi"),
  thumbnail_id: z
    .number({ required_error: "Thumbnail harus diisi" })
    .min(1, "Thumbnail harus diisi"),
});

export const updateClassroomValidator = z.object({
  name: z
    .string({ required_error: "Nama harus diisi" })
    .min(1, "Nama harus diisi")
    .trim(),
  description: z
    .string({ required_error: "Deskripsi harus diisi" })
    .min(1, "Deskripsi harus diisi"),
  thumbnail_id: z
    .number({ required_error: "Thumbnail harus diisi" })
    .optional(),
});
