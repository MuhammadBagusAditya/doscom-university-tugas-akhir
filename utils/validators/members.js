import { z } from "zod";

export const memberValidator = z.object({
  user_id: z.array(
    z.number({ required_error: "ID harus diisi" }).min(1, "ID harus diisi"),
    {
      message: "Harus berupa array",
    }
  ),
});
