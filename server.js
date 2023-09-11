
import 'express-async-errors';
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import mongoose from 'mongoose';
import connectDB from "./config/db.js"; 
import useRouters from "./startup/routes.js"
import useMiddlewares from "./startup/middlewares.js";

dotenv.config();
const app = express();

const {JWT_SECRET, NODE_ENV, PORT} = process.env;
const port = Number(process.env.PORT)
useMiddlewares(app)
// routes middleware
useRouters(app)
mongoose.set('strictQuery', true);
if (NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

async function start(){
  try{

await connectDB()
console.log("connected to db")
app.listen(port,()=>{
  console.log(`server running ${process.env.NODE_ENV} mode on port ${port}...`)
})
  }catch(ex){
    console.log("server failed to start: >>>",ex)
  }
}
start()