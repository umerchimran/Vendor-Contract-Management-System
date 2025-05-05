// Import required modules
var mysql = require("mysql2");

// Establish MySQL connection
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    multipleStatements: true // Allow multiple SQL statements
});

// DDL Script to create database, tables, and procedures
var ddlScript = `
CREATE DATABASE IF NOT EXISTS CorporateVendorManagement;
USE CorporateVendorManagement;

CREATE TABLE IF NOT EXISTS Vendor (
    Vendor_ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Contact_Info VARCHAR(255) NOT NULL,
    Service_Categories VARCHAR(255),
    Compliance_Certifications VARCHAR(255),
    Performance_Rating FLOAT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS Contract (
    Contract_ID INT AUTO_INCREMENT PRIMARY KEY,
    Vendor_ID INT NOT NULL,
    Start_Date DATE NOT NULL,
    End_Date DATE NOT NULL,
    Terms_and_Conditions TEXT,
    Status ENUM('Active', 'Expired', 'Pending', 'Renewed') DEFAULT 'Pending',
    Renewal_Notification_Flag BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (Vendor_ID) REFERENCES Vendor(Vendor_ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Budget (
    Budget_ID INT AUTO_INCREMENT PRIMARY KEY,
     Vendor_ID INT NOT NULL,
    Allocated_Amount DECIMAL(15, 2) NOT NULL,
    Spent_Amount DECIMAL(15, 2) DEFAULT 0,
    Remaining_Amount DECIMAL(15, 2) GENERATED ALWAYS AS (Allocated_Amount - Spent_Amount) STORED,
    FOREIGN KEY (Vendor_ID) REFERENCES Vendor(Vendor_ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Purchase_Order (
    PO_ID INT AUTO_INCREMENT PRIMARY KEY,
    Vendor_ID INT NOT NULL,
    Items_Details TEXT NOT NULL,
    Quantity INT NOT NULL,
    Total_Cost DECIMAL(15, 2) NOT NULL,
    Status ENUM('Created', 'Fulfilled', 'Pending') DEFAULT 'Pending',
    FOREIGN KEY (Vendor_ID) REFERENCES Vendor(Vendor_ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Vendor_Performance (
    Performance_ID INT AUTO_INCREMENT PRIMARY KEY,
    Vendor_ID INT NOT NULL,
    Delivery_Timeliness FLOAT DEFAULT 0,
    Service_Quality FLOAT DEFAULT 0,
    Compliance_Adherence FLOAT DEFAULT 0,
    Feedback TEXT,
    Rating FLOAT AS ((Delivery_Timeliness + Service_Quality + Compliance_Adherence) / 3) STORED,
    FOREIGN KEY (Vendor_ID) REFERENCES Vendor(Vendor_ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS User (
    User_ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Role ENUM('Procurement Manager', 'Budget Manager', 'Contract Team Member', 'Department Head') NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS Performance_Evaluation_History (
    Evaluation_ID INT AUTO_INCREMENT PRIMARY KEY,
    Vendor_ID INT NOT NULL,
    Evaluation_Date DATE NOT NULL,
    Delivery_Timeliness FLOAT,
    Service_Quality FLOAT,
    Compliance_Adherence FLOAT,
    Feedback TEXT,
    Rating FLOAT AS ((Delivery_Timeliness + Service_Quality + Compliance_Adherence) / 3) STORED,
    FOREIGN KEY (Vendor_ID) REFERENCES Vendor(Vendor_ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Notification (
    Notification_ID INT AUTO_INCREMENT PRIMARY KEY,
    User_ID INT NOT NULL,
    Type ENUM('Contract Renewal', 'Budget Overrun', 'Performance Alert', 'General') NOT NULL,
    Message TEXT NOT NULL,
    Notification_Date DATE NOT NULL,
    Status ENUM('Unread', 'Read', 'Acknowledged') DEFAULT 'Unread',
    FOREIGN KEY (User_ID) REFERENCES User(User_ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Audit_Log (
    Log_ID INT AUTO_INCREMENT PRIMARY KEY,
    Action_Type ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    Table_Name VARCHAR(255) NOT NULL,
    Record_ID INT NOT NULL,
    Action_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    User_ID INT NOT NULL,
    Action_Details TEXT,
    FOREIGN KEY (User_ID) REFERENCES User(User_ID) ON DELETE CASCADE
);

-- Stored Procedure for Vendor Registration
CREATE PROCEDURE VendorRegistration (
    IN p_Name VARCHAR(255),
    IN p_Contact_Info VARCHAR(255),
    IN p_Service_Categories VARCHAR(255),
    IN p_Compliance_Certifications VARCHAR(255)
)
BEGIN
    INSERT INTO Vendor (Name, Contact_Info, Service_Categories, Compliance_Certifications)
    VALUES (p_Name, p_Contact_Info, p_Service_Categories, p_Compliance_Certifications);
END;

-- Stored Procedure for Contract Management
CREATE PROCEDURE CreateContract (
    IN p_Vendor_ID INT,
    IN p_Start_Date DATE,
    IN p_End_Date DATE,
    IN p_Terms_and_Conditions TEXT
)
BEGIN
    INSERT INTO Contract (Vendor_ID, Start_Date, End_Date, Terms_and_Conditions)
    VALUES (p_Vendor_ID, p_Start_Date, p_End_Date, p_Terms_and_Conditions);
END;

-- Stored Procedure for Vendor Performance Evaluation
CREATE PROCEDURE VendorPerformanceEvaluation (
    IN p_Vendor_ID INT,
    IN p_Delivery_Timeliness FLOAT,
    IN p_Service_Quality FLOAT,
    IN p_Compliance_Adherence FLOAT,
    IN p_Feedback TEXT
)
BEGIN
    INSERT INTO Vendor_Performance (Vendor_ID, Delivery_Timeliness, Service_Quality, Compliance_Adherence, Feedback)
    VALUES (p_Vendor_ID, p_Delivery_Timeliness, p_Service_Quality, p_Compliance_Adherence, p_Feedback);
END;
`;

// Execute DDL script
connection.query(ddlScript, function (err, results) {
    if (err) {
        console.error("Error creating database, tables, and procedures: ", err.message);
        return;
    }
    console.log("Database, tables, and procedures created successfully.");
});

// Close connection
connection.end(function (err) {
    if (err) {
        console.error("Error closing connection: ", err.message);
    } else {
        console.log("Connection closed.");
    }
});
