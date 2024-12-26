import { Router } from "express";

import * as materialsController from "@controllers/teachers/materials.controller";
import auth from "@middlewares/auth";
import checkRole from "@middlewares/check-role";

const router = Router();

router.use([auth, checkRole("TEACHER")]);

router.get("/materials", materialsController.getAll);

router.get("/materials/:id", materialsController.getById);

router.post("/materials", materialsController.create);

router.put("/materials/:id", materialsController.update);

router.delete("/materials/:id", materialsController.destroy);

router.patch(
  "/materials/:id/add-attachment",
  materialsController.addAttachments
);

router.patch(
  "/materials/:id/remove-attachment",
  materialsController.removeAttachments
);

export default router;
