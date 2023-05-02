import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import 'express-async-errors';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import path from 'path';
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import logger from 'morgan';
import bodyParser from 'body-parser';
import pug from 'pug';
import connectDB from "./config/db.js";

dotenv.config();
const app = express();

const PORT = Number(process.env.PORT)

mongoose.set('strictQuery', true);


if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

async function start(){
  try{

await connectDB()
console.log("connected to db")
app.listen(PORT,()=>{
  console.log(`server running ${process.env.NODE_ENV} mode on port ${PORT}`)
})
  }catch(ex){
    console.log("server failed to start: ",ex)
  }

}
start()