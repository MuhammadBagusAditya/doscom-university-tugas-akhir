import { Router } from "express";

import classrooms from "@routes/teachers/classrooms";
import materials from "@routes/teachers/materials";
import assignments from "@routes/teachers/assignments";
import attachments from "@routes/teachers/attachments";

const router = Router();

router.use("/teachers", [classrooms, materials, assignments, attachments]);

export default router;
