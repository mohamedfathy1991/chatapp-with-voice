import mongoose, { model, Schema } from "mongoose";



const messageschema= new Schema({
    sender:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    contents:{
        type:String,
        trim:true
    },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "chat" }
},{
    timestamps:true,

})
export const messageModel=  model('Message',messageschema)