import { Router } from "express";
import { verifyToken } from "../../middleware/token.js";
import { errhandle } from "../../middleware/catcherr.js";
import { createMessage, getMessage } from "./message.controller.js";
 


export const messageroute= Router()

messageroute.post('/', errhandle( verifyToken),errhandle(createMessage))
messageroute.get('/:chatid', errhandle( verifyToken),getMessage)
 


