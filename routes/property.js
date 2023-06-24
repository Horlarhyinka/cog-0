import * as property from "../controllers/property.js";
import {Router} from "express";
import authenticateUser from "../middleware/authentication.js"
import validateObjectId from "../middleware/validateObjectId.js";
const router = Router()
router.get("/", property.getProperties)
router.get("/:id", validateObjectId, property.getProperty)
router.use(authenticateUser)
router.post("/", property.createProperty)
router.delete("/:id", validateObjectId, property.deleteProperty)
router.put("/:id",validateObjectId, property.updateProperty)
router.put("/:id/status", validateObjectId, property.updateStatus)


export default router