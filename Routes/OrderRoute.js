const router = require('express').Router();
const Order = require('../Models/Order')
const User = require('../Models/User')


// Creating an Order
router.post('/', async (req, res) => {
    const { userId, cart, country, address } = req.body;

    try {
        const user = await User.findById(userId);
        const order = await Order.create({ owner: user._id, products:cart, country:country, address:address,});
        order.count = cart.count;
        order.total = cart.total;
        await order.save();
        // Clear user's cart after creating an order
            // console.log("Before clearing cart:", user.cart);
            // console.log("Modified Cart Before Saving:", user.cart);

        user.cart = { total: 0, count: 0 };
        await user.save();
        // console.log("After clearing cart:", user.cart);
        // console.log("User Object After Saving:", user);
        user.orders.push(order);
        user.markModified('orders');
        await user.save();
        
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json(error.message);
    }
});


// getting all orders;
router.get('/', async(req, res)=> {
    try {
      const orders = await Order.find().populate('owner', ['email', 'name']);
      res.status(200).json(orders);
    } catch (e) {
      res.status(400).json(e.message)
    }
  })

// marked shipping router

router.patch('/:id/mark-shipped',async(req,res)=>{
        const {ownerId} = req.body
        const {id} = req.params;
        try {
            const user = await User.findById(ownerId)
            await Order.findByIdAndUpdate(id, {status: 'shipped'})
            const orders = await Order.find().populate('owner',['email', 'name'])
            await user.save()
            res.status(200).json(orders)
        } catch (error) {
            res.status(400).json(e.message)
        }

})  



module.exports = router