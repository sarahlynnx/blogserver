const express = require('express');
const router = express.Router();
const PostController = require('../controllers/PostController');
const { authMiddleware, requireRole } =  require('../middleware/AuthenticationMiddleware');
const { uploadMiddleware } = require('../middleware/FileUploadMiddleware');

router.post('/', requireRole('author'), uploadMiddleware, PostController.createPost);
router.put('/:id', requireRole('author'), PostController.updatePost);
router.delete('/:id', requireRole('author'), PostController.deletePost);

router.put('/:id/like', authMiddleware, PostController.likePost);

router.get('/', PostController.getAllPosts);
router.get('/:id', PostController.getPostById);
router.get('/:postId/image/:imageId', PostController.getPostImage);

module.exports = router;