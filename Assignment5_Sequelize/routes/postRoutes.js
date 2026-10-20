const router = require("express").Router();
const c = require("../controllers/postController");
router.get("/details", c.getPostDetails);
router.get("/comment-count", c.getCommentCounts);
router.post("/", c.createPost);
router.delete("/:postId", c.deletePost);
module.exports = router;
