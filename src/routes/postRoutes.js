const express = require('express');
const router = express.Router();
const PostController = require('../controllers/PostController');
const { authMiddleware, requireRole } =  require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', requireRole('author'), PostController.createPost);
router.put('/:id', requireRole('author'), PostController.updatePost);
router.delete('/:id', requireRole('author'), PostController.deletePost);

router.get('/', PostController.getAllPosts);
router.get('/:id', PostController.getPostById);

module.exports = router;