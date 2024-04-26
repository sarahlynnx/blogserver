const express = require('express');
const router = express.Router();
const PostController = require('../controllers/PostController');
const { authMiddleware, requireRole } =  require('../middleware/authMiddleware');

router.post('/', requireRole('author'), PostController.createPost);
router.put('/:id', requireRole('author'), PostController.updatePost);
router.delete('/:id', requireRole('author'), PostController.deletePost);

router.put('/:id/like', authMiddleware, PostController.likePost);
router.put('/:id/view', authMiddleware, PostController.incrementView);

// router.get('/', PostController.getAllPosts);
router.get('/:id', PostController.getPostById);

module.exports = router;