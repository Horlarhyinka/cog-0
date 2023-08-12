import { Router } from "express";
import * as locationServices from "../../controllers/services/location.js"

const router = Router()

router.get("/states", locationServices.getStates)
router.get("/states/:state/lgas", locationServices.getLgas)
router.get("/states/:state/towns", locationServices.getTowns)

export default router;
