const { Op } = require("sequelize");
const { Comment, User, Post } = require("../models");

function sendError(res, error) {
  if (["SequelizeValidationError", "SequelizeForeignKeyConstraintError"].includes(error.name))
    return res.status(400).json({ message: error.message });
  console.error(error);
  return res.status(500).json({ message: "Internal server error" });
}

// POST /comments: request body is an array of comments.
exports.bulkCreate = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || !req.body.length)
      return res.status(400).json({ message: "Send a non-empty array of comments." });
    const comments = await Comment.bulkCreate(req.body, { validate: true });
    return res.status(201).json({ message: "Comments created successfully", count: comments.length, comments });
  } catch (error) { return sendError(res, error); }
};

// PATCH /comments/:commentId: body contains userId and content.
exports.updateContent = async (req, res) => {
  try {
    const { userId, content } = req.body;
    if (!userId || typeof content !== "string" || !content.trim())
      return res.status(400).json({ message: "userId and non-empty content are required." });
    const comment = await Comment.findByPk(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found." });
    if (Number(comment.userId) !== Number(userId))
      return res.status(403).json({ message: "Only the comment owner can update it." });
    comment.content = content.trim();
    await comment.save();
    return res.json({ message: "Comment updated successfully", comment });
  } catch (error) { return sendError(res, error); }
};

// POST /comments/find-or-create
exports.findOrCreate = async (req, res) => {
  try {
    const { postId, userId, content } = req.body;
    if (!postId || !userId || !content)
      return res.status(400).json({ message: "postId, userId and content are required." });
    const [comment, created] = await Comment.findOrCreate({
      where: { postId, userId, content }, defaults: { postId, userId, content }
    });
    return res.status(created ? 201 : 200).json({ created, comment });
  } catch (error) { return sendError(res, error); }
};

// GET /comments/search?word=the — required find and count.
exports.search = async (req, res) => {
  try {
    const word = req.query.word;
    if (!word) return res.status(400).json({ message: "word query parameter is required." });
    const where = { content: { [Op.like]: `%${word}%` } };
    const [comments, count] = await Promise.all([
      Comment.findAll({ where, order: [["createdAt", "DESC"]] }),
      Comment.count({ where })
    ]);
    return res.json({ count, comments });
  } catch (error) { return sendError(res, error); }
};

// GET /comments/newest/:postId
exports.newestForPost = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { postId: req.params.postId },
      order: [["createdAt", "DESC"]], limit: 3
    });
    return res.json({ count: comments.length, comments });
  } catch (error) { return sendError(res, error); }
};

// GET /comments/details/:id
exports.details = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id, {
      include: [
        { model: User, as: "user", attributes: ["id", "name", "email"] },
        { model: Post, as: "post", attributes: ["id", "title", "content"] }
      ]
    });
    if (!comment) return res.status(404).json({ message: "Comment not found." });
    return res.json({ comment });
  } catch (error) { return sendError(res, error); }
};
