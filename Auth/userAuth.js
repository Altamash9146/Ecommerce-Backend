const User  = require('../Models/User')
const Order = require('../Models/Order')


const Signup = async (req,res)=>{
    const {name, number,email,password} = req.body

    try {
        const user = await User.create({name, number,email,password})
        res.json(user)  
        
    } catch (error) {
        if(error.code === 11000) return res.status(400).send(
            'Email Already Exists'
        )
        res.status(400).send(error.message)
    }
     
}


const Login = async (req,res)=>{
    const {email,password} = req.body
   
    console.log(req.body);
    try {
        const user = await User.findByCredentials(email, password)
        res.json(user)
    } catch (error) {
        res.status(400).send(error.message)
    }
}

// get users;

const getUsers = async (req, res) => {
    try {
      const users = await User.find({ isAdmin: false }).populate('orders');
      res.json(users);
    } catch (e) {
      res.status(400).send(e.message);
    }
  }

  // get user orders
  
  const getUserOrder = async (req, res) => {
    const {id} = req.params;
    try {
      const user = await User.findById(id).populate('orders');
      res.json(user.orders);
    } catch (e) {
      res.status(400).send(e.message);
    }
  }

module.exports = {Login,Signup,getUsers,getUserOrder}