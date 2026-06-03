#  Twilio SMS Client System

> **Software Requirements Specification (SRS)**  
> Version 1.0 | IEEE 830 Standard | Java Servlets & JSP

---

##  Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [System Features](#3-system-features)
4. [External Interface Requirements](#4-external-interface-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [System Constraints](#6-system-constraints)
7. [Class Diagram](#7-class-diagram)
8. [Database Design (ERD)](#8-database-design-erd)
9. [Future Enhancements](#9-future-enhancements)

---

## 1. Introduction

### 1.1 Purpose

The purpose of this document is to describe the software requirements for the **Twilio SMS Client System**. This system allows customers to send SMS messages using their personal Twilio accounts, while administrators can manage customer accounts and monitor SMS usage statistics.

This document serves as a reference for developers, testers, and all project stakeholders.

---

### 1.2 Scope

The **Twilio SMS Client System** is a web-based application developed using **Java Servlets and JSP**.

| User Type | Description |
|-----------|-------------|
|  **Customer** | Can register, verify account, send SMS, and manage message history |
|  **Administrator** | Can manage customer accounts and monitor SMS usage statistics |

The system integrates with the **Twilio SMS API** to deliver SMS messages.

---

### 1.3 Definitions, Acronyms, and Abbreviations

| Term | Description |
|------|-------------|
| **SMS** | Short Message Service |
| **API** | Application Programming Interface |
| **Twilio** | Cloud communications platform used to send SMS |
| **MSISDN** | Mobile phone number |
| **SRS** | Software Requirements Specification |
| **SID** | Twilio Account Identifier |
| **JSP** | JavaServer Pages |
| **DAO** | Data Access Object |
| **OTP** | One-Time Password (verification code) |
| **3NF** | Third Normal Form (database normalization level) |

---

### 1.4 References

- IEEE 830 Software Requirements Specification Standard
- [Twilio API Documentation](https://www.twilio.com/docs)
- Java Servlet Documentation

---

### 1.5 Overview

This document covers: overall system description, system features, functional requirements, non-functional requirements, class diagram, database ERD, and system constraints.

---

## 2. Overall Description

### 2.1 Product Perspective

The Twilio SMS Client System is a **web application** that allows customers to send SMS messages through their own Twilio accounts. The system architecture follows a **three-layer structure**:

```
┌──────────────────────────────────────────┐
│           Presentation Layer             │
│            (JSP / HTML / CSS)            │
├──────────────────────────────────────────┤
│          Business Logic Layer            │
│      (Java Servlets / Service Classes)   │
├──────────────────────────────────────────┤
│           Data Access Layer              │
│          (DAO Classes / MySQL)           │
└──────────────────────────────────────────┘
                 ↕ Twilio API
```

---

### 2.2 Product Functions

####  Customer Functions

| # | Function |
|---|----------|
| 1 | Register a new account |
| 2 | Verify phone number via SMS OTP |
| 3 | Login and logout |
| 4 | View and edit profile |
| 5 | Send SMS messages |
| 6 | View SMS history |
| 7 | Search SMS messages |
| 8 | Delete SMS records |

####  Administrator Functions

| # | Function |
|---|----------|
| 1 | View all customers |
| 2 | Add new customers |
| 3 | Edit customer information |
| 4 | Delete customers |
| 5 | View SMS statistics per customer |

---

### 2.3 User Classes and Characteristics

####  Customer
- Basic knowledge of web applications
- Owns a personal Twilio account
- Must verify phone number before accessing the system
- Can only access and manage their own data

####  Administrator
- Higher access privileges than customers
- Responsible for overall customer management
- Can view all customers' data and SMS statistics

---

### 2.4 Operating Environment

| Component | Technology |
|-----------|------------|
| **Backend** | Java Servlets |
| **Frontend** | HTML, CSS, JSP |
| **Database** | MySQL |
| **Server** | Apache Tomcat |
| **External Service** | Twilio SMS API |
| **Browser Support** | Chrome, Firefox, Edge |

---

### 2.5 Design and Implementation Constraints

-  Implemented using **Java Servlets**
-  Must use **Twilio API** for SMS sending
-  Must use a **relational database (MySQL)**
-  Must use **HTTP session-based authentication**
-  Passwords must be securely stored using **hashing**

---

### 2.6 Assumptions and Dependencies

**Assumptions:**
- Customers have valid, active Twilio accounts
- Internet connectivity is available on the server

**Dependencies:**
- Twilio API availability
- Database server availability

---

## 3. System Features

### 3.1 User Registration

**Description:** Customers create a new account by providing personal information and Twilio credentials.

**Inputs:**

| Field | Type |
|-------|------|
| Full Name | Text |
| Birthday | Date |
| Username | Text |
| Password | Password |
| Phone Number (MSISDN) | Text |
| Email | Email |
| Address | Text |
| Twilio Account SID | Text |
| Twilio Auth Token | Text |
| Twilio Sender ID | Text |

**Processing:** Validate input → Store in database → Send verification SMS via Twilio  
**Output:** Account created → redirect to verification page

---

### 3.2 Account Verification

**Description:** Customers verify their phone number with a random OTP sent via SMS before they can log in.

**Inputs:** Verification Code (OTP)  
**Processing:** Validate OTP → Activate account  
**Output:** Success → redirect to login | Failure → error message

---

### 3.3 User Login

**Description:** Users log in using their username and password.

**Inputs:** Username, Password  
**Processing:** Validate credentials → Check verification status → Create session with role  
**Output:** Redirect to appropriate dashboard (Customer or Administrator)

---

### 3.4 Send SMS

**Description:** Customers send SMS using their own Twilio account credentials.

**Inputs:**

| Field | Description |
|-------|-------------|
| From | Twilio Sender ID (pre-filled from profile) |
| To | Recipient phone number |
| Body | Message content |

**Processing:** Send via Twilio API → Save record to database  
**Output:** SMS sent confirmation or descriptive error message

---

### 3.5 SMS History

**Description:** Customers view all previously sent SMS messages from their own account only.

| Column | Description |
|--------|-------------|
| From | Sender number |
| To | Recipient number |
| Body | Message content |
| Date Sent | Timestamp |

---

### 3.6 Search SMS

**Description:** Customers filter their message history.

| Filter | Description |
|--------|-------------|
| From | Filter by sender number |
| To | Filter by recipient number |
| Date Range | Filter by start and end date |

---

### 3.7 Delete SMS

**Description:** Customers remove specific messages from their history.  
**Processing:** Remove or soft-delete the SMS record from the database.

---

### 3.8 Customer Management *(Admin)*

**Description:** Administrators perform full CRUD operations on customer accounts.

| Action | Description |
|--------|-------------|
| View List | See all registered customers |
| View Details | See a specific customer's full profile |
| Edit | Update customer information |
| Delete | Remove a customer account |

---

### 3.9 SMS Statistics *(Admin)*

**Description:** Administrators view SMS usage across all customer accounts.

| Column | Description |
|--------|-------------|
| Customer Name | Full name |
| Username | Login username |
| Total SMS Sent | Count of all messages sent |

---

## 4. External Interface Requirements

### 4.1 User Interface

| Page | Access |
|------|--------|
| Home Page | Public |
| Login Page | Public |
| Registration Page | Public |
| Account Verification Page | Customer (unverified) |
| Customer Dashboard | Customer |
| Administrator Dashboard | Admin |
| Profile Page | Customer |
| Send SMS Page | Customer |
| SMS History Page | Customer |
| Search SMS Page | Customer |
| Customer Management Page | Admin |
| Statistics Page | Admin |

---

### 4.2 Software Interface

| Interface | Description |
|-----------|-------------|
| **Twilio API** | Used for sending and receiving SMS messages |
| **MySQL Database** | Used for data persistence |
| **Apache Tomcat** | Java web application server |

---

### 4.3 Communication Interface

The system communicates with external services using **HTTPS requests to the Twilio REST API**. All internal communication uses standard HTTP sessions.

---

## 5. Non-Functional Requirements

### 5.1 Performance Requirements

| ID | Requirement |
|----|-------------|
| NFR-1.1 | The system shall process SMS requests within **3 seconds** |
| NFR-1.2 | The system shall support multiple concurrent users |
| NFR-1.3 | Search results shall be returned within **2 seconds** |

### 5.2 Security Requirements

| ID | Requirement |
|----|-------------|
| NFR-2.1 | Passwords shall be stored using a secure hashing algorithm (e.g., bcrypt) |
| NFR-2.2 | Only authenticated users can access system features |
| NFR-2.3 | Role-based access control (RBAC) shall be enforced on all pages |
| NFR-2.4 | Twilio credentials (SID & Token) shall be stored encrypted at rest |
| NFR-2.5 | All data transmission shall use HTTPS |

### 5.3 Reliability Requirements

| ID | Requirement |
|----|-------------|
| NFR-3.1 | The system shall maintain complete message logs |
| NFR-3.2 | All errors shall be handled gracefully with user-friendly messages |

### 5.4 Availability Requirements

| ID | Requirement |
|----|-------------|
| NFR-4.1 | The system shall be available **24/7** |
| NFR-4.2 | System uptime shall target **99%** or higher |

### 5.5 Usability Requirements

| ID | Requirement |
|----|-------------|
| NFR-5.1 | The user interface shall be simple and intuitive |
| NFR-5.2 | Users shall be able to send an SMS in minimal steps |
| NFR-5.3 | The application shall be accessible on desktop and mobile browsers |

---

## 6. System Constraints

-  Use **Java Servlets** as the backend framework
-  Integrate with the **Twilio SMS API** for all SMS operations
-  Store all data in a **MySQL relational database**
-  Use **web browsers** as the only client interface
-  Use **HTTP session-based authentication**

---

## 7. Class Diagram

The system is organized into **5 layers**: Domain Classes, Service Layer, DAO Layer, Utility Classes, and their relationships.

---

### 7.1 Domain Classes

####  User *(Base Class)*

The `User` class is the base entity for all system users. Both `Customer` and `Administrator` inherit from it.

| Attribute | Type | Description |
|-----------|------|-------------|
| `userId` | int | Unique user identifier |
| `username` | String | Login username |
| `passwordHash` | String | Encrypted password |
| `role` | Role | User role (Admin / Customer) |
| `isVerified` | boolean | Whether account is verified |
| `isActive` | boolean | Whether account is active |
| `createdAt` | Date | Account creation timestamp |

**Methods:**
- `login(username, password)`
- `logout()`
- `changePassword()`

---

####  Administrator *(extends User)*

The `Administrator` class represents users who manage the system and customer accounts.

| Attribute | Type | Description |
|-----------|------|-------------|
| `adminId` | int | Unique administrator identifier |

**Methods:**
- `viewCustomers()`
- `addCustomer()`
- `editCustomer()`
- `deleteCustomer()`
- `viewCustomerStatistics()`

---

####  Customer *(extends User)*

The `Customer` class represents users who send SMS messages through their Twilio account.

| Attribute | Type | Description |
|-----------|------|-------------|
| `customerId` | int | Unique customer identifier |
| `fullName` | String | Customer's full name |
| `birthDate` | Date | Date of birth |
| `phoneNumber` | String | MSISDN |
| `jobTitle` | String | Job title |
| `email` | String | Email address |
| `address` | String | Physical address |
| `twilioAccountSID` | String | Twilio Account SID |
| `twilioAuthToken` | String | Twilio Auth Token |
| `twilioSenderId` | String | Allowed Twilio Sender ID |

**Methods:**
- `register()`
- `updateProfile()`
- `sendSMS()`
- `viewSMSHistory()`
- `searchSMS()`
- `deleteSMS()`

**Relationship:** `Customer (1) ───────── (*) SMSMessage`

---

####  SMSMessage

The `SMSMessage` class represents an SMS message sent through the system.

| Attribute | Type | Description |
|-----------|------|-------------|
| `smsId` | int | Unique SMS identifier |
| `fromNumber` | String | Sender phone number |
| `toNumber` | String | Recipient phone number |
| `body` | String | SMS message content |
| `status` | String | Sent / Failed / Delivered / Queued |
| `sentDate` | Date | Timestamp of sending |
| `twilioMessageSid` | String | Twilio-returned message SID |

**Methods:**
- `createSMS()`
- `deleteSMS()`
- `getSMSDetails()`

**Relationship:** `Customer (1) ───────── (*) SMSMessage`

---

####  VerificationCode

The `VerificationCode` class manages account verification via SMS OTP.

| Attribute | Type | Description |
|-----------|------|-------------|
| `verificationId` | int | Unique record identifier |
| `code` | String | Random OTP code |
| `sentTo` | String | Phone number the code was sent to |
| `sentAt` | Date | When the code was sent |
| `expiresAt` | Date | Code expiry timestamp |
| `isUsed` | boolean | Whether code has been used |

**Methods:**
- `generateCode()`
- `validateCode()`
- `markAsUsed()`

**Relationship:** `User (1) ───────── (*) VerificationCode`

---

### 7.2 Class Relationships Overview

```
              ┌─────────────┐
              │    User     │  (Base Class)
              └──────┬──────┘
          ┌──────────┴──────────┐
          │                     │
  ┌───────▼───────┐    ┌────────▼────────┐
  │ Administrator │    │    Customer     │
  └───────────────┘    └────────┬────────┘
                                │ 1
                                │
                                │ *
                       ┌────────▼────────┐
                       │   SMSMessage    │
                       └─────────────────┘

  ┌─────────────┐
  │    User     │──── 1 ────────── * ────── VerificationCode
  └─────────────┘
```

---

### 7.3 Service Layer Classes

Service classes contain the main **business logic** of the application.

| Service Class | Responsibility | Uses |
|---------------|---------------|------|
| **AuthService** | Authentication & account management | UserDAO, VerificationService |
| **SMSService** | SMS sending & management | SMSDAO, TwilioService |
| **CustomerService** | Customer profile operations | CustomerDAO |
| **AdminService** | Administrative operations | CustomerDAO, SMSDAO |
| **VerificationService** | OTP generation & validation | VerificationDAO |

#### AuthService Methods
- `login(username, password)`
- `logout(session)`
- `registerCustomer(customerData)`
- `verifyAccount(userId, code)`
- `sendVerificationCode(userId)`

#### SMSService Methods
- `sendSMS(customerId, from, to, body)`
- `deleteSMS(smsId)`
- `getSMSHistory(customerId)`
- `searchSMS(customerId, filters)`

#### CustomerService Methods
- `getCustomerProfile(customerId)`
- `updateCustomerProfile(customerData)`
- `getCustomerSMSHistory(customerId)`

#### AdminService Methods
- `getAllCustomers()`
- `getCustomerById(customerId)`
- `addCustomer(customerData)`
- `updateCustomer(customerData)`
- `deleteCustomer(customerId)`
- `getCustomerStatistics()`

#### VerificationService Methods
- `generateVerificationCode()`
- `sendVerificationSMS(phoneNumber)`
- `validateVerificationCode(userId, code)`

---

### 7.4 Data Access Layer (DAO Classes)

DAO classes are responsible for interacting with the database.

| DAO Class | Methods |
|-----------|---------|
| **UserDAO** | `findByUsername()`, `findById()`, `saveUser()`, `updateUser()` |
| **CustomerDAO** | `getCustomerById()`, `saveCustomer()`, `updateCustomer()`, `deleteCustomer()`, `getAllCustomers()` |
| **SMSDAO** | `saveSMS()`, `deleteSMS()`, `findSMSByCustomer()`, `searchSMS()` |
| **VerificationDAO** | `saveCode()`, `findValidCode()`, `markCodeUsed()` |

---

### 7.5 Utility Classes

#### TwilioService

Handles all integration with the Twilio SMS API.

| Attribute | Type | Description |
|-----------|------|-------------|
| `accountSID` | String | Twilio Account SID |
| `authToken` | String | Twilio Auth Token |

**Methods:**
- `sendSMS(from, to, body)`
- `sendVerificationSMS(phoneNumber, code)`

---

## 8. Database Design (ERD)

The database follows **Third Normal Form (3NF)** — no repeated groups, no unnecessary duplication, clean separation of concerns.

---

### 8.1 Tables Overview

| # | Table | Purpose |
|---|-------|---------|
| 1 | `roles` | Stores user types (Admin / Customer) |
| 2 | `users` | Stores login credentials for all users |
| 3 | `customer_profiles` | Stores detailed customer & Twilio info |
| 4 | `account_verifications` | Stores OTP codes for phone verification |
| 5 | `sms_messages` | Stores all SMS records (core business table) |
| 6 | `sms_history_deleted` | *(Optional)* Archive of deleted SMS records |
| 7 | `login_audit` | *(Optional)* Login activity log for security |

---

### 8.2 Table Definitions

####  roles

| Column | Type | Description |
|--------|------|-------------|
| `role_id` | INT (PK) | Role identifier |
| `role_name` | VARCHAR(50) | Role name: Admin / Customer |

---

####  users

| Column | Type | Description |
|--------|------|-------------|
| `user_id` | INT (PK) | Unique user ID |
| `username` | VARCHAR(100) UNIQUE | Login username |
| `password_hash` | VARCHAR(255) | Hashed password |
| `role_id` | INT (FK → roles) | User role |
| `is_verified` | BOOLEAN | Phone number verified? |
| `is_active` | BOOLEAN | Account active? |
| `created_at` | TIMESTAMP | Account creation date |
| `updated_at` | TIMESTAMP | Last update date |

---

####  customer_profiles

| Column | Type | Description |
|--------|------|-------------|
| `customer_id` | INT (PK) | Customer profile ID |
| `user_id` | INT (FK → users, UNIQUE) | Linked user account |
| `full_name` | VARCHAR(150) | Full name |
| `birth_date` | DATE | Birthday |
| `phone_number` | VARCHAR(20) | MSISDN |
| `job_title` | VARCHAR(100) | Job title |
| `email` | VARCHAR(150) | Email address |
| `address` | TEXT | Physical address |
| `twilio_account_sid` | VARCHAR(255) | Twilio Account SID |
| `twilio_auth_token` | VARCHAR(255) | Twilio Auth Token |
| `twilio_sender_id` | VARCHAR(50) | Twilio Sender Phone Number |

---

####  account_verifications

| Column | Type | Description |
|--------|------|-------------|
| `verification_id` | INT (PK) | Verification record ID |
| `user_id` | INT (FK → users) | Related user |
| `verification_code` | VARCHAR(10) | Random OTP code |
| `sent_to` | VARCHAR(20) | Phone number code was sent to |
| `sent_at` | TIMESTAMP | When code was sent |
| `expires_at` | TIMESTAMP | Code expiry time |
| `is_used` | BOOLEAN | Whether code was used |
| `verified_at` | TIMESTAMP NULL | Verification success timestamp |

---

####  sms_messages *(Core Business Table)*

| Column | Type | Description |
|--------|------|-------------|
| `sms_id` | INT (PK) | Unique SMS ID |
| `customer_id` | INT (FK → customer_profiles) | Customer who sent the SMS |
| `from_number` | VARCHAR(50) | Sender number (Twilio Sender ID) |
| `to_number` | VARCHAR(20) | Recipient number |
| `sms_body` | TEXT | Message content |
| `twilio_message_sid` | VARCHAR(100) | Twilio returned message SID |
| `status` | VARCHAR(50) | Sent / Failed / Delivered / Queued |
| `sent_at` | TIMESTAMP | Date/time of sending |
| `is_deleted` | BOOLEAN | Soft delete flag |

---

####  sms_history_deleted *(Optional — Professional Design)*

| Column | Type | Description |
|--------|------|-------------|
| `deleted_id` | INT (PK) | Archive record ID |
| `sms_id` | INT (FK → sms_messages) | Original SMS reference |
| `customer_id` | INT (FK → customer_profiles) | Customer who deleted it |
| `deleted_at` | TIMESTAMP | Delete timestamp |

---

####  login_audit *(Optional — Security & Tracking)*

| Column | Type | Description |
|--------|------|-------------|
| `audit_id` | INT (PK) | Audit record ID |
| `user_id` | INT (FK → users) | Related user |
| `login_time` | TIMESTAMP | Login timestamp |
| `logout_time` | TIMESTAMP NULL | Logout timestamp |
| `ip_address` | VARCHAR(50) | Client IP address |
| `login_status` | VARCHAR(20) | Success / Failed |

---

### 8.3 Relationships Summary

| Relationship | Cardinality | Description |
|-------------|-------------|-------------|
| `roles` → `users` | **1 : M** | One role assigned to many users |
| `users` → `customer_profiles` | **1 : 1** | Each customer user has one profile |
| `users` → `account_verifications` | **1 : M** | A user may attempt verification multiple times |
| `customer_profiles` → `sms_messages` | **1 : M** | One customer sends many SMS messages |
| `sms_messages` → `sms_history_deleted` | **1 : 0..1** | An SMS may have one deletion record |
| `users` → `login_audit` | **1 : M** | One user has many login records |

---

### 8.4 ERD Diagram

```
┌──────────────┐
│    roles     │
├──────────────┤
│ PK role_id   │
│ role_name    │
└──────┬───────┘
       │ 1
       │
       │ M
┌──────▼────────────┐         ┌──────────────────────┐
│      users        │ 1     M │  account_verifications│
├───────────────────┤─────────┤──────────────────────┤
│ PK user_id        │         │ PK verification_id   │
│ username          │         │ FK user_id           │
│ password_hash     │         │ verification_code    │
│ FK role_id        │         │ sent_to              │
│ is_verified       │         │ sent_at              │
│ is_active         │         │ expires_at           │
│ created_at        │         │ is_used              │
│ updated_at        │         │ verified_at          │
└──────┬────────────┘         └──────────────────────┘
       │ 1
       │
       │ 1
┌──────▼──────────────────┐
│    customer_profiles    │
├─────────────────────────┤
│ PK customer_id          │
│ FK user_id (UNIQUE)     │
│ full_name               │
│ birth_date              │
│ phone_number            │
│ job_title               │
│ email                   │
│ address                 │
│ twilio_account_sid      │
│ twilio_auth_token       │
│ twilio_sender_id        │
└──────┬──────────────────┘
       │ 1
       │
       │ M
┌──────▼──────────────────┐         ┌──────────────────────┐
│      sms_messages       │ 1   0..1│  sms_history_deleted │
├─────────────────────────┤─────────┤──────────────────────┤
│ PK sms_id               │         │ PK deleted_id        │
│ FK customer_id          │         │ FK sms_id            │
│ from_number             │         │ FK customer_id       │
│ to_number               │         │ deleted_at           │
│ sms_body                │         └──────────────────────┘
│ twilio_message_sid      │
│ status                  │
│ sent_at                 │
│ is_deleted              │
└─────────────────────────┘
```

---

### 8.5 Admin Statistics Query

The Administrator statistics page is powered by this query:

```sql
SELECT
    cp.full_name,
    u.username,
    COUNT(s.sms_id) AS total_sms_sent
FROM customer_profiles cp
JOIN users u ON cp.user_id = u.user_id
LEFT JOIN sms_messages s ON cp.customer_id = s.customer_id
GROUP BY cp.full_name, u.username;
```

---

### 8.6 Minimum Required Tables (for Submission)

If only the core tables are required, the following 5 tables are sufficient to fully implement the project:

```
roles (1) ──────── (M) users
users (1) ──────── (1) customer_profiles
users (1) ──────── (M) account_verifications
customer_profiles (1) ──────── (M) sms_messages
```

---

## 9. Future Enhancements

| # | Enhancement |
|---|-------------|
| 1 |  SMS delivery reports |
| 2 |  Two-factor authentication (2FA) |
| 3 |  SMS scheduling |
| 4 |  Bulk SMS sending |
| 5 |  Mobile application support |
| 6 |  Inbound SMS support via Twilio Callback URL |
| 7 |  Export SMS history to CSV / Excel |

---

##  Project Status

>  **In Development**



*This SRS was prepared in accordance with the **IEEE 830-1998** Standard for Software Requirements Specifications.*
