<?php
// Database connection details
$host = 'localhost';
$db = 'user_accounts';
$user = 'my_user';
$pass = '148745Ah';
$port = '5432';

// Connect to PostgreSQL database
$conn = pg_connect("host=$host dbname=$db user=$user password=$pass port=$port");
if (!$conn) {
    die("Error in connection: " . pg_last_error());
}

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die("Invalid email format");
    }

    // Hash the password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Insert user into the database
    $query = "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)";
    $result = pg_query_params($conn, $query, array($name, $email, $hashed_password));

    if ($result) {
        header("Location: login.html");
        exit(); // Make sure to exit after redirecting
    } else {
        echo "Error in registration: " . pg_last_error($conn);
    }

    // Free result and close connection
    if ($result !== false) {
        pg_free_result($result);
    }
    pg_close($conn);
} else {
    echo "Invalid request method";
}

