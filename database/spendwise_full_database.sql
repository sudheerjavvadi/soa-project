-- =============================================================
-- SpendWise - Full Database Script
-- All 5 microservice databases: schema + sample data
-- =============================================================


-- =============================================================
-- 1. AUTH SERVICE  =>  spendwise_auth
-- =============================================================

CREATE DATABASE IF NOT EXISTS spendwise_auth;
USE spendwise_auth;

CREATE TABLE IF NOT EXISTS users (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(20)  NOT NULL UNIQUE,
    first_name  VARCHAR(50)  NOT NULL,
    last_name   VARCHAR(50)  NOT NULL,
    email       VARCHAR(100) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    phone       VARCHAR(20),
    department  VARCHAR(50)  NOT NULL,
    role        VARCHAR(20)  NOT NULL,
    active      BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  DATETIME     NOT NULL,
    updated_at  DATETIME     NOT NULL,
    INDEX idx_email      (email),
    INDEX idx_department (department),
    INDEX idx_role       (role)
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT,
    user_email  VARCHAR(100),
    action      VARCHAR(50)  NOT NULL,
    description TEXT,
    ip_address  VARCHAR(50),
    timestamp   DATETIME     NOT NULL,
    INDEX idx_user_id  (user_id),
    INDEX idx_action   (action),
    INDEX idx_timestamp(timestamp)
);

-- ---------------------------------------------------------------
-- Sample Users  (password for ALL = Password@123)
-- ---------------------------------------------------------------
INSERT IGNORE INTO users
    (employee_id, first_name, last_name, email, password, phone, department, role, active, created_at, updated_at)
VALUES
('EMP001', 'Ravi',    'Kumar',   'ravi.kumar@spendwise.com',   '$2a$12$xCmQHRw7FJDy7t9X2K5P1.hL0Fx5KHv3YjNXfaE5Q6PzOzG1dEhPS', '+91-9876543210', 'IT',          'SYSTEM_ADMIN',  TRUE, NOW(), NOW()),
('EMP002', 'Priya',   'Sharma',  'priya.sharma@spendwise.com', '$2a$12$xCmQHRw7FJDy7t9X2K5P1.hL0Fx5KHv3YjNXfaE5Q6PzOzG1dEhPS', '+91-9876543211', 'Finance',     'FINANCE_ADMIN', TRUE, NOW(), NOW()),
('EMP003', 'Arjun',   'Mehta',   'arjun.mehta@spendwise.com',  '$2a$12$xCmQHRw7FJDy7t9X2K5P1.hL0Fx5KHv3YjNXfaE5Q6PzOzG1dEhPS', '+91-9876543212', 'Engineering', 'MANAGER',       TRUE, NOW(), NOW()),
('EMP004', 'Sunita',  'Reddy',   'sunita.reddy@spendwise.com', '$2a$12$xCmQHRw7FJDy7t9X2K5P1.hL0Fx5KHv3YjNXfaE5Q6PzOzG1dEhPS', '+91-9876543213', 'Marketing',   'MANAGER',       TRUE, NOW(), NOW()),
('EMP005', 'Vikram',  'Singh',   'vikram.singh@spendwise.com', '$2a$12$xCmQHRw7FJDy7t9X2K5P1.hL0Fx5KHv3YjNXfaE5Q6PzOzG1dEhPS', '+91-9876543214', 'HR',          'MANAGER',       TRUE, NOW(), NOW()),
('EMP006', 'Ananya',  'Patel',   'ananya.patel@spendwise.com', '$2a$12$xCmQHRw7FJDy7t9X2K5P1.hL0Fx5KHv3YjNXfaE5Q6PzOzG1dEhPS', '+91-9876543215', 'Engineering', 'EMPLOYEE',      TRUE, NOW(), NOW()),
('EMP007', 'Rahul',   'Gupta',   'rahul.gupta@spendwise.com',  '$2a$12$xCmQHRw7FJDy7t9X2K5P1.hL0Fx5KHv3YjNXfaE5Q6PzOzG1dEhPS', '+91-9876543216', 'Engineering', 'EMPLOYEE',      TRUE, NOW(), NOW()),
('EMP008', 'Deepika', 'Nair',    'deepika.nair@spendwise.com', '$2a$12$xCmQHRw7FJDy7t9X2K5P1.hL0Fx5KHv3YjNXfaE5Q6PzOzG1dEhPS', '+91-9876543217', 'Marketing',   'EMPLOYEE',      TRUE, NOW(), NOW()),
('EMP009', 'Karan',   'Joshi',   'karan.joshi@spendwise.com',  '$2a$12$xCmQHRw7FJDy7t9X2K5P1.hL0Fx5KHv3YjNXfaE5Q6PzOzG1dEhPS', '+91-9876543218', 'Finance',     'EMPLOYEE',      TRUE, NOW(), NOW()),
('EMP010', 'Meera',   'Das',     'meera.das@spendwise.com',    '$2a$12$xCmQHRw7FJDy7t9X2K5P1.hL0Fx5KHv3YjNXfaE5Q6PzOzG1dEhPS', '+91-9876543219', 'Operations',  'EMPLOYEE',      TRUE, NOW(), NOW());

