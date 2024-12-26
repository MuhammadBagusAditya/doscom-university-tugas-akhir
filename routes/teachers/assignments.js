import { Router } from "express";

import * as assignmentsController from "@controllers/teachers/assignments.controller";
import editUserAssignmentGrade from "@controllers/teachers/editUserAssignmentGrade.controller";

import auth from "@middlewares/auth";
import checkRole from "@middlewares/check-role";

const router = Router();

router.use([auth, checkRole("TEACHER")]);

router.get("/assignments", assignmentsController.getAll);

router.get("/assignments/:id", assignmentsController.getById);

router.post("/assignments", assignmentsController.create);

router.put("/assignments/:id", assignmentsController.update);

router.delete("/assignments/:id", assignmentsController.destroy);

router.patch(
  "/assignments/:id/add-attachment",
  assignmentsController.addAttachment
);

router.patch(
  "/assignments/:id/remove-attachment",
  assignmentsController.removeAttachment
);

router.patch("/assignments/:id/edit-grade", editUserAssignmentGrade);

export default router;
