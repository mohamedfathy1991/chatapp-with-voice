import { AppErr } from "../../middleware/catcherr.js"
import { generatToken } from "../../middleware/token.js"
import { userModel } from "../../model/user.model.js"
import bcrypt from 'bcrypt'




export const logIn=async(req,res,next)=>{

    const {email,password}=req.body
     if(!email||!password){

        next(new AppErr('ENTER FULL fileds',400))
     }

     const userexist= await userModel.findOne({email}) 

     if(!userexist) next(new AppErr('user not found',400))
        const matchpassword = await bcrypt.compare(password,userexist.password)
    if(!matchpassword) next(new AppErr('password in correct',400))
    const token = generatToken({id:userexist.id})

    res.status(200).json({
        message:"succes",
        user:userexist,
        token
    })



}
export const register=async(req,res,next)=>{
    const {name,email,password,pic}=req.body
    if(!name||!email||!password){

        next(new AppErr('ENTER FULL fileds',400))
     }

     const userexist= await userModel.findOne({email}) 
     if(userexist) next ( new AppErr('user exist ',409))
        const user = await userModel.create({
    name,email,password,
    pic
    }) 

    const token = generatToken({id:user.id})

    res.status(201).json({
        message:"user created",
        user,token
    })




}

export const alluser= async(req,res,next)=>{
    
       const keyword = req.query.search
      
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } },
        ],
      }
    : {};
    const users = await userModel.find(keyword).find({ _id: { $ne: req?.user?._id } }); // exclude current user
    res.json(users);

  

} 