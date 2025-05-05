
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3000;

// MySQL connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Your MySQL username
    password: '12345678', // Your MySQL password
    database: 'CorporateVendorManagement' // Your database name
});

// Connect to MySQL database
db.connect((err) => {
    if (err) {
        console.error('Could not connect to MySQL:', err);
    } else {
        console.log('Connected to MySQL');
    }
});

// Middleware to parse incoming requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (like styles.css) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'vendorperformance.html')); 
});


// API endpoint for fetching vendor and contract data
app.get('/vendorperformance', (req, res) => {
    const { vendorName } = req.query;

    // Check if vendorName is provided
    if (!vendorName) {
        return res.status(400).send('Vendor name is required.');
    }

    // SQL query
    const query = `
        SELECT 
            Vendor.Vendor_ID,
            Vendor.Name,
            Vendor.Contact_Info,
            Vendor.Service_Categories,
            Vendor.Compliance_Certifications,
            Vendor.Performance_Rating,
            Contract.Contract_ID,
            Contract.Start_Date,
            Contract.End_Date,
            Contract.Terms_and_Conditions,
            Contract.Status,
            Contract.Renewal_Notification_Flag
        FROM Vendor
        LEFT JOIN Contract ON Vendor.Vendor_ID = Contract.Vendor_ID
        WHERE Vendor.Name LIKE ?
    `;

    // Execute the query
    db.query(query, [`%${vendorName}%`], (err, results) => {
        if (err) {
            console.error('Error executing the query:', err);
            return res.status(500).send('Error fetching data.');
        }

        // If no results found
        if (results.length === 0) {
            return res.status(404).send('No vendor found with the provided name.');
        }

        // Send the results as JSON
        res.json({
            message: 'Vendor and contract data retrieved successfully.',
            data: results
        });
    });
});

// Start the server
const PORT = 3000; // Change if needed
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});