const userModel= require("../models/usermodel")
const validations= require("../validation/validation")
const jwt= require("jsonwebtoken")
const bcrypt = require('bcrypt')
const  { uploadFile }=require("../aws")

 
const{isValidEmail,isValidPswd,isValidObjectId,isValidString,isValidPincode,isValidPhone}= validations


//================================================REGISTER USER=================================================//

const createUser= async function(req,res){
    try{
        let data=req.body;
        let files=req.files
       
        if(Object.keys(data).length==0){
            return res.status(400).send({status:false,msg:"can't create data with empty body"})}
       

        if(!data.fname || isValidString( data.fname.trim()))return res.status(400).send({status:false,msg:"please enter a valid fname"})
        if(!data.lname || isValidString( data.lname.trim()))return res.status(400).send({status:false,msg:"please enter a valid lname"})

        if(!isValidEmail(data.email.trim()))return res.status(400).send({status:false,msg:"please enter a valid email"})
        if(!isValidPhone(data.phone.trim()))return res.status(400).send({status:false,msg:"please enter a valid phone No"})

        if(!isValidPswd(data.password.trim()))return res.status(400).send({status:false,msg:"please enter a valid password"})
        
        let address=data.address
        address=JSON.parse(address)

     if (typeof(address)!== "object") {return res.status(400).send({ status: true, msg: "please put address in object format" })}

     if (typeof(address.shipping)!== "object" || !address.shipping) {return res.status(400).send({ status: true, msg: "please put shipping-address in object format" })}

    if (typeof(address.billing)!== "object" || !address.billing) {return res.status(400).send({ status: true, msg: "please put billing-address in object format" })}
   let arr=["street","city","pincode"]
    for(i of arr){
         if (!address.shipping[i])return res.status(400).send({status:false,msg:`${i} is not present inside your shipping-address`})}

     for(i of arr){
         if (!address.billing[i])return res.status(400).send({status:false,msg:`${i} is not present inside your billing-address`})}

    if (!address.shipping.street || isValidString(address.shipping.street.trim())) {return res.status(400).send({status: false,message: "street can't be empty in your shipping-address "})}
        
     if (!address.shipping.city || isValidString(address.shipping.city.trim())) {return res.status(400).send({status: false,message: "city can't be empty in your shipping-address  "})}
        
    if (!address.shipping.pincode ||!isValidPincode(address.shipping.pincode)) {return res.status(400).send({ status: false, message: "please input valid shipping-pincode " }) }
            
    if (!address.billing.street || isValidString(address.billing.street.trim())) {return res.status(400).send({status: false,message: "street can't be empty in your billing-address "})}

     if (!address.billing.city || isValidString(address.billing.city.trim())) {return res.status(400).send({status: false,message: "city can't be empty in your billing-address  "})}
        
     if (!address.billing.pincode ||!isValidPincode (address.billing.pincode)) {return res.status(400).send({ status: false, message: "please input valid billing-pincode " }) }
        
   let oldUser = await userModel.findOne({$or: [{ phone: data.phone }, { email: data.email }]})
    if (oldUser) {return res.status(400).send({status: false,message: "User already exist with this phone no or email Id"})}

        
      let PicUrl = await uploadFile(files[0])
      if(!PicUrl)return res.status(400).send({status:false,msg:"can't creat data without profile picture"})
      data.profileImage=PicUrl

      data.password = await bcrypt.hash(data.password, 10)
     data.address=address
      let NewUser= await userModel.create(data)
   
      res.status(201).send({status:true,message: "User created successfully",data:NewUser})

    }
    catch(err){
res.status(500).send({status:false,msg:err.message})
    }
}


//====================================================LOGIN USERS================================================//
const userLogin= async function(req,res){
    try {
        let data= req.body
let  {email,password,phone}=data
    if(Object.keys(req.body).length==0){
        return res.status(400).send({status:false,message:"can not login without credentials"})
    }
    if (data.hasOwnProperty("email") && data.hasOwnProperty("phone") ) {return res.status(400).send({ status: false, message: "please provide any one between email and phone no" })}
    if (!data.hasOwnProperty("email")) {
      if(!data.hasOwnProperty("phone")) {return res.status(400).send({status: false,message: "please enter mobile no or email id to login"})}}
    if (!data.hasOwnProperty("password")) {return res.status(400).send({ status: false, message: "please enter password to login" })}

   // if(!email){return res.status(400).send({status:false,messsage:"email is required"})}
   if(email){
    if(!isValidEmail(email,trim())){return res.status(400).send({status:false,message:"Email is invalid"})}}
   
if(phone){
    if(!isValidPhone(phone.trim()))return res.status(400).send({status:false,msg:"please enter a valid phone No"})
}
    let findUser= await userModel.findOne({$or: [{ email: data.email },{ phone: data.phone}]})
    if(!findUser){return res.status(404).send({status:false,message:"User not found"})}
    let hash= findUser.password
    let bcryptpwd= await bcrypt.compare(password.trim(), hash)
    if(!bcryptpwd){return res.status(400).send({status:false,message:"please put correct password "})}
   

    let token= jwt.sign({userId:findUser._id},"Project5",{expiresIn:"10h"})
   let obj= {userId:findUser["_id"],token}

    return res.status(200).send({status:true,message:"User login successfull",data:obj})

}
catch(error){
    return res.status(500).send({status:false,message:error.message})
}
}


//===========================================GET USERS============================================================//

const getUser= async function(req,res){
    try{
           let userId= req.params.userId         
           if(!isValidObjectId(userId)){return res.status(400).send({status:false,message:"UserId is invalid"})}
       
           let userDetails= await userModel.findById(userId)
           if(!userDetails){return res.status(404).send({status:false,message:"User details not found"})}
           return res.status(200).send({status:true,message:"User profile details",data:userDetails})
    }
    catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
}



module.exports={userLogin,getUser,createUser}