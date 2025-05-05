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

// // Serve the budget management HTML file
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'budget.html'));
// });

// // Endpoint to get all budgets
// app.get('/get-budgets', (req, res) => {
//     const query = `
//         SELECT 
//             Budget_ID, Vendor_ID, Allocated_Amount, Spent_Amount, Remaining_Amount
//         FROM 
//             Budget
//     `;

//     db.query(query, (err, results) => {
//         if (err) {
//             console.error('Error fetching budgets:', err);
//             return res.status(500).send('Error fetching budgets.');
//         }
//         res.json(results);
//     });
// });

// // Endpoint to add a new budget
// app.post('/add-budget', (req, res) => {
//     const { Vendor_ID, Allocated_Amount } = req.body;

//     const query = `
//         INSERT INTO Budget (Vendor_ID, Allocated_Amount)
//         VALUES (?, ?)
//     `;
//     const values = [Vendor_ID, Allocated_Amount];

//     db.query(query, values, (err, result) => {
//         if (err) {
//             console.error('Error inserting budget:', err);
//             return res.status(500).send('Error inserting budget.');
//         }
//         res.send('Budget added successfully!');
//     });
// });

// // Endpoint to update the spent amount in a budget
// app.post('/update-spent', (req, res) => {
//     const { Budget_ID, Spent_Amount } = req.body;

//     const query = `
//         UPDATE Budget
//         SET Spent_Amount = Spent_Amount + ?
//         WHERE Budget_ID = ?
//     `;

//     db.query(query, [Spent_Amount, Budget_ID], (err, result) => {
//         if (err) {
//             console.error('Error updating spent amount:', err);
//             return res.status(500).send('Error updating spent amount.');
//         }

//         if (result.affectedRows > 0) {
//             res.send('Spent amount updated successfully!');
//         } else {
//             res.status(404).send('Budget not found.');
//         }
//     });
// });

// // Endpoint to delete a budget
// app.delete('/delete-budget/:id', (req, res) => {
//     const { id } = req.params;

//     const query = `
//         DELETE FROM Budget
//         WHERE Budget_ID = ?
//     `;

//     db.query(query, [id], (err, result) => {
//         if (err) {
//             console.error('Error deleting budget:', err);
//             return res.status(500).send('Error deleting budget.');
//         }

//         if (result.affectedRows > 0) {
//             res.send('Budget deleted successfully!');
//         } else {
//             res.status(404).send('Budget not found.');
//         }
//     });
// });

// // Start the server on port 3000
// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });
