const Post = require('../Models/post');
const Comment = require('../models/comment');
const path = require('path');

const createPost = async (req, res, next) => {
    try {
        const { title, content } = req.body;
        const images = req.files.map(file => ({
            filename: file.filename, 
            path: file.path
        }));
        console.log(images); 
        const post = new Post({ 
            title, 
            content, 
            author: req.user._id,
            images
        });
        await post.save();
        console.log('Saved Post:', post);
        const populatedPost = await Post.findById(post._id).populate('author', 'name email');

        res.status(200).json({ msg: 'Post created successfully', post: populatedPost });
    } catch (error) {
        next(error);
    }
};


const getAllPosts = async (req, res, next) => {
    try {
        const posts = await Post.find()
            .populate("author", "name email");
        const modifiedPosts = posts.map(post => {
            const postObject = post.toObject();
            postObject.content = post.content.length > 139 ? post.content.substring(0, 138) + "..." : post.content;
            return postObject;
        });
        res.status(200).json(modifiedPosts);
    } catch (error) {
        next(error);
    }
};

const getPostById = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log(`Fetching post ${id} and incrementing view count`);
        const post = await Post.findByIdAndUpdate(
            id,
            { $inc: { views: 1} },
            { new: true }
            )
            .populate('comments')
            .populate("author", "name email");

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        res.status(200).json(post);
    } catch (error) {
        next(error);
    }
};

const getPostImage = async (req, res, next) => {
    try {
      const { postId, imageId } = req.params;
      const post = await Post.findById(postId);
  
      if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
      }
  
      const image = post.images.find(img => img._id.toString() === imageId);
      if (!image) {
        return res.status(404).json({ msg: 'Image not found' });
      }
      res.sendFile(path.resolve(__dirname, '..', '..', image.path));
    } catch (error) {
      next(error);
    }
  };

const updatePost = async (req, res, next) => {
    try {
        const { title, content } = req.body;
        const { id } = req.params;

        const post = await Post.findByIdAndUpdate(id, { title, content }, { new: true });

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
        await Comment.deleteMany({ post: id });
        const post = await Post.findByIdAndDelete(id);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        res.status(200).json({ msg: 'Post and post comments deleted successfully' });

    } catch (error) {
        next(error);
    }
};

const likePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user._id; 

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        const index = post.likedBy.indexOf(userId);
        let update;
        if (index === -1) {
            update = {
                $inc: { likes: 1 },
                $push: { likedBy: userId }
             };
        } else {
            update = {
                $inc: { likes: -1 },
                $pull: { likedBy: userId }
            };
        }

        const updatedPost = await Post.findByIdAndUpdate(id, update, { new: true });
        if (!updatedPost.likedBy) {
            updatedPost.likedBy = []; 
        }
        res.status(200).json({
            likes: updatedPost.likes,
            likedByUser: updatedPost.likedBy.includes(userId),
            msg: index === -1 ? 'Like added successfully' : 'Like removed successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { createPost, getAllPosts, getPostById, getPostImage, updatePost, deletePost, likePost };