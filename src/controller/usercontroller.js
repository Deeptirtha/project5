const bcrypt = require('bcrypt')
const UserModel= require("../models/usermodel")
const jwt = require('jsonwebtoken')
const  { uploadFile }=require("../aws")
const {isValidString,isValidPincode,isValidPhone,isValidEmail,isValidPswd,isValidObjectId }= require("../validation/validation")


//===============================================================CREATE USERS=====================================================================

const CreatUser= async function(req,res){
    try{
        let data=req.body;
        let files=req.files
       
        if(Object.keys(data).length==0)return res.status(400).send({status:false,msg:"can't create data with empty body"})
        if(files.length==0)return res.status(400).send({status:false,msg:"profile image is manndatory"})
       let newArr=["fname","lname","email","phone","password","address"]
       for(i of newArr){
        if(!data[i])return res.status(400).send({status:false,msg:` ${i} is mandatory please input ${i}`})
       }


        let array=Object.keys(data)
        for(i of array){
         if(data[i].trim()=="")return res.status(400).send({status:false,msg:` ${i} can't be empty`})
        }
       

        if(isValidString( data.fname.trim()))return res.status(400).send({status:false,msg:"please enter a valid fname"})
        if(isValidString( data.lname.trim()))return res.status(400).send({status:false,msg:"please enter a valid lname"})

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

            if (!address.shipping.street.trim()) {return res.status(400).send({status: false,message: "please put valid street in your shipping-address "})}
        
            if (!address.shipping.city || isValidString(address.shipping.city.trim())) {return res.status(400).send({status: false,message: "please put valid city in your shipping-address  "})}
        
            if (!address.shipping.pincode ||!isValidPincode(address.shipping.pincode)) {return res.status(400).send({ status: false, message: "please input valid shipping-pincode " }) }
            
            if (!address.billing.street.trim()) {return res.status(400).send({status: false,message: "please put valid street in your billing-address "})}

            if (!address.billing.city || isValidString(address.billing.city.trim())) {return res.status(400).send({status: false,message: "please put valid city in your billing-address  "})}
        
            if (!address.billing.pincode ||!isValidPincode (address.billing.pincode)) {return res.status(400).send({ status: false, message: "please input valid billing-pincode " }) }
        
    let oldUser2 = await UserModel.findOne({ email: data.email })
    if (oldUser2) {return res.status(400).send({status: false,message: "User already exist with this email Id"})}

    let oldUser1 = await UserModel.findOne({ phone: data.phone })
    if (oldUser1) {return res.status(400).send({status: false,message: "User already exist with this phone no"})}

 
    
      let PicUrl = await uploadFile(files[0])
      if(!PicUrl)return res.status(400).send({status:false,msg:"can't creat data without profile picture"})
      data.profileImage=PicUrl

      data.password = await bcrypt.hash(data.password, 10)
      data.address=address
      let NewUswer= await UserModel.create(data)
   
      res.status(201).send({status:true,message: "User created successfully",data:NewUswer})

    }
    catch(err){
res.status(500).send({status:false,msg:err.message})
    }
}

//==========================================================LOGIN USERS==========================================================================
const userLogin= async function(req,res){
    try {
        let data= req.body
let  {email,password,phone}=data
    if(Object.keys(req.body).length==0){
        return res.status(400).send({status:false,message:"can not login without credentials"})
    }
    if (data.hasOwnProperty("email") && data.hasOwnProperty("phone") ) {return res.status(400).send({ status: false, message: "please provide any one between email and phone no" })}
    if (!data.hasOwnProperty("email")) {
    if (!data.hasOwnProperty("phone")) {return res.status(400).send({status: false,message: "please enter mobile no or email id to login"})}}
    if (!data.hasOwnProperty("password")) {return res.status(400).send({ status: false, message: "please enter password to login" })}

  
   if(email){
    if(!isValidEmail(email.trim())){return res.status(400).send({status:false,message:"Email is invalid"})}}
   
if(phone){
    if(!isValidPhone(phone.trim()))return res.status(400).send({status:false,msg:"please enter a valid phone No"})
}
    let findUser= await UserModel.findOne({$or: [{ email: data.email },{ phone: data.phone}]})
    if(!findUser){return res.status(404).send({status:false,message:"User not found"})}
    let hash= findUser.password
    let bcryptpwd= await bcrypt.compare(password.trim(), hash)
    if(!bcryptpwd){return res.status(400).send({status:false,message:"please put correct password "})}
   

    let token= jwt.sign({userId:findUser._id},"Project5",{expiresIn:"10d"})
   let obj= {userId:findUser["_id"],token}

    return res.status(200).send({status:true,message:"User login successfull",data:obj})

}
catch(error){
    return res.status(500).send({status:false,message:error.message})
}
}


