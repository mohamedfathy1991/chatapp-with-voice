import { Router } from "express";
import { alluser, logIn, register } from "./user.controller.js";
import asyncHandler from "express-async-handler"
import { errhandle } from "../../middleware/catcherr.js";
import { verifyToken } from "../../middleware/token.js";

export  const userRoute = Router()


userRoute.post('/login',   errhandle( logIn))
userRoute.post('/register',   errhandle( register))
userRoute.get('/', errhandle(verifyToken),  errhandle( alluser))

