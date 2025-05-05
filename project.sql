# CREATE DATABASE IF NOT EXISTS CorporateVendorManagement;
# USE CorporateVendorManagement;

# CREATE TABLE IF NOT EXISTS Vendor (
#     Vendor_ID INT AUTO_INCREMENT PRIMARY KEY,
#     Name VARCHAR(255) NOT NULL,
#     Contact_Info VARCHAR(255) NOT NULL,
#     Service_Categories VARCHAR(255),
#     Compliance_Certifications VARCHAR(255),
#     Performance_Rating FLOAT DEFAULT 0
# );

# CREATE TABLE IF NOT EXISTS Contract (
#     Contract_ID INT AUTO_INCREMENT PRIMARY KEY,
#     Vendor_ID INT NOT NULL,
#     Start_Date DATE NOT NULL,
#     End_Date DATE NOT NULL,
#     Terms_and_Conditions TEXT,
#     Status ENUM('Active', 'Expired', 'Pending', 'Renewed') DEFAULT 'Pending',
#     Renewal_Notification_Flag BOOLEAN DEFAULT FALSE,
#     FOREIGN KEY (Vendor_ID) REFERENCES Vendor(Vendor_ID) ON DELETE CASCADE
# );

# CREATE TABLE IF NOT EXISTS Budget (
#     Budget_ID INT AUTO_INCREMENT PRIMARY KEY,
#      Vendor_ID INT NOT NULL,
#     Allocated_Amount DECIMAL(15, 2) NOT NULL,
#     Spent_Amount DECIMAL(15, 2) DEFAULT 0,
#     Remaining_Amount DECIMAL(15, 2) GENERATED ALWAYS AS (Allocated_Amount - Spent_Amount) STORED,
#     FOREIGN KEY (Vendor_ID) REFERENCES Vendor(Vendor_ID) ON DELETE CASCADE
# );

# CREATE TABLE IF NOT EXISTS Purchase_Order (
#     PO_ID INT AUTO_INCREMENT PRIMARY KEY,
#     Vendor_ID INT NOT NULL,
#     Items_Details TEXT NOT NULL,
#     Quantity INT NOT NULL,
#     Total_Cost DECIMAL(15, 2) NOT NULL,
#     Status ENUM('Created', 'Fulfilled', 'Pending') DEFAULT 'Pending',
#     FOREIGN KEY (Vendor_ID) REFERENCES Vendor(Vendor_ID) ON DELETE CASCADE
# );

# CREATE TABLE IF NOT EXISTS Vendor_Performance (
#     Performance_ID INT AUTO_INCREMENT PRIMARY KEY,
#     Vendor_ID INT NOT NULL,
#     Delivery_Timeliness FLOAT DEFAULT 0,
#     Service_Quality FLOAT DEFAULT 0,
#     Compliance_Adherence FLOAT DEFAULT 0,
#     Feedback TEXT,
#     Rating FLOAT AS ((Delivery_Timeliness + Service_Quality + Compliance_Adherence) / 3) STORED,
#     FOREIGN KEY (Vendor_ID) REFERENCES Vendor(Vendor_ID) ON DELETE CASCADE
# );

# CREATE TABLE IF NOT EXISTS User (
#     User_ID INT AUTO_INCREMENT PRIMARY KEY,
#     Name VARCHAR(255) NOT NULL,
#     Role ENUM('Procurement Manager', 'Budget Manager', 'Contract Team Member', 'Department Head') NOT NULL,
#     Email VARCHAR(255) NOT NULL UNIQUE
# );

# CREATE TABLE IF NOT EXISTS Performance_Evaluation_History (
#     Evaluation_ID INT AUTO_INCREMENT PRIMARY KEY,
#     Vendor_ID INT NOT NULL,
#     Evaluation_Date DATE NOT NULL,
#     Delivery_Timeliness FLOAT,
#     Service_Quality FLOAT,
#     Compliance_Adherence FLOAT,
#     Feedback TEXT,
#     Rating FLOAT AS ((Delivery_Timeliness + Service_Quality + Compliance_Adherence) / 3) STORED,
#     FOREIGN KEY (Vendor_ID) REFERENCES Vendor(Vendor_ID) ON DELETE CASCADE
# );

# CREATE TABLE IF NOT EXISTS Notification (
#     Notification_ID INT AUTO_INCREMENT PRIMARY KEY,
#     User_ID INT NOT NULL,
#     Type ENUM('Contract Renewal', 'Budget Overrun', 'Performance Alert', 'General') NOT NULL,
#     Message TEXT NOT NULL,
#     Notification_Date DATE NOT NULL,
#     Status ENUM('Unread', 'Read', 'Acknowledged') DEFAULT 'Unread',
#     FOREIGN KEY (User_ID) REFERENCES User(User_ID) ON DELETE CASCADE
# );

# CREATE TABLE IF NOT EXISTS Audit_Log (
#     Log_ID INT AUTO_INCREMENT PRIMARY KEY,
#     Action_Type ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
#     Table_Name VARCHAR(255) NOT NULL,
#     Record_ID INT NOT NULL,
#     Action_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
#     User_ID INT NOT NULL,
#     Action_Details TEXT,
#     FOREIGN KEY (User_ID) REFERENCES User(User_ID) ON DELETE CASCADE
# );







ALTER TABLE Purchase_Order MODIFY Status VARCHAR(20);
select * from vendor;
select * from contract;
select * from purchase_order;
select * from budget;

ALTER TABLE Vendor_Performance
ADD COLUMN Performance_Date DATE;
select * from vendor_performance;






DELIMITER //

CREATE TRIGGER check_contract_renewals_insert
AFTER INSERT ON contracts
FOR EACH ROW
BEGIN
    DECLARE days_left INT;

    -- Calculate days left until expiration
    SET days_left = DATEDIFF(NEW.expiry_date, CURDATE());

    -- If the contract is expiring in the next 30 days, log the notification
    IF days_left <= 30 AND days_left >= 0 THEN
        -- Insert a record into the 'contract_notifications' table for the expiring contract
        INSERT INTO contract_notifications (contract_id, message, notification_date)
        VALUES (NEW.contract_id, CONCAT('Contract ', NEW.contract_id, ' is expiring soon!'), CURDATE());
    END IF;
END //

DELIMITER ;
DELIMITER //

CREATE TRIGGER check_contract_renewals_update
AFTER UPDATE ON contracts
FOR EACH ROW
BEGIN
    DECLARE days_left INT;

    -- Calculate days left until expiration
    SET days_left = DATEDIFF(NEW.expiry_date, CURDATE());

    -- If the contract is expiring in the next 30 days, log the notification
    IF days_left <= 30 AND days_left >= 0 THEN
        -- Insert a record into the 'contract_notifications' table for the expiring contract
        INSERT INTO contract_notifications (contract_id, message, notification_date)
        VALUES (NEW.contract_id, CONCAT('Contract ', NEW.contract_id, ' is expiring soon!'), CURDATE());
    END IF;
END //

DELIMITER ;



-- purchase budget checksum table
SELECT
    po.PO_ID,
    po.Total_Cost,
    b.Allocated_Amount,
    (po.Total_Cost - b.Allocated_Amount) AS Over_Budget_Amount
FROM
    Purchase_Order po
JOIN
    Budget b ON po.Vendor_ID = b.Vendor_ID
WHERE
    po.Total_Cost > b.Allocated_Amount;





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
WHERE Vendor.Name LIKE '%umer%';