//=================================================================GET USERS=====================================================================

const getUser= async function(req,res){
    try{
           let userId= req.params.userId         
           if(!isValidObjectId(userId)){return res.status(400).send({status:false,message:"UserId is invalid"})}
       
           let userDetails= await UserModel.findById(userId)
           if(!userDetails){return res.status(404).send({status:false,message:"User details not found"})}
           return res.status(200).send({status:true,message:"User profile details",data:userDetails})
    }
    catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
}

//==========================================================UPDATE USERS=========================================================================

const updateUser=async function(req,res){
    try{
        let userId = req.params.userId;
        let body = req.body
        let files = req.files
        let { fname, lname, email, phone, password, address, } = body;
     
        if (Object.keys(body).length==0) {
            return res.status(400).send({ status: false, message: "provide details to update" })
        }


        let array=Object.keys(body)
        for(i of array){
         if(body[i].trim()=="")return res.status(400).send({status:false,message:` ${i} can't be empty`})
        }
       

        if (fname) {
            if (isValidString(fname)) 
            return res.status(400).send({ status: false,message: "provide valid first name" })
            
        }  

       if (lname) {
                if (isValidString(lname)) 
                return res.status(400).send({ status: false, message: "lname already presesnt" })
                
       } 

       if (email) {
        if (!isValidEmail(email)) 
        return res.status(400).send({ status: false, message: "Invalid email type" })
        let checkEmail = await UserModel.findOne({ email: body.email });
        if (checkEmail) 
        return res.status(400).send({ status: false, message: "The email is already exist" })
       
    }
    
    if (phone) {
        if (!isValidPhone(phone)) 
        return res.status(400).send({ status: false, message: "Invalid number type" })
        let checkPhone = await UserModel.findOne({ phone: body.phone });
        if (checkPhone) 
        return res.status(400).send({ status: false, message: "The phone number is already exist" })
        
    }
    if (password) {
        if (!isValidPswd(password.trim())) 
        return res.status(400).send({ status: false, message: "Please enter valid password" })
       }
if(body.address){    
           
    let address=body.address
    address=JSON.parse(address)

    if (typeof(address)!== "object") {return res.status(400).send({ status: true, msg: "please put address in object format" })}

    if (typeof(address.shipping)!== "object" || !address.shipping) {return res.status(400).send({ status: true, msg: "please put shipping-address in object format" })}

    if (typeof(address.billing)!== "object" || !address.billing) {return res.status(400).send({ status: true, msg: "please put billing-address in object format" })}

     let arr=["street","city","pincode"]
     for(i of arr){
         if (!address.shipping[i])return res.status(400).send({status:false,msg:`${i} is not present inside your shipping-address`})}

     for(i of arr){
         if (!address.billing[i])return res.status(400).send({status:false,msg:`${i} is not present inside your billing-address`})}

     if (!address.shipping.street.trim()) {return res.status(400).send({status: false,message: "please put valid street in your shipping-address "})}
 
     if (!address.shipping.city || isValidString(address.shipping.city.trim())) {return res.status(400).send({status: false,message: "please put valid city in your shipping-address  "})}
 
     if (!address.shipping.pincode ||!isValidPincode(address.shipping.pincode)) {return res.status(400).send({ status: false, message: "please input valid shipping-pincode " }) }
     
     if (!address.billing.street.trim()) {return res.status(400).send({status: false,message: "please put valid street in your billing-address "})}

     if (!address.billing.city || isValidString(address.billing.city.trim())) {return res.status(400).send({status: false,message: "please put valid city in your billing-address  "})}
 
     if (!address.billing.pincode ||!isValidPincode (address.billing.pincode)) {return res.status(400).send({ status: false, message: "please input valid billing-pincode " }) }
 
            body.address=address
        }
            if (files && files.length != 0) {
                let profileImage = await uploadFile(files[0]);
               body.profileImage=profileImage
            }
         
       let update = await UserModel.findOneAndUpdate({_id:userId},body,{new:true})
        return res.status(200).send({ status: true, message: "Successfully updated", data: update });
    }
    catch(err){
        return res.status(500).send({status:false,message:err.message})
    }
}



module.exports={CreatUser,getUser,userLogin,updateUser}