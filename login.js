// const express = require('express');
// const bodyParser = require('body-parser');
// const mysql = require('mysql2');
// const path = require('path');

// const app = express();
// const port = 3000;

// // MySQL connection setup
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root', // Your MySQL username
//     password: '12345678', // Your MySQL password
//     database: 'CorporateVendorManagement' // Your database name
// });

// // Connect to MySQL database
// db.connect((err) => {
//     if (err) {
//         console.error('Could not connect to MySQL:', err);
//     } else {
//         console.log('Connected to MySQL');
//     }
// });

// // Middleware to parse incoming requests
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// // Serve static files (like styles.css) from the 'public' folder
// app.use(express.static(path.join(__dirname, 'public')));

// // Serve the login page
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'login.html'));
// });

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'vendor.html'));
// });


// // Handle login form submission
// // app.post('/login', (req, res) => {
// //     const { email } = req.body;

// //     // Query to check if the email (contact info) exists in the Vendor table
// //     const query = `SELECT * FROM Vendor WHERE Contact_Info = ?`;
// //     db.query(query, [email], (err, results) => {
// //         if (err) {
// //             console.error('Error querying database:', err);
// //             return res.status(500).send('Error querying database.');
// //         }

// //         // Check if email exists in the database
// //         if (results.length > 0) {
// //             // Email found, the user is eligible to access the dashboard
// //             return res.send('You are eligible to open the dashboard!');
// //         } else {
// //             // Email not found, show error
// //             return res.send('Email not found. Please register first.');
// //         }
// //     });
// // });

// // Start the server on port 3000
// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });
