const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/UserController');

router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);

module.exports = router;