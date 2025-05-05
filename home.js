const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3000;

// MySQL connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '12345678', 
    database: 'CorporateVendorManagement' 
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
    res.sendFile(path.join(__dirname, 'home.html')); // Home page with buttons for login and registration
});

// Serve the vendor management form (vendor.html)
app.get('/vendor', (req, res) => {
    res.sendFile(path.join(__dirname, 'vendor.html')); // Vendor registration form
});

// Serve the login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html')); // Vendor login form
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html')); 
});

app.get('/contract', (req, res) => {
    res.sendFile(path.join(__dirname, 'contract.html')); 
});

app.get('/purchase', (req, res) => {
    res.sendFile(path.join(__dirname, 'purchase.html')); 
});

app.get('/budget', (req, res) => {
    res.sendFile(path.join(__dirname, 'budget.html')); 
});

app.get('/vendorperformance', (req, res) => {
    res.sendFile(path.join(__dirname, 'vendorperformance.html'));
});


app.post('/login', (req, res) => {
    const { email } = req.body;

    // Query to check if the email exists in the Vendor table
    const query = `SELECT * FROM Vendor WHERE Contact_Info = ?`;
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).send('Error querying database.');
        }

        // Check if email exists in the database
        if (results.length > 0) {
            // Email found, the user is eligible to access the dashboard
            res.send(`
                <html>
                <head>
                    <title>Login Success</title>
                    <link rel="stylesheet" href="/styles.css">
                </head>
                <body>
                    <div class="form-container">
                        <h2>Login Successful</h2>
                        <p class="success">You are eligible to open the dashboard!</p>
                        <a href="/dashboard" class="dashboard-button">Go to Dashboard</a>
                    </div>
                </body>
                </html>
            `);
        } else {
            // Email not found, show error
            res.send(`
                <html>
                <head>
                    <title>Login Failed</title>
                    <link rel="stylesheet" href="/styles.css">
                </head>
                <body>
                    <div class="form-container">
                        <h2>Login Failed</h2>
                        <p class="error">Email not found. Please register first.</p>
                        <a href="/" class="dashboard-button">Go Back to Login</a>
                    </div>
                </body>
                </html>
            `);
        }
    });
});
// Handle vendor registration form submission
app.post('/add-vendor', (req, res) => {
    const { Name, Contact_Info, Service_Categories, Compliance_Certifications, Performance_Rating } = req.body;

    // The Vendor_ID is auto-generated, so we don't need to provide it in the query.
    const query = `
        INSERT INTO Vendor (Name, Contact_Info, Service_Categories, Compliance_Certifications, Performance_Rating)
        VALUES (?, ?, ?, ?, ?)
    `;
    const values = [Name, Contact_Info, Service_Categories || null, Compliance_Certifications || null, Performance_Rating || 0];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).send('Error inserting data.');
        }
        res.send('Vendor data has been inserted successfully!');
    });
});


// Endpoint to get all contracts
app.get('/get-contracts', (req, res) => {
    const query = `
        SELECT 
            Contract_ID, Vendor_ID, Start_Date, End_Date, Status, Renewal_Notification_Flag 
        FROM 
            Contract
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching contracts:', err);
            return res.status(500).send('Error fetching contracts.');
        }
        res.json(results);
    });
});

// Endpoint to add a new contract
app.post('/add-contract', (req, res) => {
    const { Vendor_ID, Start_Date, End_Date, Terms_and_Conditions, Status } = req.body;

    const query = `
        INSERT INTO Contract (Vendor_ID, Start_Date, End_Date, Terms_and_Conditions, Status)
        VALUES (?, ?, ?, ?, ?)
    `;
    const values = [Vendor_ID, Start_Date, End_Date, Terms_and_Conditions, Status];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error inserting contract:', err);
            return res.status(500).send('Error inserting contract.');
        }
        res.send('Contract added successfully!');
    });
});

// Endpoint to set a renewal alert for a contract
app.post('/set-alert', (req, res) => {
    const { contractId, renewalFlag } = req.body;

    const query = `
        UPDATE Contract
        SET Renewal_Notification_Flag = ?
        WHERE Contract_ID = ?
    `;

    db.query(query, [renewalFlag, contractId], (err, result) => {
        if (err) {
            console.error('Error updating contract alert:', err);
            return res.status(500).send('Error updating contract alert.');
        }

        if (result.affectedRows > 0) {
            res.send('Renewal alert updated successfully!');
        } else {
            res.status(404).send('Contract not found.');
        }
    });
});
// Endpoint to check for contracts about to expire in 30 days
app.get('/check-renewals', (req, res) => {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    // Format the dates as strings in 'YYYY-MM-DD' format
    const todayFormatted = today.toISOString().split('T')[0];
    const thirtyDaysFormatted = thirtyDaysFromNow.toISOString().split('T')[0];

    const query = `
        SELECT Contract_ID, Vendor_ID, End_Date
        FROM Contract
        WHERE End_Date BETWEEN ? AND ?
    `;

    db.query(query, [todayFormatted, thirtyDaysFormatted], (err, results) => {
        if (err) {
            console.error('Error checking renewals:', err);
            return res.status(500).send('Error checking contract renewals.');
        }
        res.json(results);
    });
});



// Endpoint to get all purchase orders (excluding Department_ID)
app.get('/get-purchase-orders', (req, res) => {
    const query = `
        SELECT 
            PO_ID, Vendor_ID, Items_Details, Quantity, Total_Cost, Status
        FROM 
            Purchase_Order
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching purchase orders:', err);
            return res.status(500).send('Error fetching purchase orders.');
        }
        res.json(results);
    });
});

