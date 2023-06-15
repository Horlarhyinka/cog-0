import express from "express";
import { sign_up, login, oauthRedirect} from "../controllers/auth.js";
import { useGoogleAuth } from "../config/oauth.google.config.js";
import passport from "passport";
const router = express.Router();

router.post('/signup', sign_up);
router.post('/login', login);
router.get('/google', useGoogleAuth)
router.get('/redirect',passport.authenticate("google"), oauthRedirect)

export default router;