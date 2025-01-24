const mongoose=require("mongoose");
const validators=require("validator");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

const userSchema=new mongoose.Schema({
  firstName:{
    type:String,
    required:true,
    minLength:4,
    maxLength:20
  },
  lastName:{
    type:String,
  },
  emailId:{
    type:String,
    required:true,
    unique:true,
    trim:true,
    lowercase:true,
    validate(value){
      if(!validators.isEmail(value)){
        throw new Error("Invalid Email addresss: "+value);
      }
    }
  },
  password:{
    type:String,
    required:true,
    validate(value){
      if(!validators.isStrongPassword(value)){
        throw new Error("Not a strong password: "+value);
      }
    }
  },
  age:{
    type:Number,
    min:18
  },
  gender:{
    type:String,
    validate(value){
      if(!["male","female","others"].includes(value)){
        throw new Error("Invalid gender");
      }
    }
  },
  photoUrl:{
    type:String,
    default:"https://d2qp0siotla746.cloudfront.net/img/use-cases/profile-picture/template_0.jpg"
  },
  about:{
    type:String,
    default:"This is default user info !"
  },
  skills:{
    type:Array,

  }
},{
  timestamps:true
});

userSchema.methods.getJWT=async function(){
  const user=this;
  const token=await jwt.sign({_id:user._id},"@Ashish0904",{expiresIn:"7d"});
  return token;
};

userSchema.methods.validatePassword=async function(passwordInputByUser){
  const user=this;
  const passwordHash=user.password;
   const isPasswordValid=await bcrypt.compare(passwordInputByUser,passwordHash);
   return isPasswordValid;
};

module.exports=mongoose.model("User",userSchema);
