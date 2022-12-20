const productmodel=require('../models/productmodel')
const mongoose=require('mongoose')
const ObjectId=mongoose.Types.ObjectId


const getproductbyid= async function (req, res) {
    try {
        let productId =req.params.productId
        if(!ObjectId.isValid(productId)){
            return res.status(400).send({status:false, message:"Provide valid productId" })  
        }
        let findProduct = await productmodel.findOne({_id: productId,isDeleted:false })
        if (!findProduct)
            return res.status(404).send({ status: false, message:"Product not found!" })
        return res.status(200).send({status:true,message:"Success",data:findProduct })
    } 
    catch (err) {
        return res.status(500).send({ status:false, Message:err.Message })
    }
}

module.exports={getproductbyid}