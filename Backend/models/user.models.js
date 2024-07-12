// const { client } = require("./db");

// const registerUser = (request, response) => {
//   // get user details from frontend
//   // validation - not empty
//   // check if user already exists: username, email
//   // check for images, check for avatar
//   // upload them to cloudinary, avatar
//   // create user object - create entry in db
//   // remove password and refresh token field from response
//   // check for user creation
//   // return res

//   const { username, email, password, fullname } = request.body;

//   if (
//     [username, email, password, fullname].some((field) => field?.trims === "")
//   ) {
//     response.status(400).json("All fields are required");
//   }

//   client.query("SELECT * FROM users WHERE email=$1 or  username=$2", [
//     email,
//     username,
//   ]);
//   (error, results) => {
//     if (error) {
//       console.error("Error checking existing user:", error);
//       return response.status(500).json("Error checking existing user");
//     }

//     if (results.rows.length > 0) {
//       return response.status(400).json("Username or email already exists");
//     }
//   };

//   client.query(
//     "INSERT INTO users (username, email, password, fullname) VALUES ($1, $2, $3, $4) RETURNING *",
//     [username, email, password, fullname],
//     (error, results) => {
//       if (error) {
//         throw error;
//       }
//       // Remove password from response
//       const user = {
//         id: insertResults.rows[0].id,
//         username: username,
//         email: email,
//         fullname: fullname
//       };
      
//       // Sending response with sanitized user object
//       response.status(201).json({ message: `User added with ID: ${user.id}`, user: user });
//     }
//   );
// };





// const getUsers = (request, response) => {
//   client.query("SELECT * FROM users ORDER BY id ASC", (error, results) => {
//     if (error) {
//       throw error;
//     }
//     response.status(200).json(results.rows);
//   });
// };

// const getUserById = (request, response) => {
//   const id = parseInt(request.params.id);

//   client.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
//     if (error) {
//       throw error;
//     }
//     response.status(200).json(results.rows);
//   });
// };

// const updateUser = (request, response) => {
//   const id = parseInt(request.params.id);
//   const { email, password } = request.body;

//   client.query(
//     "UPDATE users SET password = $1, email = $2 WHERE id = $3",
//     [password, email, id],
//     (error, results) => {
//       if (error) {
//         throw error;
//       }
//       response.status(200).send(`User modified with ID: ${id}`);
//     }
//   );
// };

// module.exports = {
//   registerUser,
//   getUsers,
//   getUserById,
//   updateUser,
// };
