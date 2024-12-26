import config from "@config";
import { z } from "zod";

export const attachmentValidator = z.object({
  id: z
    .number({ required_error: "ID Lampiran harus diisi" })
    .min(1, "ID Lampiran harus diisi"),
});

export const addAttachmentValidator = z.object({
  filename: z.string({ required_error: "Nama file harus diisi" }).optional(),
  file: z
    .object({
      mimetype: z.string(),
      size: z.number(),
      filename: z.string(),
    })
    .refine(({ mimetype }) => config.file.allowedTypes.includes(mimetype), {
      message: "Tipe file tidak diperbolehkan",
      path: ["file"],
    })
    .refine(({ size }) => size <= config.file.limitSize, {
      message: "File terlalu besar",
      path: ["file"],
    }),
});

export const editAttachmentDataValidator = z.object({
  filename: z
    .string({ required_error: "Nama file harus diisi" })
    .min(1, "Nama file harus diisi"),
});
