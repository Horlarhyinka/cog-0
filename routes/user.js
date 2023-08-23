import { Router } from "express";
import * as user from "../controllers/users.js";
import authenticateUser from "../middleware/authentication.js"


const router = Router()

router.use(authenticateUser)
router.get("/", user.getProfile)
router.put("/", user.updateProfile)

export default router;