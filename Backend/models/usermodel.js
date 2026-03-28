import { Schema } from "mongoose";
import mongoose from "mongoose";
import jwt  from "jsonwebtoken"
import bcrypt from "bcrypt"

const userschema = new Schema({
    username: {
        type: String,
        require:true,
        unique:true,
        lowercase:true,
        index:true
    },
    email:{
        type:String,
        require:true,
        trim:true,
        unique:true
    },
    password:{
        type:String,
        require:[true,"password is required"],

    },
    Fullname:{
        type:String,
        index:true,
        trim:true
    },
avatar:{
    url : {type:String, default: null},
    public_id:{type:String, default: null}
},
    refreshtoken:{
        type:String,

    },
    resetToken: {
        type: String,
    },
    resetTokenExpiry: {
        type: Date,
    }
},{timestamps:true})

userschema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});


userschema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password,this.password)
}

userschema.methods.jettoken = async function (){
    const token = jwt.sign({
        id:this.id.toString(),
        email: this.email,
      username: this.username,
      Fullname: this.Fullname
    },
    process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_SECRET_EXPIRE || "5d"
    }
)
 console.log("Generated Access Token:", token); // Log token for debugging
    return token;
}

userschema.methods.generaterefreshtoken = async function(){
    const refreshtoken = jwt.sign({
        id : this.id.toString()
    },
    process.env.REFRESH_TOKEN_SECRET,{
        expiresIn:process.env.REFRESH_TOKEN_EXPIRE || "7d"
    }
)
 console.log("Generated Refresh Token:", refreshtoken); // Log token for debugging
    return refreshtoken;
}

export const User = mongoose.model("user",userschema)