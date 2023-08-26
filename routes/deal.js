import {Router} from "express";
import * as deal from "../controllers/deals.js";
import authenticateUser from "../middleware/authentication.js";

const router = Router()

router.post("/", authenticateUser, deal.addProspect)

export default router;