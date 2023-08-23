const express = require('express');
const app = express()
const http = require('http');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const server = http.createServer(app)
require('./Connection/Connection')
const { Server } = require('socket.io');
const cors = require('cors')
const io = new Server(server, {
    cors:'*',
    methods:'*'
})

const User = require('./Models/User')
const userRoutes = require('./Routes/userRoutes')
const productRoutes = require('./Routes/ProductRoutes')
const ImageRoutes = require('./Routes/imagesRoutes');
const orderRoutes = require('./Routes/OrderRoute')

app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use('/users',userRoutes)
app.use('/products',productRoutes)
app.use('/images',ImageRoutes)
app.use('/orders',orderRoutes)

app.post('/create-payment', async (req, res) => {
    const { amount, address, country, userId } = req.body;
    try {
      if (!userId) {
          return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
          amount,
          currency: 'usd',
          payment_method_types: ['card'],
          description: 'successful payment',
          shipping: {
              name: user.name,
              address: {
                  line1: address.line1,
                  line2: address.line2,
                  city: address.city,
                  postal_code: address.postal_code,
                  state: address.state,
                  country:country,
              },
          },
      });

      console.log("Created PaymentIntent:", paymentIntent);
      res.status(200).json(paymentIntent);
  } catch (e) {
      console.log(e.message);
      console.log("Error creating PaymentIntent:", e.message);
      res.status(400).json(e.message);
  }
});



server.listen(8080,()=>{
    console.log('server is running on port 8080');
})

app.set('socketio',io);
