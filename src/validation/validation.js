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

  module.exports={isValidPincode ,isValidString,isValidPhone,isValidEmail,isValidPswd}