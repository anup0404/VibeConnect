const { client } = require("../Db/db");
const { asyncHandler } = require("../utils/asyncHandler");
const bcrypt = require("bcrypt");
const { sendMail } = require("../Controllers/sendmail.controller");
const { generateToken } = require("../middleware/authjwt.middleware");
const { logger } = require("../utils/loggers");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");

// Register User

const registerUser = asyncHandler(async (request, response) => {
  const { username, email, password, fullname } = request.body;

  if (
    [username, email, password, fullname].some(
      (field) => !field && field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if username or email already exists

  const checkUserQuery =
    "SELECT * FROM users WHERE username = $1 OR email = $2";
  const checkUserResult = await client.query(checkUserQuery, [username, email]);

  if (checkUserResult.rows.length > 0) {
    throw new ApiError(400, "Username or email already exists");
  }

  // Hash the password before inserting it into the database

  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert new user into database

  const insertUserQuery =
    "INSERT INTO users (username, email, password, fullname) VALUES ($1, $2, $3, $4) RETURNING id, username, email, fullname";
  const insertUserResult = await client.query(insertUserQuery, [
    username,
    email,
    hashedPassword,
    fullname,
  ]);

  const newUser = {
    id: insertUserResult.rows[0].id,
    username: insertUserResult.rows[0].username,
    email: insertUserResult.rows[0].email,
    fullname: insertUserResult.rows[0].fullname,
  };

  await sendMail(
    newUser,
    "Welcome to Our Social Media Platform",
    "Thank you for registering on our social media platform. We are excited to have you join our community"
  );

  response
    .status(201)
    .json(
      new ApiResponse(
        201,
        { user: newUser },
        { message: `User added with ID: ${newUser.id}` }
      )
    );
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  console.table(req.body);

  if (!email && !username) {
    throw new ApiError(400, "Username or email must be provided");
  }

  if (!password) {
    throw new ApiError(400, "Password must be provided");
  }

 
    // Check if the user exists in the database

    const checkUserQuery =
      "SELECT * FROM users WHERE email = $1 and username = $2";
    const checkUserResult = await client.query(checkUserQuery, [
      email,
      username,
    ]);

    if (checkUserResult.rows.length === 0) {
      throw new ApiError(400, "User does not exist");
    }

    const user = checkUserResult.rows[0];

    // compare the provided password with the stored hashed password

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new ApiError(400, "Invalid credentials");
    }

    const token = await generateToken(user);

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("token", token, options)
      .json(
        new ApiResponse(
          200,
          {
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              fullname: user.fullname,
              token,
            },
          },
          "User logged in successfully"
        )
      );
  } 
);

module.exports = { registerUser, loginUser };