-- Sample Audit Logs
INSERT IGNORE INTO audit_logs (user_id, user_email, action, description, ip_address, timestamp) VALUES
(1, 'ravi.kumar@spendwise.com',   'LOGIN',             'User logged in successfully',                       '192.168.1.101', NOW()),
(6, 'ananya.patel@spendwise.com', 'LOGIN',             'User logged in successfully',                       '192.168.1.105', NOW()),
(6, 'ananya.patel@spendwise.com', 'EXPENSE_CREATED',   'Created expense EXP-2026-00001 (Travel)',           '192.168.1.105', NOW()),
(6, 'ananya.patel@spendwise.com', 'EXPENSE_SUBMITTED', 'Submitted expense EXP-2026-00001 for approval',    '192.168.1.105', NOW()),
(3, 'arjun.mehta@spendwise.com',  'LOGIN',             'User logged in successfully',                       '192.168.1.102', NOW()),
(3, 'arjun.mehta@spendwise.com',  'EXPENSE_APPROVED',  'Approved expense EXP-2026-00001',                  '192.168.1.102', NOW()),
(7, 'rahul.gupta@spendwise.com',  'LOGIN',             'User logged in successfully',                       '192.168.1.106', NOW()),
(2, 'priya.sharma@spendwise.com', 'BUDGET_UPDATED',    'Updated budget for Engineering/Travel FY2026-Sep',  '192.168.1.100', NOW());


-- =============================================================
-- 2. CATEGORY SERVICE  =>  spendwise_category
-- =============================================================

CREATE DATABASE IF NOT EXISTS spendwise_category;
USE spendwise_category;

CREATE TABLE IF NOT EXISTS categories (
    id                      BIGINT AUTO_INCREMENT PRIMARY KEY,
    name                    VARCHAR(100) NOT NULL UNIQUE,
    description             VARCHAR(255),
    budget_limit            DECIMAL(15,2),
    icon                    VARCHAR(10)  DEFAULT NULL,
    budget_limit_percentage INT          DEFAULT 100,
    active                  BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at              DATETIME     NOT NULL,
    updated_at              DATETIME     NOT NULL
);

