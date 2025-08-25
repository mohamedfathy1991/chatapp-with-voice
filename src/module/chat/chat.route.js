import { Router } from "express";
import { verifyToken } from "../../middleware/token.js";
import { errhandle } from "../../middleware/catcherr.js";
import { accesschat, addtoGroup, createGroup, fetchchat, getchat, removefromGroup, renameGroup } from "./chat.controller.js";



export const charRoute= Router()

charRoute.get('/', errhandle( verifyToken),fetchchat)
charRoute.post('/', errhandle( verifyToken),accesschat)
 charRoute.post('/group', errhandle( verifyToken),createGroup)
 charRoute.put('/rename', errhandle( verifyToken),renameGroup)
 charRoute.put('/removechat', errhandle( verifyToken),removefromGroup)
 charRoute.post('/addtogroup', errhandle( verifyToken),addtoGroup)


