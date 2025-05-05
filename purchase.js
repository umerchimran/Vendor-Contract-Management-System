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

// // Serve the purchase order management HTML file
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'purchase.html'));
// });

// // Endpoint to get all purchase orders (excluding Department_ID)
// app.get('/get-purchase-orders', (req, res) => {
//     const query = `
//         SELECT 
//             PO_ID, Vendor_ID, Items_Details, Quantity, Total_Cost, Status
//         FROM 
//             Purchase_Order
//     `;

//     db.query(query, (err, results) => {
//         if (err) {
//             console.error('Error fetching purchase orders:', err);
//             return res.status(500).send('Error fetching purchase orders.');
//         }
//         res.json(results);
//     });
// });

// // Endpoint to add a new purchase order (excluding Department_ID)
// app.post('/add-purchase-order', (req, res) => {
//     const { Vendor_ID, Items_Details, Quantity, Total_Cost, Status } = req.body;

//     const query = `
//         INSERT INTO Purchase_Order (Vendor_ID, Items_Details, Quantity, Total_Cost, Status)
//         VALUES (?, ?, ?, ?, ?)
//     `;
//     const values = [Vendor_ID, Items_Details, Quantity, Total_Cost, Status || 'Pending'];

//     db.query(query, values, (err, result) => {
//         if (err) {
//             console.error('Error inserting purchase order:', err);
//             return res.status(500).send('Error inserting purchase order.');
//         }
//         res.send('Purchase order added successfully!');
//     });
// });

// // Endpoint to update the status of a purchase order
// app.post('/update-status', (req, res) => {
//     const { PO_ID, Status } = req.body;

//     const query = `
//         UPDATE Purchase_Order
//         SET Status = ?
//         WHERE PO_ID = ?
//     `;

//     db.query(query, [Status, PO_ID], (err, result) => {
//         if (err) {
//             console.error('Error updating purchase order status:', err);
//             return res.status(500).send('Error updating purchase order status.');
//         }

//         if (result.affectedRows > 0) {
//             res.send('Purchase order status updated successfully!');
//         } else {
//             res.status(404).send('Purchase order not found.');
//         }
//     });
// });

// // Start the server on port 3000
// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });
