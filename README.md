# ShopOps

> **Roxiler Systems — Online Assessment**

ShopOps is a full-stack store rating and management application developed as part of the **Online Assessment for Roxiler Systems**.

The application provides role-based functionality for **System Administrators, Normal Users, and Store Owners**, allowing administrators to manage users and stores, users to discover and rate stores, and store owners to monitor ratings received by their stores.

The application was developed using **React.js** for the frontend, **Node.js and Express.js** for the backend, and **MySQL** for persistent data storage.

---

## About the Project

**ShopOps** was developed to fulfill the requirements of the **Roxiler Systems Online Assessment**.

The application implements three primary roles:

- **System Administrator**
- **Normal User**
- **Store Owner**

Each role has its own permissions and application flow.

### Application Name

**ShopOps**

### Assessment

**Online Assessment — Roxiler Systems**

---

## Features

### Authentication

- User registration
- User login
- JWT-based authentication
- Password hashing using bcrypt
- Change password functionality
- Role-based access control
- Protected API routes
- Session persistence through JWT

---

## System Administrator

The System Administrator can:

- Login securely
- View dashboard statistics
- View all registered users
- Search users
- Filter users by:
  - Name
  - Email
  - Address
  - Role
- Sort users
- View individual user details
- Create new users
- Create new administrators
- Create Store Owner accounts
- View all registered stores
- Search stores
- Filter stores by:
  - Name
  - Email
  - Address
- Sort stores
- Create new stores
- Assign stores to Store Owners

---

## Normal User

Normal users can:

- Create their own account
- Login securely
- View available stores
- Search stores
- Sort stores
- View overall store ratings
- View their own submitted rating
- Submit a rating between **1 and 5**
- Update an existing rating
- Logout

A normal user can submit only one rating per store. Existing ratings can be modified instead of creating duplicate ratings.

---

## Store Owner

Store Owners can:

- Login securely
- Access their Store Owner dashboard
- View their assigned store
- View the store's average rating
- View users who have rated their store
- View individual customer ratings
- Logout

Store Owners cannot access administrator functionality.

---

## Technology Stack

### Frontend

- React.js
- Vite
- Bootstrap
- JavaScript
- React Router
- Axios

### Backend

- Node.js
- Express.js
- JWT
- bcrypt.js

### Database

- MySQL

### Development Tools

- Git
- GitHub
- Postman
- Visual Studio Code
- Nodemon
- ESLint

---

## Application Architecture

```text
                         ShopOps
                            |
                            v
                  React Frontend
                            |
                      REST API
                            |
                            v
                  Node.js / Express
                            |
             +--------------+--------------+
             |              |              |
             v              v              v
       Authentication   Authorization   Controllers
             |              |              |
             +--------------+--------------+
                            |
                            v
                         MySQL
                         Database
