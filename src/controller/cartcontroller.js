const cartModel= require("../models/cartmodel")
const validations= require("../validation/validation")
const userModel= require("../models/usermodel")


const {isValidObjectId}=validations
//===========================================Get Cart details with user============================================//

const getCart= async function(req,res){    //title price product
try{
   let userId= req.params.userId  
   if(!isValidObjectId(userId)){return res.status(400).send({status:false,message:"Invalid userId"})}
//    let token=req.decodedToken
//   if(userId!=token.userId)return res.status(403).send({status:false,msg:"you are not authorised for this request"})
  let findUser= await userModel.findById(userId)
  if(!findUser){return res.status(404).send({status:false,message:"User Not Found"})}
  
  let findCart= await cartModel.findOne({userId:userId}).populate({path:"items.productId",select:{title:1 , price:1 , productImage:1}})
  if(!findCart){return res.status({status:false,message:"No cart present for this user"})}
   return res.status(200).send({status:true,message:"success",data:findCart})

}
catch(error){
    return res.status(500).send({status:false,message:error.message})
}
}

module.exports={getCart}