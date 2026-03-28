import { asynchandler } from "../utils/asynchandler.js";
import { apierror } from "../utils/apierror.js";
import jwt from "jsonwebtoken"
import { User } from "../models/usermodel.js";

export const verifyjwt =asynchandler(async(req,res,next)=>{
    try {
    const token =  req.cookies.accesstoken|| req.header("Authorization")?.replace("Bearer ", "")
    console.log("token",token)
    console.log("req.cookie",req.cookies);
    console.log("header",req.header);
    if(!token){
        throw new apierror(401,"unothorized request token not avalible ")
    }
const decoded =jwt.verify(token, process.env.JWT_SECRET )
    const user = await User.findById(decoded?.id).select("-password -refreshtoken")
    if(!user){
        throw new apierror(401,"invalid acees token")
    }
    // req.token=token
    req.user =user;
    next()
    } catch (error) {
        throw new apierror(401, error?.message || "Invalid access token")
    }

})