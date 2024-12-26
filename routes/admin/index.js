import { Router } from "express";

import users from "@routes/admin/users";
import classrooms from "@routes/admin/classrooms";
import attachments from "@routes/admin/attachments";
import materials from "@routes/admin/materials";
import assignments from "@routes/admin/assignments";

const router = Router();

router.use("/admin", [users, classrooms, attachments, materials, assignments]);

export default router;
