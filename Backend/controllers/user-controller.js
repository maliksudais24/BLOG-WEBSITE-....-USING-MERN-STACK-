import { asynchandler } from "../utils/asynchandler.js";
import { apierror } from "../utils/apierror.js";
import { apiresponse } from "../utils/apiresponse.js";
import jwt ,{decode} from "jsonwebtoken"
import { User } from "../models/usermodel.js";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import { uploadfile } from "../utils/cloud.js";


const generateaccessandrefreshtoken = async (userid)=>{
    try {
        console.log("🔍 DEBUG: generateaccessandrefreshtoken called with userid:", userid);
        const user = await User.findById(userid);
        console.log("🔍 DEBUG: User found:", user ? "YES" : "NO");
        
        if (!user) {
            throw new Error("User not found with id: " + userid);
        }
        
        const accesstoken = await user.jettoken();
        console.log("🔍 DEBUG: Access token generated:", accesstoken ? "YES" : "NO");
        
        const refreshtoken = await user.generaterefreshtoken();
        console.log("🔍 DEBUG: Refresh token generated:", refreshtoken ? "YES" : "NO");
        
        user.refreshtoken=refreshtoken;
        await user.save({validateBeforeSave:false});
        console.log("🔍 DEBUG: User saved successfully");
        
        return {accesstoken,refreshtoken};
    } catch (error) {
        console.error("🔍 DEBUG ERROR in generateaccessandrefreshtoken:", error.message);
         throw new apierror(500,"genrate acees and the refresh token is not found ");
    }
}

const Signupuser = asynchandler(async(req,res)=>{
//get the user detail
console.log('Request body:', req.body);

const {email, username , fullname , password } = req.body
if([
    fullname,username,email,password
].some((field)=>
    field?.trim()===""
) ){
    throw new apierror(400,"ALL fileds are required")
}
const existeduser = await User.findOne({
    $or:[{username},{email}]
})
if(existeduser){
    throw new apierror(400,"user already register")
}

const userdb = await User.create({
    email,
    fullname,
    username,
    password
})

const createuser = await User.findById(userdb.id).select(
    "-password -refreshtoken"
)
 if(!createuser){
    throw new apierror(500,"something went wrong while registring the user")
 }
   return res.status(201).json(
    new apiresponse(200,createuser,"user registered succesfully")
   )
})

const loginuser = asynchandler(async(req,res)=>{
    const {username , email , password} = req.body

    if(!(username|| email )){
        throw new apierror(400,"enter you email or username")
    }
    const user = await User.findOne({
        $or:[{username},{email}]
    })
    if(!user){
        throw new apierror(400,"user not exsist")
    }
    const passwordvalidation = await user.isPasswordCorrect(password)

    if(!passwordvalidation){
    throw new apierror(404,"invalid cardetions")
}
const tokens = await generateaccessandrefreshtoken(user._id); // Store tokens in a variable
const { accesstoken, refreshtoken } = tokens;

console.log("Access Token:", accesstoken); // Log the access token
console.log("Refresh Token:", refreshtoken);

const logedinuser = await User.findById(user.id).select("-password -refreshtoken")
console.log("user loged in",logedinuser)
const options = {
    httpOnly: true,
    secure: true
}
return res.status(200).cookie("accesstoken",accesstoken,options).cookie("refreshtoken",refreshtoken,options).json(new apiresponse(200,
{
    User:logedinuser,accesstoken:accesstoken,refreshtoken:refreshtoken
}
,"user logged in succesfully "))
})
const logoutuser = asynchandler(async (req, res) => {
    console.log("Logout request received for user:", req.user?.id); // Log user ID

    // Remove refreshToken from the database
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
            $unset: { refreshtoken: 1 } // This removes the refreshToken field from the document
        },
        { new: true }
    );

    console.log("Updated user after logout:", updatedUser); // Log the updated user data

    const options = {
        httpOnly: true,
        secure: true
    };

    // Clear cookies and send the response
   return  res.clearCookie("accesstoken", options)
       .clearCookie("refreshtoken", options)
       .status(200)
       .json(new apiresponse(200, {}, "User logged out"));
})

const refreshaccesstoken = asynchandler(async(req,res)=>{
const incomingrefreshtoken = req.cookies.refreshtoken||req.body.refreshtoken
console.log(incomingrefreshtoken);
console.log(req.cookies);


if(!incomingrefreshtoken){
    throw new apierror(401,"unothorizeed request ")
}
try {
const decoded = jwt.verify(incomingrefreshtoken,process.env.REFRESH_TOKEN_SECRET)
    console.log(decoded);
    
    
    const user = await User.findById(decoded?.id)
    console.log(user);
    
    if(!user){
        throw new apierror(401,"invalid refresh token ")
    }
    if(incomingrefreshtoken !== user?.refreshtoken){
        throw new apierror(401,"invalid refresh token")
    }
    const options={
    httpOnly:true,
    secure:true
    }
    
    const {accesstoken,newrefreshtoken} = await generateaccessandrefreshtoken(user.id)
    
    res.status(200).cookie("accesstoken",accesstoken,options).cookie("refreshtoken",newrefreshtoken,options).json(new apiresponse(200,{
        accesstoken,refreshToken: newrefreshtoken
    },"access token refreshed "))
} catch (error) {
    throw new apierror(402,error?.message|| "accesstoken not refreshed successfully")
}
})

