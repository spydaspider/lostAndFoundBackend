const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const createToken = (user) =>{
    return jwt.sign({_id: user._id, role: user.role},process.env.SECRET,{expiresIn: '3d'});
}



//signup
// controller
const signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.signup(username, email, password);
    const token = createToken(user);
    res.status(200).json({
      email: user.email,
      role: user.role,
      username: user.username,   //  add this
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user);
    res.status(200).json({
      email: user.email,
      role: user.role,
      username: user.username,   //  add this
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access only' });
    }

    const token = createToken(user);

    res.status(200).json({
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getUsers = async(req,res)=>{
  try{
    const users = await User.find();
    res.status(201).json(users);
  }
  catch(error){
    return res.status(401).json({error: "User not found"})
  }
}


module.exports = { signup, login,adminLogin,getUsers };