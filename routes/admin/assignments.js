import { Router } from "express";

import * as assignmentsController from "@controllers/admin/assignments.controller";
import auth from "@middlewares/auth";
import checkRole from "@middlewares/check-role";

const router = Router();

router.use([auth, checkRole("ADMIN")]);

router.get("/assignments", assignmentsController.getAll);

router.get("/assignments/:id", assignmentsController.getById);

router.delete("/assignments/:id", assignmentsController.destroy);

export default router;
