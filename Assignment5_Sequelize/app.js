const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const { getByIdWithoutRole } = require("./controllers/userController");

app.use(express.json());
app.get("/", (_req, res) => res.json({ message: "Assignment 5 Sequelize API is running." }));
app.use("/users", userRoutes);
app.get("/user/:id", getByIdWithoutRole);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);
app.use((req, res) => res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` }));
module.exports = app;
