import { Router } from "express";

import * as materialsController from "@controllers/admin/materials.controller";
import auth from "@middlewares/auth";
import checkRole from "@middlewares/check-role";

const router = Router();

router.use([auth, checkRole("ADMIN")]);

router.get("/materials", materialsController.getAll);

router.get("/materials/:id", materialsController.getById);

router.delete("/materials/:id", materialsController.destroy);

export default router;
