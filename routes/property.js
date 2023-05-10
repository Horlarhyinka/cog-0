import * as property from "../controllers/property.js";
import {Router} from "express";
const router = Router()

router.post("/", property.createProperty)
router.get("/", property.getProperties)
router.get("/:id", property.getProperty)

export default router