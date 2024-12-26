import { Router } from "express";

import * as classroomsController from "@controllers/teachers/classrooms.controller";
import auth from "@middlewares/auth";
import checkRole from "@middlewares/check-role";

const router = Router();

router.use([auth, checkRole("TEACHER")]);

router.get("/classrooms", classroomsController.getAll);

router.get("/classrooms/:id", classroomsController.getById);

router.post("/classrooms", classroomsController.create);

router.put("/classrooms/:id", classroomsController.update);

router.delete("/classrooms/:id", classroomsController.destroy);

router.patch("/classrooms/:id/add", classroomsController.addMembers);

router.patch("/classrooms/:id/remove", classroomsController.removeMembers);

export default router;
