const Post = require('../Models/post');

const createPost = async (req, res) => {
    try {
        const { title, content, author } = req.body;
        const post = new Post({ title, content, author });
        await post.save();
        res.status(200).json({ msg: 'Post created successfully', post});
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

const getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

const updatePost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const { id } = req.params;

        const post = await Post.findByIdAndUpdate(id, {title, content }, {new: true});

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(200).json({ msg: 'Post updated successfully', post });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findByIdAndDelete(id);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        res.status(200).json({ msg: 'Post delted successfully' });

    } catch (error) { 
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

module.exports = { createPost, getPostById, updatePost, deletePost };