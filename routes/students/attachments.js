import { Router } from "express";

import * as attachmentsController from "@controllers/students/attachments.controller";
import auth from "@middlewares/auth";
import checkRole from "@middlewares/check-role";
import { uploadAttachment } from "@utils/multer";

const router = Router();

router.use([auth, checkRole("STUDENT")]);

router.get("/attachments", attachmentsController.getAll);

router.get("/attachments/:id", attachmentsController.getById);

router.post(
  "/attachments",
  uploadAttachment.single("file"),
  attachmentsController.create
);

router.patch("/attachments/:id", attachmentsController.update);

router.delete("/attachments/:id", attachmentsController.destroy);

export default router;
