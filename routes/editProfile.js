import { Router } from "express";

import editProfile from "@controllers/profile/editProfile";
import auth from "@middlewares/auth";

const router = Router();

router.use([auth]);

router.patch("/profile", editProfile);

export default router;
