import { z } from "zod";

export const createMaterialValidator = z.object({
  name: z
    .string({ required_error: "Nama harus diisi" })
    .min(1, "Nama harus diisi")
    .trim(),
  description: z
    .string({ required_error: "Deskripsi harus diisi" })
    .min(1, "Deskripsi harus diisi"),
  classroom_id: z
    .number({ required_error: "ID Kelas harus diisi" })
    .min(1, "ID Kelas harus diisi"),
});

export const updateMaterialValidator = z.object({
  name: z
    .string({ required_error: "Nama harus diisi" })
    .min(1, "Nama harus diisi")
    .trim(),
  description: z
    .string({ required_error: "Deskripsi harus diisi" })
    .min(1, "Deskripsi harus diisi"),
});
