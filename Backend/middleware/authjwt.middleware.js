const jwt = require("jsonwebtoken");
const { ApiError } = require("../utils/ApiError");
const { client } = require("../Db/db");

// const verifyJwtAuth = (req, res, next) => {
//   try {
//     // Extract the jwt token from the request header or cookies
//     const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

//     if (!token) {
//       throw new ApiError(401,"Unauthorized request")

//     }

//     // Verify the jwt token
//     const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

   
//     req.user = decodedToken; 
//     next();
//   } catch (error) {
//    throw new ApiError(401,error.message || "Invalid access token" );
//   }
// };


const verifyJwtAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError(401, 'Unauthorized request');
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

  
      // const result = await client.query('SELECT id, username, email,fullname FROM users WHERE id = $1', [
      //   decodedToken.id,
      // ]);
      const checkUserQuery = "SELECT * FROM users WHERE id = $1";
      const checkUserResult = await client.query(checkUserQuery, [decodedToken.id,]);
      //password nhi bhejna h


      if (checkUserResult.rows.length === 0) {
        throw new ApiError(401, 'Invalid Access Token');
      }

      req.user = checkUserResult.rows[0]; 
      next();
    
  } catch (error) {
    console.log(`Error in verify ${error.message}`);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}


module.exports = verifyJwtAuth;


// Function to generate jwt token
const generateToken = (userData) => {
  return jwt.sign(userData, process.env.JWT_SECRET_KEY);
};


module.exports = {
  verifyJwtAuth,
  generateToken,
};
