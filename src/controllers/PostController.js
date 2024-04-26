const Post = require('../Models/post');

const createPost = async (req, res, next) => {
    try {
        const { title, content, author, images } = req.body;
        const post = new Post({ title, content, author, images });
        await post.save();
        res.status(200).json({ msg: 'Post created successfully', post});
    } catch (error) {
        next(error);
    }
};

const getPostById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id).populate('comments');

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        res.status(200).json(post);
    } catch (error) {
        next(error);
    }
};

const updatePost = async (req, res, next) => {
    try {
        const { title, content } = req.body;
        const { id } = req.params;

        const post = await Post.findByIdAndUpdate(id, {title, content }, {new: true});

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(200).json({ msg: 'Post updated successfully', post });

    } catch (error) {
        next(error);
    }
};

const deletePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const post = await Post.findByIdAndDelete(id);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        res.status(200).json({ msg: 'Post delted successfully' });

    } catch (error) { 
        next(error);
    }
};

const likePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const post = await Post.findByIdAndUpdate(
            id,
            {$inc: {likes: 1} },
            {new: true}
        );
        if (!post) {
            return res.status(404).json({ msg: 'Post not found'});
        }
        res.status(200).json({ msg: 'Like added successfully'});
    } catch (error) {
        next(error);
    }
};

const incrementView = async () => {
    try {
        const { id } = req.params;
        await Post.findByIdAndUpdate(
            id, 
            { $inc: { views: 1} },
            {new: false}
        );
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = { createPost, getPostById, updatePost, deletePost, likePost, incrementView };