INSERT IGNORE INTO categories (name, description, budget_limit, budget_limit_percentage, active, created_at, updated_at) VALUES
('Travel',          'Business travel expenses including flights and trains',   150000.00, 100, TRUE, NOW(), NOW()),
('Accommodation',   'Hotel and lodging expenses',                              100000.00, 100, TRUE, NOW(), NOW()),
('Food',            'Meals and entertainment during business trips',            50000.00, 100, TRUE, NOW(), NOW()),
('Transportation',  'Local transport, taxis, cabs, fuel',                       30000.00, 100, TRUE, NOW(), NOW()),
('Software',        'Software licenses and subscriptions',                      75000.00, 100, TRUE, NOW(), NOW()),
('Equipment',       'Laptops, phones, and office hardware',                    200000.00, 100, TRUE, NOW(), NOW()),
('Office Supplies', 'Stationery, printing, and misc office items',             20000.00, 100, TRUE, NOW(), NOW()),
('Training',        'Courses, certifications, and conferences',                100000.00, 100, TRUE, NOW(), NOW()),
('Communication',   'Internet, phone bills, and communication tools',           25000.00, 100, TRUE, NOW(), NOW()),
('Other',           'Miscellaneous business expenses',                          50000.00, 100, TRUE, NOW(), NOW());


-- =============================================================
-- 3. BUDGET SERVICE  =>  spendwise_budget
-- =============================================================

CREATE DATABASE IF NOT EXISTS spendwise_budget;
USE spendwise_budget;

CREATE TABLE IF NOT EXISTS budgets (
    id                     BIGINT AUTO_INCREMENT PRIMARY KEY,
    department             VARCHAR(50)   NOT NULL,
    category_id            BIGINT        NOT NULL,
    category_name          VARCHAR(100),
    financial_year         INT           NOT NULL,
    month                  INT           NOT NULL,
    allocated_amount       DECIMAL(15,2) NOT NULL,
    spent_amount           DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    remaining_amount       DECIMAL(15,2) NOT NULL,
    utilization_percentage DECIMAL(5,2)  NOT NULL DEFAULT 0.00,
    status                 VARCHAR(20)   NOT NULL DEFAULT 'NORMAL',
    created_at             DATETIME      NOT NULL,
    updated_at             DATETIME      NOT NULL,
    UNIQUE KEY uq_dept_cat_yr_month (department, category_id, financial_year, month)
);

-- FY 2026, Month 9 (September)
INSERT IGNORE INTO budgets
    (department, category_id, category_name, financial_year, month, allocated_amount, spent_amount, remaining_amount, utilization_percentage, status, created_at, updated_at)
VALUES
('Engineering', 1, 'Travel',         2026, 9,  100000.00,  25000.00,  75000.00,  25.00, 'NORMAL',   NOW(), NOW()),
('Engineering', 5, 'Software',       2026, 9,   75000.00,  45000.00,  30000.00,  60.00, 'NORMAL',   NOW(), NOW()),
('Engineering', 6, 'Equipment',      2026, 9,  200000.00, 175000.00,  25000.00,  87.50, 'WARNING',  NOW(), NOW()),
('Finance',     1, 'Travel',         2026, 9,   50000.00,  12000.00,  38000.00,  24.00, 'NORMAL',   NOW(), NOW()),
('Marketing',   1, 'Travel',         2026, 9,  150000.00, 142000.00,   8000.00,  94.67, 'CRITICAL', NOW(), NOW()),
('Marketing',   3, 'Food',           2026, 9,   50000.00,  52000.00,  -2000.00, 104.00, 'EXCEEDED', NOW(), NOW()),
('HR',          8, 'Training',       2026, 9,  100000.00,  35000.00,  65000.00,  35.00, 'NORMAL',   NOW(), NOW()),
('Operations',  4, 'Transportation', 2026, 9,   30000.00,  18000.00,  12000.00,  60.00, 'NORMAL',   NOW(), NOW());


-- =============================================================
-- 4. EXPENSE SERVICE  =>  spendwise_expense
-- =============================================================

CREATE DATABASE IF NOT EXISTS spendwise_expense;
USE spendwise_expense;

