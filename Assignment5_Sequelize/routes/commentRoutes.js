const router = require("express").Router();
const c = require("../controllers/commentController");
router.post("/find-or-create", c.findOrCreate);
router.get("/search", c.search);
router.get("/newest/:postId", c.newestForPost);
router.get("/details/:id", c.details);
router.post("/", c.bulkCreate);
router.patch("/:commentId", c.updateContent);
module.exports = router;