const changepassword = asynchandler(async(req,res)=>{
const {oldpassword,newpassword,confirmpassword}= req.body
if(!(newpassword===confirmpassword)){
throw new apierror(400,"invalid newpassword")
}
const user = await User.findById(req.user?.id)
const passwordcheck= await user.isPasswordCorrect(oldpassword)
if(!passwordcheck){
    throw new apierror(400,"old password is incorrect")
}
user.password = newpassword
await user.save({validateBeforeSave:false})
return res.status(200).json(new apiresponse(200,{},"password changed"))
})

const getcurrentuser = asynchandler(async(req,res)=>{
    return res.status(200).json(new apiresponse(200,req.user?.id,"current user fetch successfully "))
})

const uploadavatar = asynchandler (async(req,res)=>{
    const avatarupload = req.file?.path
    if(!avatarupload){
        throw new apierror(400,"avatar file is required")
    }
    const avatr = await uploadfile(avatarupload)
    if(!avatr.url){
        throw new apierror(500,"avatar  not uploaded")
    }
    const user = await User.findByIdAndUpdate(req.user?.id,{
        $set:{
            avatr:avatr.url,
        }
    },{new:true}).select("-password")
    return res.status(200).json(new apiresponse(200,user,"avatar uploaded successfully"))
})
const updateinformation = asynchandler(async(req,res)=>{
    const {fullname,email} = req.body
    if(!(fullname||email)){
        throw new apierror(400," update all fileds ")
    }
    const user = await User.findByIdAndUpdate(req.user?.id,{
        $set:{
            fullname:fullname,
            email:email
        }
    },{new:true}).select("-password")
    return res.status(200).json(new apiresponse(200,user,"your information is updated "))

})
const sendResetCode = asynchandler(async(req,res)=>{
    const {email} = req.body
    if(!email){
        throw new apierror(400,"email is required")
    }
    const user = await User.findOne({email})
    if(!user){
        throw new apierror(404,"user not found")
    }
    // Generate a 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString()
const resetToken = jwt.sign({resetCode}, process.env.JWT_SECRET, {expiresIn: '10m'})

    user.resetToken = resetToken
    user.resetTokenExpiry = Date.now() + 10 * 60 * 1000 // 10 minutes
    await user.save({validateBeforeSave:false})

    // Send email with reset code
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Code - Password Manager',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #D97706;">Password Reset Request</h2>
                    <p>Hello ${user.Fullname || user.username},</p>
                    <p>You requested a password reset for your Password Manager account.</p>
                    <p>Your reset code is: <strong style="font-size: 24px; color: #1E3A8A;">${resetCode}</strong></p>
                    <p>This code will expire in 10 minutes.</p>
                    <p>If you didn't request this reset, please ignore this email.</p>
                    <br>
                    <p>Best regards,<br>Password Manager Team</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log("Reset code sent to", email);
        return res.status(200).json(new apiresponse(200,{},"reset code sent to your email"))
    } catch (emailError) {
        console.error("Email sending failed:", emailError);
        // Still return success but log the error - in production you might want to handle this differently
        return res.status(200).json(new apiresponse(200,{resetCode: resetCode},"reset code generated (email failed - check console)"))
    }
})
const resetPassword = asynchandler(async(req,res)=>{
    const {email, resetCode, newPassword} = req.body
    if(!email || !resetCode || !newPassword){
        throw new apierror(400,"all fields are required")
    }
    const user = await User.findOne({email})
    if(!user){
        throw new apierror(404,"user not found")
    }
    if(!user.resetToken || !user.resetTokenExpiry){
        throw new apierror(400,"no reset request found")
    }
    if(Date.now() > user.resetTokenExpiry){
        throw new apierror(400,"reset code expired")
    }
    try {
const decoded = jwt.verify(user.resetToken, process.env.JWT_SECRET)
        if(decoded.resetCode !== resetCode){
            throw new apierror(400,"invalid reset code")
        }
    } catch (error) {
        throw new apierror(400,"invalid or expired reset token")
    }
    user.password = newPassword
    user.resetToken = undefined
    user.resetTokenExpiry = undefined
    await user.save({validateBeforeSave:false})

    return res.status(200).json(new apiresponse(200,{},"password reset successfully"))
})

export{Signupuser,loginuser,logoutuser,refreshaccesstoken,getcurrentuser,generateaccessandrefreshtoken,updateinformation,changepassword,sendResetCode,resetPassword,uploadavatar}