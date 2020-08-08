const mongoose = require('mongoose');

//you should save company in company model then create relationship
const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  rangeEmployee: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
  },
  date: {
    type: String,
    default: Date.now,
  },
});

userSchema.methods={
  //this removes password from response
  toJSON:function(){
    let obj=this. toObject();
    ['password'].forEach((item)=>{
      delete obj[item];
    })
  }
}

const User = mongoose.model('User', userSchema);
module.exports = User;
