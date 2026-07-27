# Suvai OS

## Intelligent Smart Restaurant Management System

Suvai OS is a full-stack restaurant management platform designed to digitize restaurant operations by connecting customers, kitchen staff, and managers through a unified system.

The platform provides a digital customer ordering experience along with a management dashboard for managing orders, inventory, tables, staff, customers, analytics, and intelligent recommendations.

## Built For

**VibeAthon 6.0 (2K26)**
**Problem Statement: Smart Restaurant Management System**

---

# Team Name

**Codex**

---

# Tech Stack

* Next.js 14 (App Router)
* React 18
* Tailwind CSS
* Node.js
* Next.js API Routes
* Recharts
* In-memory JavaScript Store (Supabase-ready architecture)
* Google OAuth Authentication
* Resend API
* AI Recommendation Engine

---

# User Stories Completed

* Customers can browse a digital menu and view available dishes.
* Customers can add food items to cart and place orders.
* Customers can reserve tables through the reservation system.
* Customers can track their order status.
* Users can register and login using email/password authentication.
* Role-based authentication is implemented for customers and administrators.
* Restaurant managers can manage orders through a kitchen workflow.
* Managers can update menu items, prices, availability, and stock details.
* Managers can monitor inventory and low-stock alerts.
* Managers can manage restaurant tables and reservations.
* Managers can manage staff information.
* Managers can view customer information and restaurant analytics.
* AI-powered recommendations suggest dishes based on customer activity.

---

# AI Usage

Suvai OS uses an AI-based recommendation engine to enhance customer experience.

The recommendation system analyzes restaurant data such as:

* Customer order history
* Popular dishes
* Menu activity
* Customer preferences

Based on this information, the system provides personalized food recommendations.

Future enhancements include:

* AI-based demand forecasting
* Smart inventory prediction
* Sales trend analysis
* Advanced restaurant insights

---

# Hosted Application

Live Demo:

https://suvai-smart-restaurant.vercel.app

---

# Repository

GitHub Repository:

https://github.com/Nandhika115/suvai-smart-restaurant

---

# Key Features

## Customer Module

* Digital restaurant menu
* Food availability tracking
* Cart management
* Online ordering
* Table reservation
* Order tracking
* Customer authentication

## Restaurant Management Module

* Admin dashboard
* Order management
* Kitchen workflow tracking
* Menu management
* Inventory monitoring
* Low-stock alerts
* Table management
* Staff management
* Customer management
* Restaurant analytics dashboard

## Intelligent Features

* AI-based food recommendations
* Personalized menu suggestions
* Inventory insights
* Restaurant performance analytics

---

# How It Works

Suvai OS connects:

**Customer → Kitchen → Restaurant Manager**

Customers can browse the menu, place orders, and track order progress. The restaurant team can manage incoming orders, update menu availability, monitor inventory, and analyze operations through the admin dashboard.

The platform helps restaurants improve efficiency through digital workflows and intelligent decision-making.

---

# Project Impact

Suvai OS helps restaurants:

* Reduce manual order management
* Improve customer experience
* Digitize restaurant operations
* Manage inventory efficiently
* Track orders effectively
* Make data-driven decisions
* Improve overall operational efficiency

---

# Project Structure

```text
app/
 ├── Customer pages
 ├── Admin dashboard
 ├── API routes
 └── Authentication routes

components/
 └── Reusable UI components

lib/
 ├── Authentication logic
 ├── Session handling
 ├── Data store management
 └── Utility functions

public/
 └── Restaurant food images
```

---

# Deployment

The application is deployed using Vercel.

Deployment URL:

https://suvai-smart-restaurant.vercel.app

---

# Future Enhancements

* Real-time database integration using Supabase/PostgreSQL
* Advanced AI demand prediction
* Real-time kitchen synchronization
* Online payment integration
* Mobile application support
