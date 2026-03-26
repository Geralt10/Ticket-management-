# Ticket Management System (PHP + MySQL + OOP)

## Features
- Admin and user login
- User registration
- User can create a ticket
- User can view own tickets
- Admin can view all tickets
- Admin can update ticket status (`Open`, `In Progress`, `Closed`)
- Admin can delete tickets
- Clean folder structure
- PDO-based secure DB connection
- OOP architecture

## Project Structure
```
ticketManagement/
|-- config/
|   `-- config.php
|-- core/
|   |-- Auth.php
|   |-- Database.php
|   |-- Model.php
|   `-- View.php
|-- models/
|   |-- Ticket.php
|   `-- User.php
|-- controllers/
|   |-- AdminController.php
|   |-- AuthController.php
|   `-- TicketController.php
|-- views/
|   |-- layouts/
|   |   |-- footer.php
|   |   `-- header.php
|   |-- auth/
|   |   |-- login.php
|   |   `-- register.php
|   |-- user/
|   |   `-- my_tickets.php
|   `-- admin/
|       `-- all_tickets.php
|-- public/
|   |-- css/
|   |   `-- style.css
|   `-- index.php
`-- database.sql
```

## Setup
1. Import `database.sql` in phpMyAdmin.
2. Update DB credentials in `config/config.php` if needed.
3. Open:
   - `http://localhost/ticketManagement/public/index.php`

## Default Accounts
- Admin:
  - username: `admin`
  - password: `admin123`
- User:
  - username: `user`
  - password: `user123`

# Ticket-management-
# Ticket-management-
