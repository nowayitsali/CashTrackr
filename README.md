# CashTrackr AI

CashTrackr AI is a full-stack personal finance web application for tracking expenses, organizing categories, and reviewing spending trends in a clean, modern dashboard. It includes authentication, dark/light mode, and AI-powered categorization to help users stay organized with less manual effort. ✨

This project was built as a portfolio piece to demonstrate full-stack development with React, TypeScript, Tailwind CSS, Node.js, Express, PostgreSQL, Prisma, and Google Generative AI. 🚀

## Demo

- 🎥 Video walkthrough: https://github.com/user-attachments/assets/e32960db-f7fd-4128-afa6-0cf446155911

## Key Features

- 🔐 User authentication with register and login flows
- 💸 Create, edit, and delete expenses
- 📊 Dashboard for viewing and managing spending data
- 🤖 AI-powered expense categorization
- 🗂️ Manual category editing and organization
- 🌙 Dark and light mode support
- 📱 Responsive, custom-designed fintech-style interface
- 🎨 Built from a Figma-based UI concept

## What Makes It Stand Out

- Full-stack architecture with a separate frontend and backend
- AI integration for smarter expense organization
- PostgreSQL + Prisma data modeling
- Secure authentication using JWT and bcrypt
- Clean UI built with reusable components and modern styling
- Strong portfolio value for demonstrating product thinking and implementation

## Tech Stack

### Frontend

- React with Vite
- TypeScript
- Tailwind CSS
- React Router

### Backend

- Node.js
- Express
- PostgreSQL
- Prisma ORM
- JWT authentication
- bcrypt password hashing
- CORS
- dotenv

### AI Integration

- Google Generative AI SDK

### Development Tools

- DBeaver
- ESLint
- Nodemon
- TypeScript

## Project Structure

- `src/` — frontend application code
- `src/pages/` — page-level views such as dashboard, login, register, and expense management
- `src/components/` — reusable UI components
- `server/` — backend API
- `server/routes/` — Express route handlers
- `server/prisma/` — Prisma schema and database layer

## Core Functionality

### Expense Management

- Add new expenses with amount, date, category, and note fields
- Edit or delete existing expenses
- View and organize expenses in a dashboard layout

### AI Categorization

- Suggests better category groupings based on existing expense data
- Helps reduce manual categorization work
- Supports previewing and applying suggested changes

### Authentication

- Register new users
- Log in securely
- Protect app data per user account

## Setup

### Prerequisites

- Node.js
- npm
- PostgreSQL

### Frontend

1. Install dependencies in the project root.
2. Start the Vite development server.

### Backend

1. Install dependencies in the `server` folder.
2. Configure your database connection.
3. Run Prisma generation or migrations if needed.
4. Start the backend server.

## Environment Variables

Create a `.env` file in the `server` folder with the following variables:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/cashtrackr
JWT_SECRET=Add your JWT_SECRET here
GEMINI_API_KEY=Add your GEMINI_API_KEY here
```

**Important:** Never commit sensitive credentials to version control. Use environment variables for:

- `GEMINI_API_KEY`: Get from [Google AI Studio](https://aistudio.google.com/apikey)
- `JWT_SECRET`: A secure random string for token signing
- `DATABASE_URL`: Your PostgreSQL connection string

## Project Status

The core application is complete, including authentication, expense management, dashboard display, theme switching, and AI categorization. The project is actively being refined and can be extended with additional analytics and finance features.

## Future Improvements

- Advanced analytics and financial insights
- Budget tracking and alerts
- Bank statement import
- Export features
- Smarter AI categorization rules
