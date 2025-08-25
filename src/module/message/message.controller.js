import { AppErr } from "../../middleware/catcherr.js"
import { chatModel } from "../../model/chat.model.js"
import { messageModel } from "../../model/message.js"
import { userModel } from "../../model/user.model.js"

export const createMessage=async(req,res,next)=>{
   console.log(req.user)

    const {content,chatid}=req.body
    if(!content && !chatid){
        next (new AppErr('PLEASE SEND CONTENT AND CHATID',400))
    }
    const newmessage= new messageModel({
        sender:req.user._id,
        chat:chatid,
        contents:content
    })
    await newmessage.save()
   let   msg = await newmessage.populate("sender", "name email"); 
   msg = await msg.populate({
  path: "chat",
  populate: {
    path: "users",
    select: "name email", // الحقول اللي عايزها من الـ User
  },
});
await chatModel.findByIdAndUpdate(req.user.id,{
    latestMessage:msg
})

res.status(201).json(msg);



}
export const getMessage=async (req,res,next)=>{
  const {chatid}= req.params
 const allmessages = await messageModel.find({chat:chatid}).populate('sender','name email pic')
 .populate('chat')
res.status(200).json(allmessages)
}
 