const mongoose= require("mongoose")
//=========================================VALIDATIONS=====================================================//
const isValidObjectId = (objectId) => {
    return mongoose.Types.ObjectId.isValid(objectId)
}
  

const isValidEmail = function (value) {
    return /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(value);
  };
  
 
  const isValidPassword = function(value){
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,15}$/.test(value)
   
 };

 const isValidString = (String) => {
  return /\d/.test(String)
}

const isValidPincode = (num) => {
  return /^[0-9]{6}$/.test(num);
}

const isValidPhone = (Mobile) => {
  return /^[6-9]\d{9}$/.test(Mobile)
}

const isValidPswd = (Password) => {
  return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(Password)
}
  module.exports={isValidObjectId, isValidPswd,isValidEmail,isValidString ,isValidPincode, isValidPhone }