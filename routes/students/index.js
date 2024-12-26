import { Router } from "express";

import classrooms from "@routes/students/classrooms";
import attachments from "@routes/students/attachments";
import materials from "@routes/students/materials";
import assignments from "@routes/students/assignments";

const router = Router();

router.use("/students", [classrooms, attachments, materials, assignments]);

export default router;
