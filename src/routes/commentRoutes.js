const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/CommentController');

router.post('/comments', CommentController.createComment);
router.put('/comments/:id', CommentController.updateComment);
router.delete('/comments/:id', CommentController.deleteComment);
router.get('/posts/:postId/comments', CommentController.getCommentsByPost);

module.exports = router;