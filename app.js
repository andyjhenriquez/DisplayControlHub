// Import required modules
const express = require('express'); // Express.js framework
const bodyParser = require('body-parser'); // Middleware for parsing request bodies
const { Pool } = require('pg'); // PostgreSQL client
const bcrypt = require('bcrypt'); // Library for hashing passwords

// Create an Express application
const app = express();
const port = 3000; // Port number for the server

// Use body-parser middleware to parse JSON and URL-encoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create a PostgreSQL connection pool
const pool = new Pool({
  user: 'my_user', // Database username
  host: 'localhost', // Database host
  database: 'user_accounts', // Database name
  password: '148745Ah', // Database password
  port: 5432, // Database port
});

// Middleware to log incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`); // Log HTTP method and URL
  next(); // Call the next middleware function
});

// Route to handle user registration
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body; // Extract name, email, and password from request body

  try {
    const saltRounds = 10; // Number of salt rounds for bcrypt
    const hashedPassword = await bcrypt.hash(password, saltRounds); // Hash the password

    // SQL query to insert the new user into the database
    const query = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)';
    await pool.query(query, [name, email, hashedPassword]); // Execute the query with the hashed password

    res.status(201).json({ message: 'User registered successfully' }); // Send success response
  } catch (err) {
    console.error(err); // Log any errors
    res.status(500).json({ error: 'Internal server error' }); // Send error response
  }
});

// Route to handle user login
app.post('/login', async (req, res) => {
  const { email, password } = req.body; // Extract email and password from request body

  try {
    // SQL query to find the user by email
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]); // Execute the query

    if (result.rows.length > 0) {
      const user = result.rows[0]; // Get the user from the result

      // Compare the provided password with the hashed password in the database
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        res.status(200).json({ message: 'Login successful' }); // Send success response if passwords match
      } else {
        res.status(401).json({ error: 'Invalid credentials' }); // Send error response if passwords don't match
      }
    } else {
      res.status(401).json({ error: 'Invalid credentials' }); // Send error response if user not found
    }
  } catch (err) {
    console.error(err); // Log any errors
    res.status(500).json({ error: 'Internal server error' }); // Send error response
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running on port ${port}`); // Log that the server is running
});
