const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

//Creating Schema(structure)
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please Enter Email Address'],
        unique: [true, 'This Email already Exists'],
        lowercase: true,
        validate: [isEmail , 'Please Enter Valid Email Address'],
    } ,
    password: {
        type: String,    
        required: [true, 'Please Enter Password'],
        minlength: [8,'Password should be atleast 8 characters'],
    },
});

//Hash password with bcrypt
userSchema.pre('save',async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//for login checking that data exists or not
userSchema.statics.login = async function(email,password){
    const user = await this.findOne({email});
    if(user)
    {
      const auth =   await bcrypt.compare(password,user.password);
        if(auth)
        {
            return user;
        }
        throw Error('Incorrect Password');
    }
    throw Error('Incorrect Email')
}


//Creating product
const user = mongoose.model('user',userSchema);
module.exports = user;