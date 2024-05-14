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
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die("Invalid email format");
    }

    // Find the user by email
    $query = "SELECT * FROM users WHERE email = $1";
    $result = pg_query_params($conn, $query, array($email));
    $user = pg_fetch_assoc($result);

    if ($user) {
        // Verify the password
        if (password_verify($password, $user['password'])) {
            header("Location: index.html");
            exit(); // Make sure to exit after redirecting
        } else {
            echo "Invalid credentials";
        }
    } else {
        echo "Invalid credentials";
    }

    // Free result and close connection
    pg_free_result($result);
    pg_close($conn);
}
?>
