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

// // Serve static files (like styles.css or client-side JS) from the 'public' folder
// app.use(express.static(path.join(__dirname, 'public')));

// // Serve the main dashboard HTML file
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'contract.html'));
// });

// // Endpoint to get all contracts
// app.get('/get-contracts', (req, res) => {
//     const query = `
//         SELECT 
//             Contract_ID, Vendor_ID, Start_Date, End_Date, Status, Renewal_Notification_Flag 
//         FROM 
//             Contract
//     `;

//     db.query(query, (err, results) => {
//         if (err) {
//             console.error('Error fetching contracts:', err);
//             return res.status(500).send('Error fetching contracts.');
//         }
//         res.json(results);
//     });
// });

// // Endpoint to add a new contract
// app.post('/add-contract', (req, res) => {
//     const { Vendor_ID, Start_Date, End_Date, Terms_and_Conditions, Status } = req.body;

//     const query = `
//         INSERT INTO Contract (Vendor_ID, Start_Date, End_Date, Terms_and_Conditions, Status)
//         VALUES (?, ?, ?, ?, ?)
//     `;
//     const values = [Vendor_ID, Start_Date, End_Date, Terms_and_Conditions, Status];

//     db.query(query, values, (err, result) => {
//         if (err) {
//             console.error('Error inserting contract:', err);
//             return res.status(500).send('Error inserting contract.');
//         }
//         res.send('Contract added successfully!');
//     });
// });

// // Endpoint to set a renewal alert for a contract
// app.post('/set-alert', (req, res) => {
//     const { contractId, renewalFlag } = req.body;

//     const query = `
//         UPDATE Contract
//         SET Renewal_Notification_Flag = ?
//         WHERE Contract_ID = ?
//     `;

//     db.query(query, [renewalFlag, contractId], (err, result) => {
//         if (err) {
//             console.error('Error updating contract alert:', err);
//             return res.status(500).send('Error updating contract alert.');
//         }

//         if (result.affectedRows > 0) {
//             res.send('Renewal alert updated successfully!');
//         } else {
//             res.status(404).send('Contract not found.');
//         }
//     });
// });
// // Endpoint to check for contracts about to expire in 30 days
// app.get('/check-renewals', (req, res) => {
//     const today = new Date();
//     const thirtyDaysFromNow = new Date(today);
//     thirtyDaysFromNow.setDate(today.getDate() + 30);

//     // Format the dates as strings in 'YYYY-MM-DD' format
//     const todayFormatted = today.toISOString().split('T')[0];
//     const thirtyDaysFormatted = thirtyDaysFromNow.toISOString().split('T')[0];

//     const query = `
//         SELECT Contract_ID, Vendor_ID, End_Date
//         FROM Contract
//         WHERE End_Date BETWEEN ? AND ?
//     `;

//     db.query(query, [todayFormatted, thirtyDaysFormatted], (err, results) => {
//         if (err) {
//             console.error('Error checking renewals:', err);
//             return res.status(500).send('Error checking contract renewals.');
//         }
//         res.json(results);
//     });
// });

// // Start the server on port 3000
// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });
