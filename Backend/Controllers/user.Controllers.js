const { client } = require("../Db/db");
const { asyncHandler } = require("../utils/asyncHandler");
const bcrypt = require("bcrypt");
const { sendMail } = require("../Controllers/sendmail.controller");
const { generateToken } = require("../middleware/authjwt.middleware");
const { logger } = require("../utils/loggers");

const { ApiResponse } = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

const registerUser = asyncHandler(async (request, response) => {
  const { username, email, password, fullname } = request.body;

  try {
    // Validate input fields

    if (!username || !email || !password || !fullname) {
      throw new ApiError(400, "All fields are required");
    }

    // Check if username or email already exists in the database

    const checkUserQuery =
      "SELECT * FROM users WHERE username = $1 OR email = $2";
    const checkUserResult = await client.query(checkUserQuery, [
      username,
      email,
    ]);

    if (checkUserResult.rows.length > 0) {
      throw new ApiError(400, "Username or email already exists");
    }

    // Hash the password before inserting it into the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into database
    const insertUserQuery =
      "INSERT INTO users (username, email, password, fullname,isactive,role) VALUES ($1, $2, $3, $4,$5,$6) RETURNING id, username, email, fullname,isactive,role";
    const insertUserResult = await client.query(insertUserQuery, [
      username,
      email,
      hashedPassword,
      fullname,
      "yes",
      "user",
    ]);

    // Construct the new user object from the database response
    const newUser = {
      id: insertUserResult.rows[0].id,
      username: insertUserResult.rows[0].username,
      email: insertUserResult.rows[0].email,
      fullname: insertUserResult.rows[0].fullname,
    };

    //  send a welcome email to the new user
    await sendMail(
      newUser,
      "Welcome to Our Social Media Platform",
      "Thank you for registering on our social media platform. We are excited to have you join our community."
    );

    // Respond with a success message and the new user's details

    response.status(201).json({
      status: 201,
      data: {
        user: newUser,
      },
      message: `User added with ID: ${newUser.id}`,
    });
  } catch (error) {
    console.error(`Error in registerUser: ${error.message}`);
    if (error instanceof ApiError) {
      response.status(error.statusCode).json({ error: error.message });
    } else {
      response.status(500).json({ error: "Internal Server Error" });
    }
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password must be provided");
  }

 
    // Check if the user exists in the database
    const checkUserQuery = "SELECT * FROM users WHERE email = $1 and isactive=$2";
    const checkUserResult = await client.query(checkUserQuery, [email,'yes']);

    if (checkUserResult.rows.length === 0) {
   throw new ApiError(400, "User does not exist");
    }

     const user = checkUserResult.rows[0];

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new ApiError(400, "Invalid credentials");
    }

    // Generate JWT token for the user
    const token = await generateToken(user);

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
      sameSite: "strict",
    };

    // Set token in cookie and send JSON response
    return res
      .status(200)
      .cookie("token", token, options)
      .json(new ApiResponse( 200,{user: {
            id: user.id,
            username: user.username,
            email: user.email,
            fullname: user.fullname,
            token,
          
        }},
       "User logged in successfully",
      ));
});






const updateUser = asyncHandler(async (req, res, next) => {
  const { username, email, fullname,role} = req.body;
  const userId=req.params.id;
  
  try {

    if (!req.user) {
      throw new ApiError(401, 'Unauthorized: User not authenticated');
    }


    if (role !== 'user') {
      throw new ApiError(403, 'Forbidden: You do not have permission to perform this action');
    }


    // check the user
    const checkUserQuery = "SELECT * FROM users WHERE id = $1";
    const checkUserResult = await client.query(checkUserQuery, [userId]);

    if (checkUserResult.rows.length === 0) {
      throw new ApiError(400, "User does not exist");
    }



    const updateUserQuery = `
      UPDATE users 
      SET username = $1, fullname = $2 
     ,email = $3 where id=$4`;


    const updateUserValues = [username, fullname, email,userId];


    const updateResult = await client.query(updateUserQuery, updateUserValues);


    if (updateResult.rowCount === 1) {
      const updatedUser = {
        username: username,
        email: email,
        fullname: fullname,
      };


      return res.status(200).json(new ApiResponse(200, updatedUser, "User updated successfully"));
    } else {

      return res.status(404).json(new ApiError(404, "User not found or update failed"));
    }
  } catch (err) {
    if (err instanceof ApiError) {
      return res.status(err.statusCode).json({ error: err.message });
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
});


// delete the user 

const deleteUser=asyncHandler(async(req,res)=>{
  const userId =req.params.id;
  console.log(userId)
  try{

   // check user
    const checkUserQuery = "SELECT * FROM users WHERE id = $1";
    const checkUserResult = await client.query(checkUserQuery, [userId]);

    if (checkUserResult.rows.length === 0) {
      throw new ApiError(400, "User does not exist");
    }

    const deleteUserQuery = `
      UPDATE users 
      SET isactive=$1
      WHERE id= $2`;
      const deleteResult = await client.query(deleteUserQuery, ['no',userId]);
      if (deleteResult.rowCount === 1) {
    
        return res.status(200).json(new ApiResponse(200, {}, "User deleted successfully"));
      } else {
        return res.status(404).json(new ApiError(404, "User not found or delete failed"));
      }


  }catch(error){
    
    if (err instanceof ApiError) {
      return res.status(err.statusCode).json({ error: err.message });
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }

  }
})
// read the user

// const getUser = asyncHandler((req, res) => {});

module.exports = { registerUser, loginUser,updateUser,deleteUser };
