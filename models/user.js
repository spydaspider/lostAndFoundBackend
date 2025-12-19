const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const validator = require('validator');
const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },

  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

UserSchema.statics.signup = async function(username,email,password){
       if(!username || !email || !password)
       {
          throw Error('Fill in all fields');
       }
       const usernameExists = await this.findOne({username});
       const emailExists = await this.findOne({email});
       if(usernameExists)
       {
        throw Error('Username already taken');
       }
       if(emailExists)
       {
        throw Error('Email already taken');
       }
       if(!validator.isEmail(email))
       {
        throw Error('Enter a valid email address');
       }
       if(!validator.isStrongPassword(password))
       {
        throw Error('Password is weak');
       }
       const salt = await bcrypt.genSalt(10);
       const hash = await bcrypt.hash(password, salt);
       const user = await this.create({username, email, password:hash, role: 'user'});
       return user;
}
UserSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error('Enter email and password');
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw Error('Email is incorrect');
  }

  if (!user.isActive) {
    throw Error('Account is deactivated');
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error('Password is incorrect');
  }

  return user;
};
module.exports = mongoose.model('User', UserSchema);