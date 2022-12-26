const orderModel=require("../models/ordermodel")
const cartModel=require("../models/cartmodel")
const {isValidObjectId,isValidStatus}=require("../validation/validation")


const createOrder=async function(req,res){
try{
    let userId=req.params.userId
    let data=req.body
    let cartId=data.cartId
    if(!isValidObjectId(cartId))return res.status(400).send({status:false,msg:'Please enter a valid cart id'})

    if(data.hasOwnProperty("status")){
    if(data.status!="pending")return res.status(400).send({status:false,msg:"you can't change order status manually"})}

    let cart=await cartModel.findById(cartId)
    if(!cart)return res.status(400).send({status:false,msg:"can't find any cart with this cart Id"})
    if(cart.userId!=userId)return res.status(404).send({status:false,msg:"No cart found with this user Id"})

    let {items,totalPrice,totalItems}=cart

    if(items.length==0){return res.status(400).send({status:false,msg:"cart already deleted"})}

    let totalQuantity=0
    for(i=0;i<items.length;i++){
        totalQuantity+=items[i].quantity
    }

    data.userId=userId
    data.items=items
    data.totalPrice=totalPrice
    data.totalItems=totalItems
    data.totalQuantity=totalQuantity
 

    let placeOrder=await orderModel.create(data)
    //await cartModel.updateOne({ _id:cartId}, { items: [],totalItems:0,totalPrice:0})
    res.status(201).send({status:true,msg:"Ordered successfully",data:placeOrder})
}
catch(err){
    res.status(500).send({status:false,msg:err.message})
}
}

const updateOrder=async function(req,res){
    try{

        let userId=req.params.userId
        let data=req.body
        let {orderId,status}=data

        if(!isValidObjectId(orderId))return res.status(400).send({status:false,msg:'Please enter a valid order id'})
        if(!isValidStatus(status.trim()))return res.status(400).send({status:false,msg:'Please enter a valid status'})
        
        let order=await orderModel.findById(orderId)

        if(!order)return res.status(400).send({status:false,msg:"can't find any order with this order Id"})
        if(order.userId!=userId)return res.status(404).send({status:false,msg:"This order doesn't belongs to this user"})

        if(order.cancellable==false){
        if(data.status.trim()=="canceled")return res.status(400).send({status:false,msg:"This order is not cancellable"})}


        let updatedOrder=await orderModel.findOneAndUpdate({_id:orderId},{status:status},{new:true})
        res.status(200).send({status:true,msg:"Updated",data:updatedOrder})
    }
    catch(err){
        res.status(500).send({status:false,msg:err.message})  
    }
}


module.exports={createOrder,updateOrder}