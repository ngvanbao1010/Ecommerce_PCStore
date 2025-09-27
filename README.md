# E-commerce Computer Store

A modern e-commerce platform specializing in computer components. Built with React.js frontend and Django REST API backend, providing seamless shopping experience for customers and powerful management tools for admins.

## Features

### Customer Features
- Browse and search products with advanced filters
- Compare product specifications
- PC Builder tool for custom configurations
- Shopping cart and checkout system
- Order tracking and history
- User profile management

### Admin Features
- Product management (CRUD operations)
- Order management and status updates
- Sales analytics dashboard
- Category management

## Architecture

### Frontend
- **React 19** with **Vite**
- **Material-UI (MUI)**
- **React Router DOM**
- **TanStack Query**
- **Axios**

### Backend
- **Django 5.2.5**
- **Django REST Framework**
- **MySQL**
- **Token Authentication**

## 🚀 Setup Instructions

### Prerequisites
- **Node.js 16+**
- **Python 3.8+**
- **MySQL 8.0+**

### 1. Clone Repository
```bash
git clone https://github.com/ngvanbao1010/Ecommerce_PCStore.git
cd ecommerce
```

### 2. Backend Setup (Django API)

```bash
cd ecommerceapi

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Create MySQL database
mysql -u root -p
CREATE DATABASE ecommercedb;
EXIT;

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start server
python manage.py runserver
```

### 3. Frontend Setup (React App)

```bash
cd ecommerceweb

# Install dependencies
npm install

# Start development server
npm run dev
```
