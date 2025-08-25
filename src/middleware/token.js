import  Jwt  from "jsonwebtoken"
import { AppErr } from "./catcherr.js"
import { configDotenv } from "dotenv"
import { userModel } from "../model/user.model.js"

configDotenv()
export const generatToken=(load)=>{
      let token = Jwt.sign(load,process.env.SECRET_KEY)
      return token

}
export const verifyToken = async (req, res, next) => {
  
    // تحقق من وجود التوكن
    const token = req.headers.token || req.headers.authorization;

    if (!token) {
      return next(new AppErr('Token is required', 401));
    }

    // فك تشفير التوكن
    const decoded = Jwt.verify(token, process.env.SECRET_KEY);

    if (!decoded?.id) {
      return next(new AppErr('Invalid token payload', 401));
    }

    // البحث عن المستخدم
    const user = await userModel.findById(decoded.id).select('-password');
    if (!user) {
      return next(new AppErr('User not found', 404));
    }

    // إضافة المستخدم للطلب
    req.user = user;
    next();
   }