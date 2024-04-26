const Comment = require('../models/comment');

const createComment = async (req, res, next) => {
    try {

        const { content, postId } = req.body;
        const userId = req.user.id;
        const createdAt = new Date();

        const comment = new Comment({ content, author: userId, post: postId, createdAt });
        await comment.save();
        res.status(200).json({ msg: 'Comment created successfully', comment });

    } catch (error) {
        next(error);
    }
}

const updateComment = async (req, res) => {
    try {
        const { content } = req.body;
        const { id } = req.params;

        let comment = await Comment.findByIdAndUpdate(id, { content }, { new: true });

        if (!comment) {
            return res.status(404).json({ msg: 'Comment not found' });
        }

        res.status(200).json({ msg: 'Comment updated succesfully' });
    } catch (error) {
        next(error);
    }
}

const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        let comment = await Comment.findByIdAndDelete(id);

        if (!comment) {
            return res.status(404).json({ msg: 'Comment not found' });
        }
        res.status(200).json({ msg: 'Comment deleted successfully' });
    } catch (error) {
        next(error);
    }
}

const getCommentsByPost = async (req, res) => {
    try {
        const { postId } = res.params;

        let comments = await Comment.find({ post: postId });

        res.status(200).json(comments);
    } catch (error) {
        next(error);
    }
}

module.exports = { createComment, updateComment, deleteComment, getCommentsByPost };