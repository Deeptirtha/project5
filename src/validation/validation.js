const mongoose= require("mongoose")
//=========================================VALIDATIONS=====================================================//
const isValidObjectId = (objectId) => {
    return mongoose.Types.ObjectId.isValid(objectId)
}
const validword=function(name){
  const regexName=/^(.|\s)*[a-zA-Z]+(.|\s)*$/;
 
  return regexName.test(name)
}
  
  const isValidString = (String) => {
    return /\d/.test(String)
  }

  const isValidPincode = (num) => {
    return /^[0-9]{6}$/.test(num);
  }
  
  const isValidPhone = (Mobile) => {
    return /^[6-9]\d{9}$/.test(Mobile)
  }
  
  const isValidEmail = (Email) => {
    return  /^([A-Za-z0-9._]{3,}@[A-Za-z]{3,}[.]{1}[A-Za-z.]{2,6})+$/.test(Email)
  }
  
  const isValidPswd = (Password) => {
    return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(Password)
  }

  const isValidSize = (size) => {
    let correctTitle = ["S", "XS","M","X", "L","XXL", "XL"];
        if (correctTitle.includes(size)) {
          return true
        } else {
          return false
        }
      }
  function isValidPrice(input){
        var RE = /^-{0,1}\d*\.{0,1}\d+$/;
        return (RE.test(input));
      }
      const isValidStatus = (size) => {
        let status = ["pending", "completed", "canceled"];
            if (status.includes(size)) {
              return true
            } else {
              return false
            }
          }

  module.exports={validword,isValidObjectId,isValidPincode ,isValidString,isValidPhone,isValidEmail,isValidPswd,isValidSize,isValidPrice,isValidStatus}