import { Router } from "express";
import * as user from "../controllers/users"


const router = Router()

router.get("/", user.getProfile)
router.put("/", user.updateProfile)

export default router;