// Endpoint to add a new purchase order (excluding Department_ID)
app.post('/add-purchase-order', (req, res) => {
    const { Vendor_ID, Items_Details, Quantity, Total_Cost, Status } = req.body;

    const query = `
        INSERT INTO Purchase_Order (Vendor_ID, Items_Details, Quantity, Total_Cost, Status)
        VALUES (?, ?, ?, ?, ?)
    `;
    const values = [Vendor_ID, Items_Details, Quantity, Total_Cost, Status || 'Pending'];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error inserting purchase order:', err);
            return res.status(500).send('Error inserting purchase order.');
        }
        res.send('Purchase order added successfully!');
    });
});

// Endpoint to update the status of a purchase order
app.post('/update-status', (req, res) => {
    const { PO_ID, Status } = req.body;

    const query = `
        UPDATE Purchase_Order
        SET Status = ?
        WHERE PO_ID = ?
    `;

    db.query(query, [Status, PO_ID], (err, result) => {
        if (err) {
            console.error('Error updating purchase order status:', err);
            return res.status(500).send('Error updating purchase order status.');
        }

        if (result.affectedRows > 0) {
            res.send('Purchase order status updated successfully!');
        } else {
            res.status(404).send('Purchase order not found.');
        }
    });
});




// Endpoint to get all budgets
app.get('/get-budgets', (req, res) => {
    const query = `
        SELECT 
            Budget_ID, Vendor_ID, Allocated_Amount, Spent_Amount, Remaining_Amount
        FROM 
            Budget
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching budgets:', err);
            return res.status(500).send('Error fetching budgets.');
        }
        res.json(results);
    });
});

// Endpoint to add a new budget
app.post('/add-budget', (req, res) => {
    const { Vendor_ID, Allocated_Amount } = req.body;

    const query = `
        INSERT INTO Budget (Vendor_ID, Allocated_Amount)
        VALUES (?, ?)
    `;
    const values = [Vendor_ID, Allocated_Amount];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error inserting budget:', err);
            return res.status(500).send('Error inserting budget.');
        }
        res.send('Budget added successfully!');
    });
});

// Endpoint to update the spent amount in a budget
app.post('/update-spent', (req, res) => {
    const { Budget_ID, Spent_Amount } = req.body;

    const query = `
        UPDATE Budget
        SET Spent_Amount = Spent_Amount + ?
        WHERE Budget_ID = ?
    `;

    db.query(query, [Spent_Amount, Budget_ID], (err, result) => {
        if (err) {
            console.error('Error updating spent amount:', err);
            return res.status(500).send('Error updating spent amount.');
        }

        if (result.affectedRows > 0) {
            res.send('Spent amount updated successfully!');
        } else {
            res.status(404).send('Budget not found.');
        }
    });
});

// Endpoint to delete a budget
app.delete('/delete-budget/:id', (req, res) => {
    const { id } = req.params;

    const query = `
        DELETE FROM Budget
        WHERE Budget_ID = ?
    `;

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting budget:', err);
            return res.status(500).send('Error deleting budget.');
        }

        if (result.affectedRows > 0) {
            res.send('Budget deleted successfully!');
        } else {
            res.status(404).send('Budget not found.');
        }
    });
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


// Start the server on port 3000
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
