# Dental Clinic Management System

A web-based Dental Clinic Management System developed as a university capstone project. The system helps manage dentists, patients, treatment services, appointments, treatment histories, invoices, and payments.

## 1. Project Repository

GitHub: https://github.com/the-sann/capstone-project

## 2. Prerequisites

Install the following software before running the project:

- **PHP** — a version compatible with the project's Laravel requirements
- **Composer** — PHP dependency manager
- **Node.js and npm** — frontend dependency management and asset compilation
- **Git** — to clone the repository

Verify the installations:

```bash
php -v
composer -V
node -v
npm -v
git --version
```

Ensure that PHP has the required SQLite extensions enabled, particularly `pdo_sqlite` and `sqlite3`.

## 3. Clone the Repository

Open a terminal and run:

```bash
git clone https://github.com/the-sann/capstone-project.git
cd capstone-project
```

## 4. Install Dependencies

Install the Laravel and PHP dependencies:

```bash
composer install
```

Install the frontend dependencies:

```bash
npm install
```

## 5. Configure the Environment

Copy the example environment file.

**Windows Command Prompt:**

```cmd
copy .env.example .env
```

**Linux or macOS:**

```bash
cp .env.example .env
```

Generate the application key:

```bash
php artisan key:generate
```

## 6. Set Up the SQLite Database

This project uses SQLite, so MySQL or MariaDB is not required.

### Step 1: Configure `.env`

Make sure your `.env` file contains:

```env
DB_CONNECTION=sqlite
```

Use the database path configured by the project. For the standard Laravel SQLite configuration, the default is usually `database/database.sqlite`.

### Step 2: Create the database file

If `database/database.sqlite` does not exist, create an empty file.

**Windows PowerShell:**

```powershell
if (!(Test-Path database/database.sqlite)) {
    New-Item -ItemType File -Path database/database.sqlite
}
```

**Linux or macOS:**

```bash
touch database/database.sqlite
```

### Step 3: Create the database tables

Run:

```bash
php artisan optimize:clear
php artisan migrate
```

Laravel will create the tables required by the application.

If the project provides seeders for initial data, run:

```bash
php artisan db:seed
```

Seeding is optional if the application can operate without predefined records.

**Warning:** Do not run `php artisan migrate:fresh --seed` if you want to preserve existing database data. This command drops existing tables before rebuilding them.

### Step 4: Create your own records

After starting the application, log in with an appropriate account if authentication is required. Use the available management pages to create your own dentist, patient, treatment service, appointment, and other records.

The database starts empty unless seeders create initial records.

## 7. Run the Application

Open two terminals in the project directory.

### Terminal 1: Start Laravel

```bash
php artisan serve
```

The backend will be available at:

http://127.0.0.1:8000

### Terminal 2: Start the frontend

```bash
npm run dev
```

Keep both terminals running during development.

Open the application in your browser:

**http://127.0.0.1:8000**

To build the frontend assets instead of running the Vite development server, use:

```bash
npm run build
```

## 8. Main Features

- Dentist management
- Patient management
- Treatment service management
- Appointment management
- Treatment case management and patient treatment history
- Invoice generation
- Payment recording and balance tracking
- User authentication and access control

## 9. Technology Stack

- **Backend:** Laravel
- **Frontend:** React and TypeScript
- **Integration:** Inertia.js
- **UI Components:** shadcn/ui
- **Styling:** Tailwind CSS
- **Build Tool:** Vite
- **Database:** SQLite
- **PHP Dependencies:** Composer
- **Frontend Dependencies:** npm

## 10. Troubleshooting

### SQLite database connection error

- Verify that `DB_CONNECTION=sqlite` is configured in `.env`.
- Ensure that `database/database.sqlite` exists.
- Ensure PHP's `pdo_sqlite` and `sqlite3` extensions are enabled.
- Check that the database file is writable by the application.

Clear cached configuration if you change `.env`:

```bash
php artisan optimize:clear
```

### Missing application key

Run:

```bash
php artisan key:generate
```

### Missing database tables

Run:

```bash
php artisan migrate
```

### Frontend assets are not loading

Run:

```bash
npm install
npm run dev
```

Alternatively, build the assets:

```bash
npm run build
```

### Uploaded images are not accessible

Run:

```bash
php artisan storage:link
```

## 11. Instructions for Project Evaluation

To run the project locally:

1. Clone the GitHub repository.
2. Install PHP dependencies with `composer install`.
3. Install frontend dependencies with `npm install`.
4. Create and configure the `.env` file.
5. Generate the application key.
6. Create the SQLite database file if it is not already included.
7. Run `php artisan migrate`.
8. Run any required database seeders.
9. Start Laravel using `php artisan serve`.
10. Start Vite using `npm run dev`.
11. Open http://127.0.0.1:8000 in a browser.

**Important:** Cloning a Git repository does not automatically install dependencies or guarantee that the database contains demonstration data. Follow the setup instructions above before using the system.

---

**Project:** Dental Clinic Management System  
**Purpose:** University Capstone Project  
**Repository:** https://github.com/the-sann/capstone-project
