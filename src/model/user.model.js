import { model, Schema } from "mongoose";

import bcrypt from 'bcrypt'



const userschema= new Schema({
    name: {type:String,required:true},
    email: {type:String,required:true,unique:true},
    password: {type:String,required:true},
    pic:{
        type:String,
        default:'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
        
    }
})

userschema.pre('save',async function (next) {
    if (!this.isModified("password")) return next()

        this.password = await  bcrypt.hash(this.password,8)

    
})


export const userModel = model('User',userschema)