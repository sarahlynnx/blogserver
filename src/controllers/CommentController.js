const Comment = require('../models/comment');

const createComment = async (req, res, next) => {
    try {
        const { content, postId } = req.body;
        const userId = req.user._id;
        const createdAt = new Date();

        const comment = new Comment({ content, author: userId, post: postId, createdAt });
        await comment.save();
        const populatedComment = await Comment.findById(comment._id).populate('author', 'name email _id');
        res.status(200).json({ msg: 'Comment created successfully', comment: populatedComment });

    } catch (error) {
        next(error);
    }
}

const updateComment = async (req, res, next) => {
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

const deleteComment = async (req, res, next) => {
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

const getCommentsByPost = async (req, res, next) => {
    try {

        const { postId } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        if (!postId) {
            return res.status(400).json({ msg: 'Bad request: Query param: PostId is mandatory' });
        }

        const total = await Comment.countDocuments({ post: postId });
        const totalPages = Math.ceil(total / limit);

        let comments = await Comment
            .find({ post: postId })
            .populate('author', 'name email')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            comments,
            currentPage: page,
            totalPages,
            totalComments: total
        });
    } catch (error) {
        next(error);
    }
}

module.exports = { createComment, updateComment, deleteComment, getCommentsByPost };