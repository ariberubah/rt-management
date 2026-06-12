# 🏘️ RT Management

A web-based neighborhood administration system designed to manage residents, houses, monthly community fees, and housing expenses.

Built with **Laravel 13 + React (Inertia.js) + MySQL**.

---

## ✨ Features

* **House Management** — Add/edit houses, assign residents, and track resident history for each house.
* **Resident Management** — Store complete resident information, including ID card photos, residency status (permanent/rental), and marital status.
* **Monthly Fee Billing** — Automatically generate monthly bills (security and cleaning fees) for all occupied houses, record payments, and support annual cleaning fee payments.
* **Expense Management** — Record monthly expenses by category (recurring/non-recurring) and upload supporting documents.
* **Dashboard** — View income vs. expense charts over a 12-month period and summary statistics.

---

## 🛠️ Tech Stack

| Layer           | Technology           |
| --------------- | -------------------- |
| Backend         | PHP 8.2+, Laravel 13 |
| Frontend        | React 19, Inertia.js |
| Styling         | Tailwind CSS v4      |
| Database        | MySQL 8              |
| Package Manager | Bun                  |
| Build Tool      | Vite                 |

---

## ⚙️ Requirements

Make sure the following software is installed on your machine:

* PHP **8.2** or later (with extensions: `curl`, `mbstring`, `openssl`, `fileinfo`, `pdo_mysql`, `zip`)
* Composer **2.x**
* Node.js / **Bun** (recommended)
* MySQL **8.x** (can be installed via XAMPP)
* Git

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/USERNAME/rt-management.git
cd rt-management
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Install JavaScript Dependencies

```bash
bun install
```

### 4. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Generate the application key:

```bash
php artisan key:generate
```

### 5. Configure the Database

Open the `.env` file and update the database settings:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=rt_management
DB_USERNAME=root
DB_PASSWORD=
```

Create the database in MySQL:

```sql
CREATE DATABASE rt_management;
```

### 6. Configure Community Fees

Adjust the fee amounts in `.env` if needed (default values are already provided):

```env
IURAN_SATPAM=100000
IURAN_KEBERSIHAN=15000
```

### 7. Run Database Migrations

```bash
php artisan migrate
```

### 8. Create Storage Symlink

```bash
php artisan storage:link
```

### 9. Start the Application

Open **two separate terminals**:

**Terminal 1 — Laravel:**

```bash
php artisan serve
```

**Terminal 2 — Vite (React):**

```bash
bun run dev
```

Open your browser and visit:

http://127.0.0.1:8000

---

## 📁 Important Directory Structure

```text
rt-management/
├── app/
│   ├── Http/
│   │   ├── Controllers/        # Laravel Controllers
│   │   └── Middleware/
│   │       └── HandleInertiaRequests.php
│   └── Models/                 # Eloquent Models
├── config/
│   └── iuran.php               # Community fee configuration
├── database/
│   └── migrations/             # Database migrations
├── resources/
│   ├── css/
│   │   └── app.css
│   ├── js/
│   │   ├── Components/
│   │   │   ├── Layout/
│   │   │   │   └── AppLayout.jsx
│   │   │   └── ui/             # UI Components (Button, Input, etc.)
│   │   ├── Pages/
│   │   │   ├── Dashboard/
│   │   │   ├── Houses/
│   │   │   ├── Residents/
│   │   │   ├── BillingPeriods/
│   │   │   ├── Expenses/
│   │   │   └── ExpenseCategories/
│   │   ├── lib/
│   │   │   └── utils.js
│   │   └── app.jsx
│   └── views/
│       └── app.blade.php
├── routes/
│   └── web.php
└── .env.example
```

---

## 🗄️ Database Structure (ERD)

| Table                | Description                              |
| -------------------- | ---------------------------------------- |
| `houses`             | House records                            |
| `residents`          | Resident records                         |
| `house_residents`    | House-resident relationships and history |
| `billing_periods`    | Billing periods (month/year)             |
| `billing_items`      | Bills per house and fee type             |
| `payments`           | Payment records                          |
| `expense_categories` | Expense categories                       |
| `expenses`           | Expense records                          |

---

## 📖 User Guide

### Initial Setup Flow

1. **Create Expense Categories** — `/expense-categories` → Add categories such as "Security Guard Salary", "Electricity Token", etc.
2. **Add Houses** — `/houses` → Enter all existing house numbers.
3. **Add Residents** — `/residents` → Enter resident information along with ID card photos.
4. **Assign Residents to Houses** — `/houses` → Open house details → Add Resident.

### Monthly Billing Flow

1. Go to `/billing-periods` → **Create Period** → Select month and year.
2. Open the billing period details → Click **Generate Bills** (automatically creates bills for all occupied houses).
3. Record payments individually using the **Pay** button, or use **Annual Cleaning Fee Payment** to pay one year of cleaning fees at once.

### Recording Expenses

Go to `/expenses` → **Add** → Fill in the category, amount, description, date, and supporting document (optional).

---

## 🔧 Additional Configuration

### Change Community Fee Amounts

Edit the `.env` file:

```env
IURAN_SATPAM=100000
IURAN_KEBERSIHAN=15000
```

Then run:

```bash
php artisan config:clear
```

### Production Build

```bash
bun run build
php artisan config:cache
php artisan route:cache
```

---

## 🐛 Troubleshooting

**Vite manifest not found**
→ Run `bun run dev` in a separate terminal.

**Unable to connect to MySQL**
→ Ensure MySQL is running (XAMPP Control Panel → Start MySQL).

**Missing PHP extension**
→ Open `php.ini` → Remove the `;` before the required extension → Restart the terminal.

**Uploaded photos are not displayed**
→ Run:

```bash
php artisan storage:link
```
