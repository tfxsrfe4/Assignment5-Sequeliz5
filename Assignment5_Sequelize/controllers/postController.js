const { Post, User, Comment } = require("../models");
const { literal } = require("sequelize");

function sendError(res, error) {
  if (["SequelizeValidationError", "SequelizeForeignKeyConstraintError"].includes(error.name))
    return res.status(400).json({ message: error.message });
  console.error(error);
  return res.status(500).json({ message: "Internal server error" });
}

// POST /posts: create a new instance and save().
exports.createPost = async (req, res) => {
  try {
    const { title, content, userId } = req.body;
    if (!title || !content || !userId)
      return res.status(400).json({ message: "title, content and userId are required." });
    const post = new Post({ title, content, userId });
    await post.save();
    return res.status(201).json({ message: "Post created successfully", post });
  } catch (error) { return sendError(res, error); }
};

// DELETE /posts/:postId; expects owner userId in body. paranoid=true enables soft delete.
exports.deletePost = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "userId is required in the body." });
    const post = await Post.findByPk(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found." });
    if (Number(post.userId) !== Number(userId))
      return res.status(403).json({ message: "Only the post owner can delete this post." });
    await post.destroy();
    return res.json({ message: "Post soft-deleted successfully." });
  } catch (error) { return sendError(res, error); }
};

// GET /posts/details
exports.getPostDetails = async (_req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: ["id", "title"],
      include: [
        { model: User, as: "user", attributes: ["id", "name"] },
        { model: Comment, as: "comments", attributes: ["id", "content"] }
      ],
      order: [["createdAt", "DESC"]]
    });
    return res.json({ count: posts.length, posts });
  } catch (error) { return sendError(res, error); }
};

// GET /posts/comment-count
exports.getCommentCounts = async (_req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: [
        "id", "title",
        [literal("(SELECT COUNT(*) FROM comments AS c WHERE c.postId = Post.id)"), "commentCount"]
      ],
      order: [["createdAt", "DESC"]]
    });
    return res.json({ count: posts.length, posts });
  } catch (error) { return sendError(res, error); }
};
