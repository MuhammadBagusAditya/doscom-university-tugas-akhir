import { z } from "zod";
import { AssignmentStatus } from "@prisma/client";

export const createAssignmentValidator = z
  .object({
    name: z
      .string({ required_error: "Nama harus diisi" })
      .min(1, "Nama harus diisi")
      .trim(),
    description: z
      .string({ required_error: "Deskripsi harus diisi" })
      .min(1, "Deskripsi harus diisi"),
    status: z
      .string({ required_error: "Status harus diisi" })
      .min(1, "Status harus diisi"),
    classroom_id: z
      .number({ required_error: "ID Kelas harus diisi" })
      .min(1, "ID Kelas harus diisi"),
  })
  .refine(
    ({ status }) => {
      return status in AssignmentStatus;
    },
    {
      message: "Status tidak valid",
      path: ["status"],
    }
  );

export const updateAssignmentValidator = z
  .object({
    name: z
      .string({ required_error: "Nama harus diisi" })
      .min(1, "Nama harus diisi")
      .trim(),
    description: z
      .string({ required_error: "Deskripsi harus diisi" })
      .min(1, "Deskripsi harus diisi"),
    status: z
      .string({ required_error: "Status harus diisi" })
      .min(1, "Status harus diisi"),
  })
  .refine(
    ({ status }) => {
      return status in AssignmentStatus;
    },
    {
      message: "Status tidak valid",
      path: ["status"],
    }
  );