CREATE TABLE IF NOT EXISTS expenses (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    expense_number   VARCHAR(30)   NOT NULL UNIQUE,
    employee_id      BIGINT        NOT NULL,
    employee_name    VARCHAR(100)  NOT NULL,
    department       VARCHAR(50)   NOT NULL,
    amount           DECIMAL(15,2) NOT NULL,
    currency         VARCHAR(5)    NOT NULL DEFAULT 'INR',
    description      VARCHAR(255)  NOT NULL,
    category_id      BIGINT        NOT NULL,
    category_name    VARCHAR(100),
    expense_date     DATE          NOT NULL,
    receipt_url      VARCHAR(500),
    merchant_name    VARCHAR(100),
    notes            TEXT,
    status           VARCHAR(20)   NOT NULL,
    submitted_at     DATETIME,
    approved_at      DATETIME,
    approved_by      BIGINT,
    approved_by_name VARCHAR(100),
    rejection_reason TEXT,
    created_at       DATETIME      NOT NULL,
    updated_at       DATETIME      NOT NULL,
    INDEX idx_employee_id  (employee_id),
    INDEX idx_department   (department),
    INDEX idx_status       (status),
    INDEX idx_expense_date (expense_date),
    INDEX idx_category_id  (category_id)
);

INSERT IGNORE INTO expenses
    (expense_number, employee_id, employee_name, department, amount, currency,
     description, category_id, category_name, expense_date, merchant_name, notes,
     status, submitted_at, approved_at, approved_by, approved_by_name, rejection_reason,
     created_at, updated_at)
VALUES
-- APPROVED
('EXP-2026-00001', 6, 'Ananya Patel',  'Engineering', 12500.00, 'INR',
 'Flight to Bangalore for client meeting',       1, 'Travel',         '2026-09-02',
 'IndiGo Airlines',     'Round trip BOM-BLR-BOM',
 'APPROVED',   '2026-09-03 09:00:00', '2026-09-04 10:30:00', 3, 'Arjun Mehta',  NULL, NOW(), NOW()),

('EXP-2026-00002', 7, 'Rahul Gupta',   'Engineering', 35000.00, 'INR',
 'MacBook charger and keyboard replacement',     6, 'Equipment',      '2026-09-05',
 'Apple Store',          'Equipment damaged in office',
 'APPROVED',   '2026-09-06 11:00:00', '2026-09-07 09:15:00', 3, 'Arjun Mehta',  NULL, NOW(), NOW()),

('EXP-2026-00003', 8, 'Deepika Nair',  'Marketing',    8500.00, 'INR',
 'Client dinner at Taj Hotel',                   3, 'Food',           '2026-09-08',
 'Taj Hotel Restaurant', '8 attendees',
 'APPROVED',   '2026-09-09 08:30:00', '2026-09-10 11:00:00', 4, 'Sunita Reddy', NULL, NOW(), NOW()),

-- SUBMITTED (awaiting approval)
('EXP-2026-00004', 6, 'Ananya Patel',  'Engineering', 42000.00, 'INR',
 'AWS certification course and exam fee',        8, 'Training',       '2026-09-12',
 'AWS Training',         'Cloud Practitioner exam',
 'SUBMITTED',  '2026-09-13 09:00:00', NULL, NULL, NULL, NULL, NOW(), NOW()),

('EXP-2026-00005', 8, 'Deepika Nair',  'Marketing',   68000.00, 'INR',
 'Mumbai to Delhi flight for trade show',        1, 'Travel',         '2026-09-14',
 'Air India',            'Trade show attendance',
 'SUBMITTED',  '2026-09-15 08:00:00', NULL, NULL, NULL, NULL, NOW(), NOW()),

-- UNDER_REVIEW
('EXP-2026-00006', 7, 'Rahul Gupta',   'Engineering', 18000.00, 'INR',
 'GitHub Copilot Business (12 months)',          5, 'Software',       '2026-09-16',
 'GitHub Inc.',          'Team license for 15 devs',
 'UNDER_REVIEW','2026-09-17 10:00:00', NULL, NULL, NULL, NULL, NOW(), NOW()),

