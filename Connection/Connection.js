const dotenv = require('dotenv');
dotenv.config()

const mongoose = require('mongoose');

const connectionStr = `mongodb+srv://${process.env.Mongo_Username}:${process.env.Mongo_Password}@cluster0.1q7zwyp.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(connectionStr, {useNewUrlparser: true})
.then(()=>{
    console.log('connected to mongoDB');
}).catch((err)=>{
    console.log(err);
})

mongoose.connection.on('error',err=>{
    console.log(err);
})

