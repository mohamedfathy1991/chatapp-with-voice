import { configDotenv } from "dotenv";
import mongoose from "mongoose";
configDotenv()

const mongoDB = process.env.DATABASE_URL||'mongodb+srv://amir:123@cluster0.n7j1wak.mongodb.net/chat';
 

 
 mongoose.connect(mongoDB, { useNewUrlParser: true }).then(()=>{
      console.log("Connected to MongoDB database succes")
}).catch(err=>{
      console.log("Error connecting to MongoDB database", err)
})
 //Get the default connection
