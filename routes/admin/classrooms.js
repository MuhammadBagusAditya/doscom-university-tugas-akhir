import { Router } from "express";

import * as classroomsController from "@controllers/admin/classrooms.controller";
import auth from "@middlewares/auth";
import checkRole from "@middlewares/check-role";

const router = Router();

router.use([auth, checkRole("ADMIN")]);

router.get("/classrooms", classroomsController.getAll);

router.get("/classrooms/:id", classroomsController.getById);

router.delete("/classrooms/:id", classroomsController.destroy);

export default router;
