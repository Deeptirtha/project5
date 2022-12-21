const productModel= require("../models/productmodel")
const  { uploadFile }=require("../aws")
const validations= require("../validation/validation")

const{isValidSize,isValidPrice,isValidObjectId}= validations

//==========================================create product=======================================================//

const createProduct= async function(req,res){
    try{
         let data= req.body
         let files= req.files
         let {title, description,price,currencyId,currencyFormat,availableSizes}=data
         if(Object.keys(data).length==0){
            return res.status(400).send({status:false,message:"Data should be present in request body"})
         }
         if(!title.trim()){return res.status(400).send({status:false,message:"Title should be present"})}
         if(title || title==""){return res.status(400).send({status:false,message:"Title should be present"})}  

         if(!description.trim()){return res.status(400).send({status:false,message:"Description should be present"})}
         if(description.trim()||description==""){return res.status(400).send({status:false,message:"Description should be present"})}
       
         if(!price){return res.status(400).send({status:false,message:"Price should be present"})}
         if(price || price==""){return res.status(400).send({status:false,message:"Price should be present"})}
         if(!isValidPrice(price)){return res.status(400).send({status:false,message:"Price can be numeric or decimal"})}

         if(!currencyId){return res.status(400).send({status:false,message:"currencyId should be present"})}
         if(currencyId ||currencyId==""){return res.status(400).send({status:false,message:"currencyId should be present"})}
         if(currencyId !=="INR"){return res.status(400).send({status:false,message:"currencyId should be in INR format"})}

         if(!currencyFormat){return res.status(400).send({status:false,message:"currencyFormat should be present"})}
         if(currencyFormat || currencyFormat==""){return res.status(400).send({status:false,message:"currencyFormat should be present"})}
         if(currencyFormat!=="₹"){return res.status(400).send({status:false,message:"currencyFormat should be this-₹ "})}

        if(installments ||installments=="" ){
        if(isNaN(installments))return res.status(400).send({status:false,msg:"Please put installments in Number"})}
        

         let uploadImage= await uploadFile(files[0])
         if(!uploadImage){return res.status(400).send({status:false,message:"productImage should be present"})}
         data.productImage=uploadImage

        if(availableSizes){
        let size= availableSizes.lowerCase().split(" ")
         for(let i=0;i<size.length;i++){   
         if(!isValidSize(size[i])){return res.status(400).send({status:false,message:"Available sizes can be only these-S, XS, M ,X, L, XXL, XL"})}
         }
            data.availableSizes=size
        }
        if(req.body.isDeleted=="true"){
          data["deletedAt"]= Date.now()
        }
         let product= await productModel.create(data)  
         return res.status(201).send({status:true,message:"product created successfully",data:product})
    }
    catch(error){
        if(error.code==11000){return res.status(400).send({status:false,message:"title should be unique"})}

        return res.status(500).send({status:false,message:error.message})
    }
}


//===============================================GET PRODUCT BY QUERY PARAMS======================================//
// const getProductByfilter=async function(req,res){
//     try{
//          let data= req.query.params
//          let {size,name,priceGreaterThan,priceLessThan}=data
//          data.availableSizes=size
//          data.title=name
//          data.price=priceGreaterThan
//          data.price=priceLessThan

//          if()
   
//     }
//     catch(error){
//        return res.status(500).send({status:false,message:error.message})
//     }
//    }

const getFilteredProduct = async function (req, res){
    try {
      let data = req.query
      let conditions = { isDeleted: false };
  
     if(Object.keys(data).length==0) {
        let getProducts = await Product.find(conditions).sort({ price:data.priceSort });  
        if(getProducts.length == 0) return res.status(404).send({ status: false, message: "No products found" });
         return res.status(200).send({ status: true,message: "Success", data: getProducts })
      }
      
  if(data.priceSort){
  if(["1","-1"].indexOf(data.priceSort)<0){
    return res.status(400).send({status:false,message:"priceSort should be 1 or -1"})
  }
}
      if(data.size) {
        data.size = data.size.toUpperCase();
        if(!isValidSize(data.size)) return res.status(400).send({ status: false, message: "please enter a valid  size" })
        conditions.availableSizes = {$in:data.size}}
  
      if(data.name) {conditions.title = {$regex:data.name}}
  
      
      if(data.priceGreaterThan || data.priceLessThan) {
        if(isNaN(data.priceGreaterThan )|| isNaN(data.priceLessThan))return res.status(400).send({status:false,msg:"Enter a valid price to get your product"})
        if(data.priceGreaterThan && data.priceLessThan){conditions.price={$gte:data.priceGreaterThan,$lte:data.priceLessThan}}
        else if(data.priceGreaterThan){conditions.price={$gt:data.priceGreaterThan}}
        else{conditions.price={$lte:data.priceLessThan}}}


      let getFilterProduct = await productModel.find(conditions).sort({ price: 1 })
      if(getFilterProduct.length == 0) return res.status(404).send({ status: false, message: "No products found" });
  
      res.status(200).send({ status: true,message: "Success", data: getFilterProduct})
    } 
    catch (err) {
      res.status(500).send({ status: false, error: err.message });
    }
  }



