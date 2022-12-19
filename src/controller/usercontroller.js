const bcrypt = require('bcrypt')
const UserModel= require("../models/usermodel")
const  { uploadFile }=require("../aws")
const {isValidString,isValidPincode,isValidPhone,isValidEmail,isValidPswd}= require("../validation/validation")

const CreatUser= async function(req,res){
    try{
        let data=req.body;
        let files=req.files
       
        if(Object.keys(data).length==0)return res.status(400).send({status:false,msg:"can't create data with empty body"})
       

        if(!data.fname || isValidString( data.fname.trim()))return res.status(400).send({status:false,msg:"please enter a valid fname"})
        if(!data.lname || isValidString( data.lname.trim()))return res.status(400).send({status:false,msg:"please enter a valid lname"})

        if(!isValidEmail(data.email.trim()))return res.status(400).send({status:false,msg:"please enter a valid email"})
        if(!isValidPhone(data.phone.trim()))return res.status(400).send({status:false,msg:"please enter a valid phone No"})

        if(!isValidPswd(data.password.trim()))return res.status(400).send({status:false,msg:"please enter a valid password"})
        
        let address=data.address
        address=JSON.parse(address)


           if (typeof(address)!== "object") {return res.status(400).send({ status: true, msg: "please put address in object format" })}
           if (typeof(address.shipping)!== "object" || !address.shipping) {return res.status(400).send({ status: true, msg: "please put shipping in object format" })}
           if (typeof(address.billing)!== "object" ||!address.billing) {return res.status(400).send({ status: true, msg: "please put billing in object format" })}
 
            let arr=["street","city","pincode"]
            for(i of arr){
              if (!address.shipping[i])return res.status(400).send({status:false,msg:`${i} is not present inside your shipping-address`})
          
          }

          for(i of arr){
            if (!address.billing[i])return res.status(400).send({status:false,msg:`${i} is not present inside your billing-address`})
        
        }
            if (!address.shipping.street) {return res.status(400).send({status: false,message: "street can't be empty in your shipping-address "})}
        
            if (!address.shipping.city) {return res.status(400).send({status: false,message: "city can't be empty in your shipping-address  "})}
        
            if (!address.shipping.pincode ||!isValidPincode(address.shipping.pincode)) {return res.status(400).send({ status: false, message: "please input valid shipping-pincode " }) }
            
            if (!address.billing.street) {return res.status(400).send({status: false,message: "street can't be empty in your shipping-address "})}
        
            if (!address.billing.city) {return res.status(400).send({status: false,message: "city can't be empty in your shipping-address  "})}
        
            if (!address.billing.pincode ||!isValidPincode (address.billing.pincode)) {return res.status(400).send({ status: false, message: "please input valid shipping-pincode " }) }
        
 
        let oldUser = await UserModel.findOne({$or: [{ phone: data.phone }, { email: data.email }]})
        if (oldUser) {return res.status(400).send({status: false,message: "User already exist with this phone no or email Id"})}

        
      let PicUrl = await uploadFile(files[0])
      if(!PicUrl)return res.status(400).send({status:false,msg:"can't creat data without profile picture"})
      data.profileImage=PicUrl

      data.password = await bcrypt.hash(data.password, 10)
     data.address=address
      let NewUswer= await UserModel.create(data)
   
      res.status(201).send({status:true,message: "User profile details",data:NewUswer})

    }
    catch(err){
res.status(500).send({status:false,msg:err.message})
    }
}

module.exports={CreatUser}