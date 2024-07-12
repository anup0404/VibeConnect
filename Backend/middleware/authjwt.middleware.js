const jwt = require("jsonwebtoken");

const veryfyJwtAuth = (req, res, next) => {
  try {
    // extract the jwt token from the request header

    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Unauthorized request" });
    }

    //verify the jwt token

    const decodedtoken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // ATTACH USER INFORMATION TO THE REQUEST OBJECT
    res.user = decodedtoken;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ error: error?.message || "Invalid access token" });
  }
};


// function to generate jwt token 

const generateToken=(userData)=>{

    // generating a new jwt token using userData
    return jwt.sign(userData,process.env.JWT_SECRET_KEY)
}

module.exports={veryfyJwtAuth,generateToken}
