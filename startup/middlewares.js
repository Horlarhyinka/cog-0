import express from "express";
import dotenv from "dotenv";
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import MongoStore from 'connect-mongo';

dotenv.config()

export default function(app){
app.use(cors({
  origin: ["http://localhost:3000", process.env.APP_UI_URL]
}))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());
app.use(cookieParser(process.env.SECRET));
app.use(session({
  secret: String(process.env.SECRET),
  store: new MongoStore({
    collectionName: "sessions",
    mongoUrl: process.env.DB_URI
  }),
  saveUninitialized: true,
  resave: false
}))
app.use(passport.session())
app.use(passport.initialize())
}