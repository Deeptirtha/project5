const productModel=require("../models/productmodel")
const  { uploadFile }=require("../aws")
const{isValidSize,isValidPrice,isValidObjectId}=  require("../validation/validation")



//=======================================================create product==================================================================

const createProduct= async function(req,res){
    try{
         let data= req.body
         let files= req.files
         let {title, description,price,currencyId,currencyFormat,availableSizes}=data
         if(Object.keys(data).length==0){
            return res.status(400).send({status:false,message:"data should be present in request body"})
         }
         if(!title){return res.status(400).send({status:false,message:"title should be present"})}  

         if(!description){return res.status(400).send({status:false,message:"description should be present"})}

         if(!price){return res.status(400).send({status:false,message:"price should be present"})}
         if(!isValidPrice(price)){return res.status(400).send({status:false,message:"price can be numeric or decimal"})}

         if(!currencyId){return res.status(400).send({status:false,message:"currencyId should be present"})}
         if(currencyId !=="INR"){return res.status(400).send({status:false,message:"currencyId should be in INR format"})}

         if(!currencyFormat){return res.status(400).send({status:false,message:"currencyFormat should be present"})}
         if(currencyFormat!=="₹"){return res.status(400).send({status:false,message:"currencyFormat should be this-₹ "})}

         
         let uploadImage= await uploadFile(files[0])
         if(!uploadImage){return res.status(400).send({status:false,message:"productImage should be present"})}
         data.productImage=uploadImage

      if(availableSizes){
        var size= availableSizes.split(" ")
         for(let i=0;i<size.length;i++){   
         if(!isValidSize(size[i])){return res.status(400).send({status:false,message:"available sizes can be only these-S, XS, M ,X, L, XXL, XL"})}
         }
            data.availableSizes=size
        }
         let product= await productModel.create(data)  
         return res.status(201).send({status:true,message:"product created successfully",data:product})
    }
    catch(error){
         if(error.code==11000){return res.status(400).send({status:false,message:"title should be unique"})}

        return res.status(500).send({status:false,message:error.message})
    }
}

//=======================================================GET PRODUCT BY QUERY PARAMS========================================================


const getFilteredProduct = async function (req, res){
    try {
      let data = req.query
      let conditions = { isDeleted: false };
  
     if(!data) {
        let getProducts = await Product.find(conditions).sort({ price: 1 });
        if(getProducts.length == 0) return res.status(404).send({ status: false, message: "No products found" });
         return res.status(200).send({ status: true,message: "Success", data: getProducts })
      }

      if(data.size) {
        data.size = data.size.toUpperCase();
        if(!isValidSize(data.size)) return res.status(400).send({ status: false, message: "please enter a valid  size" })
        conditions.availableSizes = {$in:data.size}}
  
      if(data.name) {conditions.title = {$regex:data.name}}
  
      
      if(data.priceGreaterThan || data.priceLessThan) {
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



  //========================================================GET PRODUCT BY ID==============================================================
  
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





module.exports={createProduct,getFilteredProduct,getProduct}