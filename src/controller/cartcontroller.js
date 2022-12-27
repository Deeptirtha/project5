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
            return res.status(400).send({status:false,message:"can't create data with empty body"})
        }

//======================cart validation chk=========

      if (cartId) {
            if (!isValidObjectId(cartId))return res.status(400).send({ status: false, message: "Please provide a Valid CartID!" })
            var oldCart= await CartModel.findOne({_id:cartId,userId:userId})
            if(!oldCart)return res.status(404).send({status:false,message:"No cart found with this id"})
 }

//======================product validation chk========

        if (!productId) return res.status(400).send({ status: false, message: "Product id is mandatory to add your product in cart!" })
        if (!isValidObjectId(productId))return res.status(400).send({ status: false,message: "Please provide a Valid product ID!" })
        let product = await productModel.findOne({_id:productId,isDeleted:false})
        if (!product) return res.status(400).send({ status: false, message: "Product doesn't exists!" })


//=====================quantity validation============

        if(data.quantity==0)return res.status(400).send({status:false,message:"You can't add 0 quantity of any item in your cart"})

//====================if req body does not containt quantity====

        if (!data.quantity) {
            data.quantity = 1
        }

        let quantity =data.quantity
        let totalPrice = product.price*quantity

//===================if user cart already exist==========

       if(cartId){

//==================increasing old product in cart======== 

            let productPresent = oldCart.items
            for (let i=0;i<productPresent.length;i++) {
                if (productPresent[i].productId==productId) {
                    let index=i
                    let updatedproduct=productPresent[i]
                    updatedproduct.quantity+=quantity
                    productPresent.splice(index,1,updatedproduct)

                    price=oldCart.totalPrice+(product.price*quantity)

                    totalItem=productPresent.length

                    let cart = await CartModel.findOneAndUpdate({_id:cartId},{items:productPresent,totalPrice:price,totalItems:totalItem},{new: true})

                    return res.status(200).send({status:true, message:"Product added successfully",data:cart})
                }
            }

//======================adding new item in old cart=========

            let newItem={
                productId:productId,
                quantity:quantity
            }
            price=oldCart.totalPrice+(product.price*quantity)
            

            oldCart.items.push(newItem)
            allnewItems=oldCart.items
            totalItem=allnewItems.length

            let cart=await CartModel.findByIdAndUpdate({_id: cartId },{items:productPresent,totalPrice:price,totalItems:totalItem},{new: true})
            return res.status(200).send({status:true,message:"Product added successfully",data:cart})
        }

//=======================creating new cart for user===========

    items={
        productId:productId,
        quantity:quantity
    }
        let cart = await CartModel.create({userId:userId,items:items,totalPrice:totalPrice,totalItems:1})

        return res.status(201).send({status:true,message:"Cart created successfully",data:cart })

    } catch (error) {
        if(error.code==11000)return res.status(400).send({status:false,message:"This user already has a cart"})
        return res.status(500).send({status:false,msg:error.message })
    }
}

//===================================================================update Cart=================================================================

const updateCart = async function (req, res) {
    try {
let userId=req.params.userId

let data=req.body

let arr=["productId","cartId"]
for(i of arr){
    if(!data[i])return res.status(400).send({status:false,message:`please input ${i} to update your cart`})
    data[i]=data[i].trim()
}
let {productId,cartId,removeProduct}=data

//============================product validation chk

if(!isValidObjectId(productId))return res.status(400).send({status:false,message:'Please enter a valid product id'})
let product=await productModel.findOne({_id:productId,isDeleted:false})
if(!product)return res.status(404).send({status:false,message:"No product found with this product Id"})

//===============================cart validation chk

if(!isValidObjectId(cartId))return res.status(400).send({status:false,message:'Please enter a valid cart id'})
let cart=await CartModel.findById(cartId)
if(!cart)return res.status(404).send({status:false,msg:"No cart found with this cart Id"})
if(cart.userId!=userId)return res.status(404).send({status:false,message:"No cart found with this user Id"})

//=============================removeProduct chk

if(!Object.keys(data).includes("removeProduct")){return res.status(400).send({status:false,message:"Please enter a valid input for removeProduct,between 0 and 1 it's mandatory"})}
if([0,1].indexOf(removeProduct)<0){return res.status(400).send({status:false,message:"Please enter a valid input for removeProduct,between 0 and 1"})}



let cartProduct=cart.items
if(cartProduct.length==0){return res.status(400).send({status:false,message:"Cart already deleted"})}


//============================extracting item from cart

let editproduct={}
let index=0
for(i=0;i<cartProduct.length;i++){
if(cartProduct[i].productId.toString()==productId){
    editproduct=cartProduct[i]
    index=i
}
}

if(Object.keys(editproduct).length==0)return res.status(400).send({status:false,message:"No such product found in user cart"})
if(editproduct.quantity==0)return res.status(400).send({status:false,message:"No such product found in user cart"})

//======================================updating product

let productPrice=product.price
let totalCartPrice=cart.totalPrice
let totalItemsInCart=cart.totalItems

//===========================only 1 quantity deleteing from item list

if(removeProduct==1  && editproduct.quantity>1){
    editproduct.quantity=editproduct.quantity-1
   totalCartPrice=totalCartPrice-productPrice
   totalItemsInCart=totalItemsInCart-1
}
//===========================deleting the whole item

else{
    totalCartPrice=totalCartPrice-(productPrice*editproduct.quantity)
    totalItemsInCart=totalItemsInCart-editproduct.quantity
    editproduct.quantity=0
}

//===========================updating the cart

if(editproduct.quantity>0){
cartProduct.splice(index,1,editproduct)}
else{cartProduct.splice(index,1)}

let Newdata={
    items:cartProduct,
    totalPrice:totalCartPrice,
    totalItems:cartProduct.length
}

let updatedCart= await CartModel.findByIdAndUpdate(cartId,Newdata,{new:true})

res.status(200).send({satus:true,message:"Cart Updated Successfully",data:updatedCart})

    } catch (err) {
      res.status(500).send({ status: false, error: err.message });
    }
  }


//=====================================================================Get Cart===================================================================

  const getCart= async function(req,res){    
    try{
       let userId= req.params.userId        
      let findCart= await CartModel.findOne({userId:userId}).populate({path:"items.productId",select:{title:1 , price:1 , productImage:1}})
      if(!findCart){return res.status(400).send({status:false,message:"No cart present for this user"})}
      if(findCart.items.length==0){return res.status(404).send({status:false,message:"No items present in this cart"})}
      return res.status(200).send({status:true,message:"Cart Details",data:findCart})
    }
    catch(error){ return res.status(500).send({status:false,message:error.message})}}


//===================================================================Delete Cart=================================================================
  const deleteCart = async function (req, res) {
    try {
        let userId = req.params.userId;
        let findCart = await CartModel.findOne({userId:userId});
        if (!findCart) { return res.status(404).send({ status: false, message: "Cart does not exist" });}
        if (findCart.items.length == 0) { return res.status(404).send({ status: false, message:"No cart found" }); }
        await CartModel.updateOne({ _id:findCart._id }, { items: [],totalItems:0,totalPrice:0});
        res.status(204).send()
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}




module.exports={createCart,updateCart,getCart,deleteCart}