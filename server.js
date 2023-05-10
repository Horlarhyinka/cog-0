import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import 'express-async-errors';
import mongoose from 'mongoose';
import connectDB from "./config/db.js";
import propertyRoutes from "./routes/property.js"
dotenv.config();
const app = express();

const PORT = Number(process.env.PORT)

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())

app.use("/api/v1/properties", propertyRoutes)

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
    console.log("server failed to start: >>>",ex)
  }
}
start()