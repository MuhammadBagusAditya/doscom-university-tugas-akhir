import { Router } from "express";

import * as assignmentsController from "@controllers/students/assignments.controller";
import auth from "@middlewares/auth";
import checkRole from "@middlewares/check-role";

const router = Router();

router.use([auth, checkRole("STUDENT")]);

router.get("/assignments", assignmentsController.getAll);

router.get("/assignments/:id", assignmentsController.getById);

router.patch(
  "/assignments/:id/add-attachment",
  assignmentsController.addAttachment
);

router.patch(
  "/assignments/:id/remove-attachment",
  assignmentsController.removeAttachment
);

export default router;
