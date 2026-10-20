const { User } = require("../models");
const { ValidationError, UniqueConstraintError } = require("sequelize");

const publicUser = (user) => {
  if (!user) return user;
  const data = user.toJSON();
  delete data.password;
  return data;
};
function sendError(res, error) {
  if (error instanceof ValidationError || error instanceof UniqueConstraintError) {
    return res.status(400).json({
      message: "Validation failed",
      errors: error.errors ? error.errors.map(e => e.message) : [error.message]
    });
  }
  console.error(error);
  return res.status(500).json({ message: "Internal server error" });
}

// POST /users/signup: build() then save(), checking duplicate email first.
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "name, email and password are required." });

    if (await User.findOne({ where: { email } }))
      return res.status(409).json({ message: "Email already exists." });

    const user = User.build({ name, email, password, role });
    await user.save();
    return res.status(201).json({ message: "User created successfully", user: publicUser(user) });
  } catch (error) { return sendError(res, error); }
};

// PUT /users/:id: update an existing PK or create it; skip model validation as required.
exports.upsertById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0)
      return res.status(400).json({ message: "id must be a positive integer." });

    const data = {};
    for (const key of ["name", "email", "password", "role"])
      if (req.body[key] !== undefined) data[key] = req.body[key];
    if (!Object.keys(data).length)
      return res.status(400).json({ message: "Provide at least one user field in the body." });

    const user = await User.findByPk(id);
    if (user) {
      await user.update(data, { validate: false });
      return res.status(200).json({ message: "User updated; validation skipped.", user: publicUser(user) });
    }
    const created = await User.create({ id, ...data }, { validate: false });
    return res.status(201).json({ message: "User created; validation skipped.", user: publicUser(created) });
  } catch (error) { return sendError(res, error); }
};

exports.getByEmail = async (req, res) => {
  try {
    if (!req.query.email) return res.status(400).json({ message: "email query parameter is required." });
    const user = await User.findOne({ where: { email: req.query.email } });
    if (!user) return res.status(404).json({ message: "User not found." });
    return res.json({ user: publicUser(user) });
  } catch (error) { return sendError(res, error); }
};

// Assignment specifies /user/:id and asks to exclude role.
exports.getByIdWithoutRole = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["role", "password"] }
    });
    if (!user) return res.status(404).json({ message: "User not found." });
    return res.json({ user });
  } catch (error) { return sendError(res, error); }
};
