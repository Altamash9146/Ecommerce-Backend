const userRoutes = require('express').Router();
const { Signup, Login, getUsers, getUserOrder } = require('../Auth/userAuth');



userRoutes.post('/register', Signup);
userRoutes.post('/login', Login);
userRoutes.get('/', getUsers);
userRoutes.get('/:id/orders', getUserOrder);

module.exports = userRoutes;
