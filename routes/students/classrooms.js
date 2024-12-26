import { Router } from "express";

import * as classroomsController from "@controllers/students/classrooms.controller";
import auth from "@middlewares/auth";
import checkRole from "@middlewares/check-role";

const router = Router();

router.use([auth, checkRole("STUDENT")]);

router.get("/classrooms", classroomsController.getAll);

router.get("/classrooms/:id", classroomsController.getById);

router.patch("/classrooms/:id/join", classroomsController.joinClassroom);

router.patch("/classrooms/:id/quit", classroomsController.quitClassroom);

export default router;
