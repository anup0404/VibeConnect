const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const client = new Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
});

const connectToDB = async () => {
  try {
    await client.connect();
    console.log('PG Connected successfully !!!');
  } catch (err) {
    console.error('Connection error:', err.stack);
    process.exit(1); // Exit the process if connection fails
  }
};

module.exports = { connectToDB, client };
