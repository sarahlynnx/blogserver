const Comment = require('../models/comment');

const createComment = async (req, res) => {
    try {

        const { content, postId } = req.body;
        const comment = new Comment({ content, post: postId });
        await comment.save();
        res.status(200).json({ msg: 'Comment created successfully', comment });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
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
        console.error(error.message);
        res.status(500).send('Server Error');
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
        console.error(error.message);
        res.status(500).send('Server Error');
    }
}

const getCommentsByPost = async (req, res) => {
    try {
        const { postId } = res.params;

        let comments = await Comment.find({ post: postId });

        res.status(200).json(comments);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
}

module.exports = { createComment, updateComment, deleteComment, getCommentsByPost };