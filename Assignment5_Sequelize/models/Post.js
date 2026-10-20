const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// Required by the assignment: Post uses Model.init().
class Post extends Model {}
Post.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "users", key: "id" } }
}, {
  sequelize, modelName: "Post", tableName: "posts", timestamps: true,
  paranoid: true // destroy() sets deletedAt instead of physically deleting a row.
});
module.exports = Post;
