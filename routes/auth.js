import express from "express";
import { sign_up, login, oauthRedirect, resetPasswordRequest, resetPassword} from "../controllers/auth.js";
import { useGoogleAuth } from "../config/oauth.google.config.js";
import passport from "passport";
const router = express.Router();

router.post('/register', sign_up);
router.post('/login', login);
router.post('/forget-password', resetPasswordRequest)
router.patch('/reset-password/:token', resetPassword)
router.get('/google', useGoogleAuth)
router.get('/redirect',passport.authenticate("google"), oauthRedirect)

export default router;