//=============================================GET PRODUCT BY ID=================================================//
const getProduct= async function(req,res){
try{
   let productId= req.params.productId
   if(!isValidObjectId(productId)){
    return res.status(400).send({status:false,message:"invalid productId,please provide correct productId"})
   }
     let findProduct= await productModel.findOne({_id:productId,isDeleted:false})
     if(!findProduct){return res.status(404).send({status:false,message:"product not found"})}
     return res.status(200).send({status:true,message:"success",data:findProduct})
}
catch(error){
    return res.status(500).send({status:false,message:error.message})
}
}

//==========================================UPDATE PRODUCT========================================================//

// const updateProduct= async function(req,res){
//  try{
//        let productId= req.params.productId
//         let data= req.body
//        let {title, description,price,isFreeShipping,productImage,style,availableSizes,installments}=data
       
//        if(!isValidObjectId(productId)){}
//  }
//  catch(error){
//   return res.status(500).send({status:false,message:error.message})
//  }
// }


const updateProduct = async function (req, res) {
  try {
    let productId = req.params.productId
    let data = req.body
    const files = req.files
    if(Object.keys(data).length==0) return res.status(400).send({status: false ,message: 'Provide data in request body'})
    let { title, description, price,  isFreeShipping, style, availableSizes, installments } = data
    if (!isValidObjectId(productId)) return res.status(400).send({ status: false, message: 'ProductId is not valid ' })
    let product = await productModel.findOne({_id:productId,isDeleted:false})
    if (!product) return res.status(404).send({ status: false, message: 'product not found' })

    if (title || title=="") {
      if (!title.trim()) { return res.status(400).send({ status: false, message: "Title should be present" }) }}
    if (description || description=="") {
      if (!description.trim()) { return res.status(400).send({ status: false, message: "Description should be present" }) } }
    if (price||price=="") {
      if (!price) { return res.status(400).send({ status: false, message: "Price should be present" }) }
      if (!isValidPrice(price)) { return res.status(400).send({ status: false, message: "Price can be numeric or decimal" }) } }
    
    if (currencyId||currencyId=="") {
      if (currencyId.trim() !== "INR") { return res.status(400).send({ status: false, message: "currencyId should be in INR format" }) } }

    if (currencyFormat||currencyFormat=="") {  
      if (currencyFormat.trim() !== "₹") { return res.status(400).send({ status: false, message: "currencyFormat should be this-₹ " }) } }
   if(installments||installments==""){
   if(isNaN(installments))return res.status(400).send({status:false,msg:"Please put installments in Number"})}
   
    if (files||files=="") {
      let uploadImage = await uploadFile(files[0])
      if (!uploadImage) { return res.status(400).send({ status: false, message: "productImage should be present" }) }
      data.productImage = uploadImage
    }

    if (availableSizes||availableSizes=="") {
      let size = availableSizes.split(" ")
      for (let i = 0; i < size.length; i++) {
        if (!isValidSize(size[i])) { return res.status(400).send({ status: false, message: "Available sizes can be only these-S, XS, M ,X, L, XXL, XL" }) }
      }
      data.availableSizes = size
    }
   let UpdateProduct= await productModel.fineOneAndUpdate({_id:productId},data)  
   return res.status(201).send({status:true,message:"product updated successfully",data:UpdateProduct})
}
     

  catch(error){
    return res.status(500).send({status:false,message:error.message})
  }
    
}

//============================================Delete Product======================================================//

const deleteProduct= async function(req,res){
  try{
      let productId= req.params.productId
      if(!isValidObjectId(productId)){
        return res.status(400).send({status:false,message:"Please enter valid productId"})
      }
      let findProduct= await productModel.findById(productId)
      if(!findProduct){return res.status(404).send({status:false,message:"Product not found with this Id"})}
      if(findProduct.isDeleted==true){return res.status(400).send({status:false,message:"This product is already deleted"})}

      let product = await productModel.findOneAndUpdate({_id:productId},{$set:{isDeleted:true,deletedAt:Date.now()}},{new:true})
      return res.status(200).send({status:true,message:"deleted successfully",data:product})
  }
  catch(error){
    return res.status(500).send({status:false,message:error.message})
  }
}

module.exports={createProduct,getFilteredProduct,getProduct,updateProduct,deleteProduct}//,getProductByfilter