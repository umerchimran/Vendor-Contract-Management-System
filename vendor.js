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

// // Serve the main dashboard HTML file

// // Serve the vendor management form (vendorForm.html)
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'vendor.html'));
// });

// // Serve the login page
// app.get('/login', (req, res) => {
//     res.sendFile(path.join(__dirname, 'login.html'));
// });


// app.post('/login', (req, res) => {
//     const { email } = req.body;

//     // Query to check if the email (contact info) exists in the Vendor table
//     const query = `SELECT * FROM Vendor WHERE Contact_Info = ?`;
//     db.query(query, [email], (err, results) => {
//         if (err) {
//             console.error('Error querying database:', err);
//             return res.status(500).send('Error querying database.');
//         }

//         // Check if email exists in the database
//         if (results.length > 0) {
//             // Email found, the user is eligible to access the dashboard
//             return res.send('You are eligible to open the dashboard!');
//         } else {
//             // Email not found, show error
//             return res.send('Email not found. Please register first.');
//         }
//     });
// });

// // Handle form submission and insert the vendor data into the database
// app.post('/add-vendor', (req, res) => {
//     const { Name, Contact_Info, Service_Categories, Compliance_Certifications, Performance_Rating } = req.body;

//     // The Vendor_ID is auto-generated, so we don't need to provide it in the query.
//     const query = `
//         INSERT INTO Vendor (Name, Contact_Info, Service_Categories, Compliance_Certifications, Performance_Rating)
//         VALUES (?, ?, ?, ?, ?)
//     `;
//     const values = [Name, Contact_Info, Service_Categories || null, Compliance_Certifications || null, Performance_Rating || 0];

//     db.query(query, values, (err, result) => {
//         if (err) {
//             console.error('Error inserting data:', err);
//             return res.status(500).send('Error inserting data.');
//         }
//         res.send('Vendor data has been inserted successfully!');
//     });
// });


// // Start the server on port 3000
// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });
