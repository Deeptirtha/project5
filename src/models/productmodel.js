const mongoose= require("mongoose")

const productSchema= new mongoose.Schema({
    title: {type:String,required:true, unique:true,trim:true},
    description: {type:String, reuired:true,trim:true},
    price: {type:Number,required:true,trim:true},
    currencyId: {type:String, required:true,trim:true},//, INR
    currencyFormat: {type:String, required:true,trim:true},//, Rupee symbol
    isFreeShipping: {type:Boolean, default: false},
    productImage: {type:String,required:true},  // s3 link
    style: {type:String,trim:true},
    availableSizes: {type:[String],  enum:["S", "XS","M","X", "L","XXL", "XL"],trim:true},
    installments: {type:Number},
    deletedAt: {type:Date}, 
    isDeleted: {type:Boolean, default: false},
},{timestamps:true})

module.exports=mongoose.model("Product",productSchema)

//{title, description,price,currencyId,currencyFormat,isFreeShipping,productImage,style,availableSizes,installments}

//₹