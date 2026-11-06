import express from "express";      //Creates and manages your backend server- 	The server framework
import bodyParser from "body-parser";//Parses incoming request bodies-	A data reader
import mongoose from "mongoose";     //	Connects to MongoDB and works with database data - 	Database assistant
import cors from "cors";            //	Controls cross-origin browser access - 	A permission mechanism
import dotenv from "dotenv";        //	Loads variables from .env - 	Configuration loader
import helmet from "helmet";        //	Adds security-related HTTP headers - Basic security layer
import morgan from "morgan";        //	Logs incoming HTTP requests - 	A request logger

// CONFIGURATIONS

dotenv.config();
const app=express(); 
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

//Mongoose setup

const PORT=process.env.PORT || 9000;
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("MongoDB connected successfully!");
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error);
    });