const productModel=require("../models/productmodel")
const UserModel= require("../models/usermodel")
const CartModel=require("../models/cartmodel")
const {isValidObjectId}= require ("../validation/validation")

//===================================================================create Cart=================================================================
const createCart = async function(req,res){
    try {
        let data = req.body
        let userId = req.params.userId
        let {cartId, productId} =data

        if(Object.keys(data).length==0){
            return res.status(400).send({status:false,msg:"can't create data with empty body"})
        }
      if (cartId) {
            if (!isValidObjectId(cartId))return res.status(400).send({ status: false, msg: "Please provide a Valid CartID!" })
            if (!isValidObjectId(userId))return res.status(400).send({ status: false, msg: "Please provide a Valid userID!" })          
            
            let user = await UserModel.findById(userId)
            if(!user)return res.status(404).send({status:false,msg:"user not found"})

            var oldCart= await CartModel.findOne({_id:cartId,userId:userId})
            if(!oldCart)return res.status(404).send({status:false,msg:"No cart found with this id"})
 }

        let product = await productModel.findById(productId)
        if (!product) return res.status(400).send({ status: false, msg: "Product doesn't exists!" })

        if (!data.quantity) {
            data.quantity = 1
        }

        let quantity =data.quantity
        let totalPrice = product.price*quantity

       if(cartId){
            let productPresent = oldCart.items
            for (let i=0;i<productPresent.length;i++) {
                if (productPresent[i].productId==productId) {
                    let index=i
                    let updatedproduct=productPresent[i]
                    updatedproduct.quantity+=quantity
                    productPresent.splice(index,1,updatedproduct)

                    price=oldCart.totalPrice+(product.price*quantity)

                    totalItem=oldCart.totalItems+quantity

                    let cart = await CartModel.findOneAndUpdate({_id:cartId},{items:productPresent,totalPrice:price,totalItems:totalItem},{new: true})

                    return res.status(201).send({status:true, message:"Success",data:cart})
                }
            }


            let newItem={
                productId:productId,
                quantity:quantity
            }
            price=oldCart.totalPrice+(product.price*quantity)
            totalItem=oldCart.totalItems+quantity

            oldCart.items.push(newItem)
            allnewItems=oldCart.items

            let cart=await CartModel.findByIdAndUpdate({_id: cartId },{items:productPresent,totalPrice:price,totalItems:totalItem},{new: true})
            return res.status(201).send({status:true,message:"Success",data:cart})
        }
    items={
        productId:productId,
        quantity:quantity
    }
        let cart = await CartModel.create({userId:userId,items:items,totalPrice:totalPrice,totalItems:1})

        return res.status(201).send({status:true,message:"Success",data:cart })

    } catch (error) {
        return res.status(500).send({status:false,msg:error.message })
    }
}

//===================================================================update Cart=================================================================

const updateCart = async function (req, res) {
    try {
let userId=req.params.userId
if(!isValidObjectId(userId))return res.status(400).send({status:false,msg:'Please enter a valid user id'})
let user=await UserModel.findById(userId)
if(!user)return res.status(404).send({status:false,msg:"No user found with this user Id"})

let data=req.body

let arr=["productId","cartId"]
for(i of arr){
    if(!data[i])return res.status(400).send({status:false,msg:`please input ${i}`})
    data[i]=data[i].trim()
}
let {productId,cartId,removeProduct}=data


if(!productId)return res.status(400).send({status:false,msg:"productId is mandatory please input productId"})
if(!isValidObjectId(productId))return res.status(400).send({status:false,msg:'Please enter a valid product id'})
let product=await productModel.findOne({_id:productId,isDeleted:false})
if(!product)return res.status(404).send({status:false,msg:"No product found with this product Id"})


if(!cartId)return res.status(400).send({status:false,msg:"cartId is mandatory please input cartId"})
if(!isValidObjectId(cartId))return res.status(400).send({status:false,msg:'Please enter a valid cart id'})
let cart=await CartModel.findById(cartId)
if(!cart)return res.status(404).send({status:false,msg:"No cart found with this cart Id"})
if(cart.userId!=userId)return res.status(404).send({status:false,msg:"No cart found with this user Id"})


if([0,1].indexOf(removeProduct)<0){return res.status(400).send({status:false,msg:"Please enter a valid input for removeProduct,between 0 and 1"})}


let cartProduct=cart.items
if(cartProduct.length==0){return res.status(400).send({status:false,msg:"Cart already deleted"})}


let editproduct={}
let index=0
for(i=0;i<cartProduct.length;i++){
if(cartProduct[i].productId.toString()==productId){
    editproduct=cartProduct[i]
    index=i
}
}

if(Object.keys(editproduct).length==0)return res.status(400).send({status:false,msg:"No such product found in user cart"})
if(editproduct.quantity==0)return res.status(400).send({status:false,msg:"No such product found in user cart"})

let productPrice=product.price
let totalCartPrice=cart.totalPrice
let totalItemsInCart=cart.totalItems

if(removeProduct==1  && editproduct.quantity>1){
    editproduct.quantity=editproduct.quantity-1
   totalCartPrice=totalCartPrice-productPrice
   totalItemsInCart=totalItemsInCart-1
}
else{
    totalCartPrice=totalCartPrice-(productPrice*editproduct.quantity)
    totalItemsInCart=totalItemsInCart-editproduct.quantity
    editproduct.quantity=0
}

if(editproduct.quantity>0){
cartProduct.splice(index,1,editproduct)}
else{cartProduct.splice(index,1)}

let Newdata={
    items:cartProduct,
    totalPrice:totalCartPrice,
    totalItems:totalItemsInCart
}

let updatedCart= await CartModel.findByIdAndUpdate(cartId,Newdata,{new:true})

res.status(200).send({satus:true,msg:"Cart Updated Successfully",data:updatedCart})

    } catch (err) {
      res.status(500).send({ status: false, error: err.message });
    }
  }


//=====================================================================Get Cart=====================================

  const getCart= async function(req,res){    
    try{
       let userId= req.params.userId  
       if(!isValidObjectId(userId)){return res.status(400).send({status:false,message:"Invalid userId"})}
      let findUser= await UserModel.findById(userId)
      if(!findUser){return res.status(404).send({status:false,message:"User Not Found"})}
      
      let findCart= await CartModel.findOne({userId:userId}).populate({path:"items.productId",select:{title:1 , price:1 , productImage:1}})
      if(!findCart){return res.status({status:false,message:"No cart present for this user"})}
      return res.status(200).send({status:true,message:"success",data:findCart})
    
    }
    catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
    }





//===================================================================Delete Cart=================================================================
  const deleteCart = async function (req, res) {
    try {

        let userId = req.params.userId;
        let findCart = await CartModel.findOne({userId:userId});
        if (!findCart) { return res.status(400).send({ status: false, message: "Cart does not exist" });}
        if (findCart.items.length == 0) { return res.status(400).send({ status: false, message: "Cart is empty" }); }
        await CartModel.updateOne({ _id:findCart._id }, { items: [],totalItems:0,totalPrice:0});
        res.status(204).send()
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}




module.exports={createCart,updateCart,getCart,deleteCart}