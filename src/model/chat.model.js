import { model, Schema } from "mongoose";



const chatschem= new Schema({
    chatname:{
        type:String,
        required:true,

    },
    isGroup:{
        type:Boolean,
        default:false
    },
    users:[
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    latestMessage:{
        type: Schema.Types.ObjectId,
        ref: 'Message',
    },
    groupAdmin:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
},{
    timestamps:true,

})
export const chatModel=  model('chat',chatschem)