-- REJECTED
('EXP-2026-00007', 9, 'Karan Joshi',   'Finance',      3200.00, 'INR',
 'Personal dinner - accidental submission',      3, 'Food',           '2026-09-18',
 'Random Restaurant',    'Please ignore',
 'REJECTED',   '2026-09-19 11:00:00', NULL, 2, 'Priya Sharma',
 'This appears to be a personal expense, not a business expense.', NOW(), NOW()),

-- DRAFT
('EXP-2026-00008', 10,'Meera Das',     'Operations',   5400.00, 'INR',
 'Cab fare for vendor visits this week',         4, 'Transportation', '2026-09-20',
 'Ola Business',         'Multiple vendor visits',
 'DRAFT',      NULL, NULL, NULL, NULL, NULL, NOW(), NOW());


-- =============================================================
-- 5. NOTIFICATION SERVICE  =>  spendwise_notification
-- =============================================================

CREATE DATABASE IF NOT EXISTS spendwise_notification;
USE spendwise_notification;

CREATE TABLE IF NOT EXISTS notifications (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id    BIGINT        NOT NULL,
    title      VARCHAR(200)  NOT NULL,
    message    VARCHAR(1000) NOT NULL,
    type       VARCHAR(50)   NOT NULL,
    is_read    BOOLEAN       NOT NULL DEFAULT FALSE,
    created_at DATETIME      NOT NULL,
    INDEX idx_user_id    (user_id),
    INDEX idx_type       (type),
    INDEX idx_is_read    (is_read),
    INDEX idx_created_at (created_at)
);

INSERT IGNORE INTO notifications (user_id, title, message, type, is_read, created_at) VALUES
-- Ananya Patel (userId=6) notifications
(6, 'Expense Approved',  'Your expense EXP-2026-00001 (Rs.12,500 - Flight to Bangalore) has been approved by Arjun Mehta.',           'EXPENSE_APPROVED',  TRUE,  NOW()),
(6, 'Expense Approved',  'Your expense EXP-2026-00002 (Rs.35,000 - MacBook charger) has been approved by Arjun Mehta.',               'EXPENSE_APPROVED',  TRUE,  NOW()),
(6, 'Expense Submitted', 'Your expense EXP-2026-00004 (Rs.42,000 - AWS Certification) has been submitted and is pending approval.',   'EXPENSE_SUBMITTED', FALSE, NOW()),

-- Deepika Nair (userId=8) notifications
(8, 'Expense Approved',  'Your expense EXP-2026-00003 (Rs.8,500 - Client dinner) has been approved by Sunita Reddy.',                 'EXPENSE_APPROVED',  TRUE,  NOW()),
(8, 'Expense Submitted', 'Your expense EXP-2026-00005 (Rs.68,000 - Mumbai to Delhi flight) has been submitted and is pending approval.','EXPENSE_SUBMITTED', FALSE, NOW()),

-- Karan Joshi (userId=9) notifications
(9, 'Expense Rejected',  'Your expense EXP-2026-00007 (Rs.3,200) was rejected. Reason: This appears to be a personal expense, not a business expense.', 'EXPENSE_REJECTED', FALSE, NOW()),

-- Manager notifications (Arjun Mehta userId=3, Sunita Reddy userId=4)
(3, 'Budget Warning',    'Engineering/Equipment budget has reached 87.5% utilization (Rs.175,000 / Rs.200,000). Please review pending expenses.', 'BUDGET_WARNING',  FALSE, NOW()),
(4, 'Budget Critical',   'Marketing/Travel budget has reached 94.67% utilization (Rs.142,000 / Rs.150,000). Only Rs.8,000 remaining!',           'BUDGET_CRITICAL', FALSE, NOW()),
(4, 'Budget Exceeded',   'Marketing/Food budget has been EXCEEDED! Spent Rs.52,000 against limit of Rs.50,000. Please raise a budget revision.',   'BUDGET_EXCEEDED', FALSE, NOW());
