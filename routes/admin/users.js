import { Router } from "express";

import * as usersController from "@controllers/admin/users.controller";
import auth from "@middlewares/auth";
import checkRole from "@middlewares/check-role";

const router = Router();

router.use([auth, checkRole("ADMIN")]);

router.get("/users", usersController.getAll);

router.get("/users/:id", usersController.getById);

router.post("/users", usersController.create);

router.put("/users/:id", usersController.update);

router.delete("/users/:id", usersController.destroy);

export default router;
