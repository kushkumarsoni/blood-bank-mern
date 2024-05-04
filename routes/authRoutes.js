const express = require('express')
const { registerController, loginController,currentUserController } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router()

//routes || register
router.post("/register",registerController);

//login
router.post("/login",loginController);

//current user
router.get('/user',authMiddleware,currentUserController);

module.exports = router