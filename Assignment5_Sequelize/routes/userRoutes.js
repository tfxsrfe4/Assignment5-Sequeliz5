const router = require("express").Router();
const c = require("../controllers/userController");
router.post("/signup", c.signup);
router.put("/:id", c.upsertById);
router.get("/by-email", c.getByEmail);
module.exports = router;
