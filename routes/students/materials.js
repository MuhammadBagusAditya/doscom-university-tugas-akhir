import { Router } from "express";

import * as materialsController from "@controllers/students/materials.controller";
import auth from "@middlewares/auth";
import checkRole from "@middlewares/check-role";

const router = Router();

router.use([auth, checkRole("STUDENT")]);

router.get("/materials", materialsController.getAll);

router.get("/materials/:id", materialsController.getById);

export default router;
