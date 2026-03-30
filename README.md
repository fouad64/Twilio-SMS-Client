# Twilio-SMS-Client

## Software Requirements Specification (SRS)

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [User Classes and Characteristics](#3-user-classes-and-characteristics)
4. [System Features and Requirements](#4-system-features-and-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [Entity Data Models](#6-entity-data-models)
7. [User Stories](#7-user-stories)
8. [Bonus Features](#8-bonus-features)

---

## 1. Introduction

### 1.1 Purpose

This document provides a full Software Requirements Specification (SRS) for the **Twilio SMS Client** web application. It defines the functional and non-functional requirements for all user roles, system behaviors, and data models to guide the development team throughout the project lifecycle.

### 1.2 Scope

The **Twilio SMS Client** is a web-based application that enables customers to send and manage SMS messages through their personal Twilio accounts. The system also provides administrators with tools to manage customers and monitor usage statistics.

Key capabilities include:

- User registration and authentication (with SMS-based phone number verification via Twilio)
- Customer SMS sending and history management
- Administrator dashboard for customer management and statistics
- Role-based access control (Administrator vs. Customer)

### 1.3 Definitions, Acronyms, and Abbreviations

| Term | Definition |
|------|------------|
| **SRS** | Software Requirements Specification |
| **SMS** | Short Message Service |
| **MSISDN** | Mobile Station International Subscriber Directory Number (phone number) |
| **SID** | Twilio Account SID (unique account identifier) |
| **Token** | Twilio Auth Token (used for API authentication) |
| **SenderID** | The allowed Twilio phone number used to send SMS |
| **Admin** | System Administrator |
| **CRUD** | Create, Read, Update, Delete |
| **2FA** | Two-Factor Authentication |

### 1.4 References

- [Twilio Official Documentation](https://www.twilio.com/docs)
- [IEEE Standard for Software Requirements Specifications (IEEE 830–1998)](https://medium.com/@abdul.rehman_84899/ieee-standard-for-software-requirements-specifications-ieee-830-1998-0395f1da639a)

---

## 2. Overall Description

### 2.1 Product Perspective

The Twilio SMS Client is a standalone web application that acts as a management interface and SMS gateway. Each customer uses their own Twilio credentials to send messages, ensuring billing and account isolation. The system does not share Twilio credentials between users.

### 2.2 Product Functions

- User registration with profile data and Twilio credentials
- Phone number (MSISDN) validation via Twilio SMS OTP
- Authenticated login with role-based redirection
- SMS sending using the customer's own Twilio account
- SMS history management (view, search, delete)
- Admin panel for customer management and statistics
- (Bonus) Inbound SMS handling via Twilio Callback URL

### 2.3 Operating Environment

- Web-based application (accessible via browser)
- Backend integrated with the Twilio REST API
- Database for storing user profiles, credentials, and SMS history

---

## 3. User Classes and Characteristics

| User Type | Description | Access Level |
|-----------|-------------|--------------|
| **Customer** | A registered user who has validated their phone number and uses their Twilio account to send/receive SMS | Standard — can only manage their own data and SMS |
| **Administrator** | A privileged system operator who manages all customer accounts and monitors statistics | Elevated — full customer CRUD and stats visibility |

> After login, each user is **redirected to a role-specific Home page** based on their privileges.

---

## 4. System Features and Requirements

### 4.1 User Authentication & Authorization

**Description:**  
All users must authenticate before accessing any system features. The system supports username/password login and redirects users based on their role.

| ID | Requirement |
|----|-------------|
| FR-1.1 | The system shall provide a login page accepting username and password |
| FR-1.2 | The system shall authenticate users against stored credentials |
| FR-1.3 | The system shall support two roles: `Customer` and `Administrator` |
| FR-1.4 | After login, the system shall redirect users to a role-specific Home page |
| FR-1.5 | The system shall restrict all features based on the authenticated user's role |
| FR-1.6 | The system shall allow any user to logout and log back in with a different account |

---

### 4.2 Customer Registration

**Description:**  
New customers can create an account by providing profile data and their Twilio credentials.

| ID | Requirement |
|----|-------------|
| FR-2.1 | The system shall provide a sign-up page for new customers |
| FR-2.2 | The registration form shall collect: name, birthday, password, phone number (MSISDN), job, email, address, Twilio Account SID, Twilio Auth Token, and Twilio Sender ID |
| FR-2.3 | The system shall validate the customer's MSISDN by sending a random short OTP code via SMS using the customer's own Twilio credentials |
| FR-2.4 | The customer must enter the received OTP code to complete account activation |
| FR-2.5 | The customer shall not be able to log in until MSISDN validation is complete |

---

### 4.3 Customer Profile Management

**Description:**  
Authenticated customers can view and update their profile information.

| ID | Requirement |
|----|-------------|
| FR-3.1 | The system shall provide a profile page displaying all registered customer information |
| FR-3.2 | The customer shall be able to edit any previously entered profile fields |
| FR-3.3 | Profile changes shall be saved and reflected immediately |

---

### 4.4 SMS Sending (Customer)

**Description:**  
Customers can compose and send SMS messages using their own Twilio account credentials.

| ID | Requirement |
|----|-------------|
| FR-4.1 | The system shall provide an SMS sending form |
| FR-4.2 | The form shall accept: `From` (Sender ID), `To` (recipient phone number), and `Body` (message content) |
| FR-4.3 | The system shall use the customer's stored Twilio Account SID and Auth Token to send the SMS |
| FR-4.4 | The `From` field shall only allow the customer's registered Twilio Sender ID |
| FR-4.5 | The system shall confirm successful delivery or display an appropriate error |

---

### 4.5 SMS History Management (Customer)

**Description:**  
Customers can view, search, and delete their personal SMS history.

| ID | Requirement |
|----|-------------|
| FR-5.1 | The system shall display a full list of all SMS messages sent from the customer's account |
| FR-5.2 | Each record shall show: `From`, `To`, `Body`, and `Date` |
| FR-5.3 | The customer shall be able to delete specific SMS records from their history |
| FR-5.4 | The customer shall be able to search SMS history by `From` address |
| FR-5.5 | The customer shall be able to search SMS history by `To` address |
| FR-5.6 | The customer shall be able to search SMS history by `Date Range` |

---

### 4.6 Administrator – Customer Management

**Description:**  
Administrators can manage all registered customer accounts from a central dashboard.

| ID | Requirement |
|----|-------------|
| FR-6.1 | The admin shall be able to view a list of all registered customers |
| FR-6.2 | The admin shall be able to view the profile details of a specific customer |
| FR-6.3 | The admin shall be able to edit customer information |
| FR-6.4 | The admin shall be able to delete a customer account |

---

### 4.7 Administrator – Statistics

**Description:**  
Administrators can monitor SMS usage across all customer accounts.

| ID | Requirement |
|----|-------------|
| FR-7.1 | The admin dashboard shall display SMS sending statistics per customer |
| FR-7.2 | Statistics shall show the total number of SMS messages sent from each customer's account |

---

## 5. Non-Functional Requirements

### 5.1 Security Requirements

| ID | Requirement |
|----|-------------|
| NFR-1.1 | Passwords shall be hashed before storage (e.g., bcrypt) |
| NFR-1.2 | Twilio credentials (SID and Auth Token) shall be stored securely and encrypted at rest |
| NFR-1.3 | Role-based access control (RBAC) shall be enforced on all routes |
| NFR-1.4 | All data transmission shall use HTTPS |
| NFR-1.5 | User sessions shall expire after a defined period of inactivity |

### 5.2 Performance Requirements

| ID | Requirement |
|----|-------------|
| NFR-2.1 | Pages shall load within 3 seconds under normal conditions |
| NFR-2.2 | SMS search results shall be returned within 2 seconds |

### 5.3 Usability Requirements

| ID | Requirement |
|----|-------------|
| NFR-3.1 | The UI shall be intuitive, clean, and easy to navigate |
| NFR-3.2 | Error messages shall be descriptive and user-friendly |
| NFR-3.3 | The application shall be accessible on desktop and mobile browsers |

### 5.4 Availability Requirements

| ID | Requirement |
|----|-------------|
| NFR-4.1 | The system shall target 99% uptime |
| NFR-4.2 | The system shall be available 24/7 |

### 5.5 Maintainability Requirements

| ID | Requirement |
|----|-------------|
| NFR-5.1 | Code shall be modular, clean, and well-documented |
| NFR-5.2 | The system shall support easy updates and feature additions |

---

## 6. Entity Data Models

### 6.1 Customer Entity

| Attribute | Data Type | Description |
|-----------|-----------|-------------|
| `customer_id` | Integer | Unique identifier (Primary Key) |
| `name` | String | Full name |
| `birthday` | Date | Date of birth |
| `password` | String (hashed) | Hashed password |
| `msisdn` | String | Phone number |
| `job` | String | Job title |
| `email` | String | Email address |
| `address` | String | Physical address |
| `twilio_sid` | String (encrypted) | Twilio Account SID |
| `twilio_token` | String (encrypted) | Twilio Auth Token |
| `twilio_sender_id` | String | Twilio Sender Phone Number |
| `is_validated` | Boolean | Whether MSISDN is verified |
| `created_at` | DateTime | Account creation timestamp |

### 6.2 SMS Entity

| Attribute | Data Type | Description |
|-----------|-----------|-------------|
| `sms_id` | Integer | Unique identifier (Primary Key) |
| `customer_id` | Integer | Foreign key referencing Customer |
| `from` | String | Sender phone number (Twilio Sender ID) |
| `to` | String | Recipient phone number |
| `body` | String | SMS content |
| `date` | DateTime | Timestamp of the SMS |
| `direction` | Enum | `outbound` / `inbound` (bonus) |

---

## 7. User Stories

> **As a Customer,**  
> I want to register using my Twilio credentials and validate my phone number via SMS,  
> so that I can securely send and track messages through my own Twilio account without sharing credentials with others.

> **As a Customer,**  
> I want to view my full SMS history and search by date, sender, or recipient,  
> so that I can quickly find and manage past messages.

> **As an Administrator,**  
> I want to manage all registered customer accounts from a central dashboard,  
> so that I can monitor usage, resolve issues, and maintain system integrity efficiently.

---

## 8. Bonus Features

| ID | Feature | Description |
|----|---------|-------------|
| BNS-1 | Inbound SMS Support | Configure a Twilio Callback URL to receive inbound SMS and save them to the customer's database |
| BNS-2 | Inbound SMS Listing | Allow customers to view all inbound SMS messages received on their Twilio account |

---

## Project Status

>  **In Development**

---

*This SRS was written following the IEEE 830-1998 standard for Software Requirements Specifications.*
