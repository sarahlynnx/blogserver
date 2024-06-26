const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/CommentController');
const { authMiddleware } =  require('../middleware/AuthenticationMiddleware');

router.post('/', authMiddleware, CommentController.createComment);
router.put('/:id', authMiddleware,  CommentController.updateComment);
router.delete('/:id', authMiddleware,  CommentController.deleteComment);
router.get('/', CommentController.getCommentsByPost);

module.exports = router;