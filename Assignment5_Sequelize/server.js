require("dotenv").config();
const app = require("./app");
const { sequelize } = require("./models");
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Database connection established.");
    await sequelize.sync({ alter: true });
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  } catch (error) {
    console.error("Unable to start:", error.message);
    process.exit(1);
  }
}
startServer();
