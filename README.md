# 💰 PennyFlow – Personal Finance & AI Insights Platform

_A full-stack MERN application for personal expense tracking, real-time balance analytics, secure authentication, and AI-powered financial intelligence using Google Gemini._

---

## 📌 Table of Contents
- <a href="#overview">Overview</a>
- <a href="#core-features">Core Features</a>
- <a href="#system-architecture">System Architecture</a>
- <a href="#tools--technologies">Tools & Technologies</a>
- <a href="#project-structure">Project Structure</a>
- <a href="#api-reference">API Reference</a>
- <a href="#environment-variables">Environment Variables</a>
- <a href="#how-to-run-this-project">How to Run This Project</a>
- <a href="#security--optimization">Security & Optimization</a>
- <a href="#author--contact">Author & Contact</a>

---
<h2><a class="anchor" id="overview"></a>Overview</h2>

**PennyFlow** is a modern personal finance management web application built on the MERN stack (MongoDB, Express, React, Node.js). It simplifies personal budgeting by enabling users to track daily income and expenses with automatic balance calculations, structured transaction histories, and visual summary cards.

PennyFlow integrates **Google Gemini 2.5/3.5 Flash Lite** through the `@google/genai` SDK to serve as an intelligent, context-aware financial advisor. It builds a verified financial snapshot directly from database transactions (aggregating lifetime totals, month-over-month shifts, and top expense categories) and passes it to Gemini with strict safety instructions to ensure completely grounded, hallucination-free financial advice in INR.

---
<h2><a class="anchor" id="core-features"></a>Core Features</h2>

- **Authentication & Security:**
  - Standard email/password signup and login with `bcrypt` salt hashing and email validation.
  - One-click Google Sign-In with `@react-oauth/google` and backend token verification using `google-auth-library`.
  - Secure JWT authentication with `tokenVersion` revocation support for full session control.
  - Multi-step Forgot Password workflow with cryptographically secure 6-digit OTP verification delivered via Brevo (Sendinblue) SMTP and single-use reset tokens.
- **Transaction & Budget Management:**
  - Record positive (income) and negative (expense) transactions.
  - Real-time balance, lifetime income, and lifetime expense computations.
  - Immediate transaction deletion with automatic balance recalculation.
- **Intelligent Financial Assistant (PennyFlow AI):**
  - Powered by Google Gemini (`gemini-3.5-flash-lite`).
  - Automatically compiles a 6-month transaction snapshot and top 10 expense categories.
  - Zero-hallucination prompt guardrails that enforce data grounding, plain-language calculation explanations in INR, and privacy preservation.
  - Per-user rate limiting (10 queries / 15 minutes) to protect against abuse and API quota drain.
- **Responsive & Accessible UI:**
  - Clean dashboard design using React 19, Tailwind CSS v4, and Lucide React icons.
  - Toast notification system with `react-toastify`.
  - Reusable component architecture (`SummaryCard`, `BalanceSummary`, `TransactionForm`, `TransactionList`, `InsightsAssistant`).

---
<h2><a class="anchor" id="system-architecture"></a>System Architecture</h2>

```
┌─────────────────────────────────────────────────────────────┐
│                       React Frontend                        │
│   (Vite, Tailwind CSS, React Router, React OAuth Google)    │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / REST (Axios Interceptors)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Express.js REST API                      │
│      (Rate Limiters, JWT Auth Middleware, Controllers)       │
└──────────────┬───────────────────┬───────────────────┬──────┘
               │                   │                   │
               ▼                   ▼                   ▼
     ┌───────────────────┐  ┌─────────────┐  ┌──────────────────┐
     │   MongoDB Atlas   │  │ Brevo SMTP  │  │  Google Gemini   │
     │ Users, Transacts, │  │ (Nodemailer │  │  (@google/genai  │
     │  PasswordResets   │  │  OTP Mail)  │  │   AI Insights)   │
     └───────────────────┘  └─────────────┘  └──────────────────┘
```

---
<h2><a class="anchor" id="tools--technologies"></a>Tools & Technologies</h2>

### Frontend
- **Core:** React 19, Vite 8, React Router v7
- **Styling:** Tailwind CSS v4, `@tailwindcss/vite`
- **Icons & UI:** Lucide React, React Toastify
- **Auth & HTTP:** Axios, `@react-oauth/google`

### Backend
- **Runtime:** Node.js (ES Modules), Express 5
- **Database & ODM:** MongoDB Atlas, Mongoose 9
- **Authentication:** JSON Web Tokens (`jsonwebtoken`), `bcrypt`, `google-auth-library`
- **AI Integration:** `@google/genai` (Gemini SDK)
- **Email Service:** Nodemailer, Brevo SMTP Relay
- **Validation & Security:** `validator`, `express-rate-limit`, `cors`, `dotenv`

---
<h2><a class="anchor" id="project-structure"></a>Project Structure</h2>

```
pennyFlow_Mern/
│
├── README.md                           # Project documentation
│
├── backend/                            # Express & Node.js backend
│   ├── .env                            # Backend environment configuration
│   ├── .gitignore
│   ├── package.json
│   ├── server.js                       # Express app entry & server startup
│   │
│   ├── config/
│   │   └── mongodb.js                  # Mongoose MongoDB connection
│   │
│   ├── controllers/
│   │   ├── authController.js           # Signup, login, Google auth, OTP reset
│   │   ├── insightsController.js       # AI insights request handler
│   │   └── transactionController.js    # CRUD & dashboard summary logic
│   │
│   ├── middleware/
│   │   └── authMiddleware.js           # JWT Bearer token protection & user attach
│   │
│   ├── models/
│   │   ├── PasswordReset.js            # OTP & reset token schema with TTL index
│   │   ├── Transaction.js              # User transactions schema
│   │   └── User.js                     # User account & credential schema
│   │
│   ├── routes/
│   │   ├── authRoutes.js               # /api/auth routes with rate limiting
│   │   ├── insightsRoutes.js           # /api/insights routes
│   │   └── transactionRoutes.js        # /api/transactions routes
│   │
│   └── services/
│       ├── emailService.js             # Nodemailer OTP email delivery
│       └── insightsService.js          # Financial snapshot builder & Gemini caller
│
└── frontend/                           # React + Vite frontend
    ├── .env                            # Frontend environment variables
    ├── .gitignore
    ├── eslint.config.js                # ESLint flat config
    ├── index.html                      # HTML template
    ├── package.json
    ├── vite.config.js                  # Vite configuration with Tailwind CSS plugin
    │
    ├── public/                         # Static assets (favicons, SVGs)
    │
    └── src/
        ├── App.jsx                     # Route definitions & layout wrapper
        ├── index.css                   # Global styles & Tailwind imports
        ├── main.jsx                    # Application root & GoogleOAuthProvider
        │
        ├── components/
        │   ├── auth/
        │   │   └── GoogleSignInButton.jsx
        │   └── dashboard/
        │       ├── BalanceSummary.jsx  # Balance display and layout
        │       ├── SummaryCard.jsx     # Extracted reusable income/expense card
        │       ├── TransactionForm.jsx # Add transaction inputs & validation
        │       ├── TransactionList.jsx # Responsive transaction list with delete
        │       └── InsightsAssistant.jsx # AI chat modal & insights query UI
        │
        ├── layout/
        │   ├── Footer.jsx
        │   ├── Layout.jsx
        │   └── Navbar.jsx
        │
        ├── pages/
        │   ├── DashboardPage.jsx       # Main application dashboard
        │   ├── ForgotPasswordPage.jsx  # 3-step OTP password recovery
        │   ├── LoginPage.jsx           # User sign-in
        │   ├── NotFoundPage.jsx        # 404 page
        │   └── RegisterPage.jsx        # Account registration
        │
        ├── services/
        │   ├── apiClient.js            # Axios client with JWT interceptor
        │   ├── authService.js          # Authentication API functions
        │   ├── insightsService.js      # Insights API function
        │   └── transactionService.js   # Transaction CRUD API functions
        │
        └── utils/
            ├── calculations.js
            ├── currency.js
            └── validation.js
```

---
<h2><a class="anchor" id="api-reference"></a>API Reference</h2>

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user account | Public |
| `POST` | `/api/auth/login` | Log in with email and password | Public |
| `POST` | `/api/auth/google` | Authenticate using Google OAuth token | Public (Rate Limited) |
| `POST` | `/api/auth/forgot-password/request` | Send a 6-digit password reset OTP | Public (Rate Limited) |
| `POST` | `/api/auth/forgot-password/verify` | Validate OTP and issue reset token | Public (Rate Limited) |
| `POST` | `/api/auth/forgot-password/reset` | Set new password with reset token | Public (Rate Limited) |

### 💳 Transactions (`/api/transactions`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/transactions` | Fetch all transactions for the user | Private (Bearer JWT) |
| `POST` | `/api/transactions` | Create a transaction (`description`, `amount`) | Private (Bearer JWT) |
| `GET` | `/api/transactions/summary` | Fetch computed income, expense, balance | Private (Bearer JWT) |
| `DELETE` | `/api/transactions/:id` | Delete a specific transaction | Private (Bearer JWT) |

### 🤖 AI Financial Insights (`/api/insights`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/insights` | Query Gemini for financial insights | Private (10 req / 15 min) |

---
<h2><a class="anchor" id="environment-variables"></a>Environment Variables</h2>

### Backend (`backend/.env`)
Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=5000
FRONTEND_URL=http://localhost:5173

# Authentication
JWT_SECRET=your_jwt_secret_key

# MongoDB Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/PennyFlowMERN

# Email (Brevo / SMTP)
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_smtp_user
EMAIL_PASSWORD=your_smtp_password
EMAIL_FROM=noreply@yourdomain.com

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.5-flash-lite
GEMINI_TIMEOUT_MS=15000
```

### Frontend (`frontend/.env`)
Create a `.env` file in the `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

---
<h2><a class="anchor" id="how-to-run-this-project"></a>How to Run This Project</h2>

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB Atlas](https://www.mongodb.com/atlas) database cluster or local MongoDB instance
- [Google Cloud Console](https://console.cloud.google.com/) OAuth Client ID (for Google Sign-In)
- [Google AI Studio](https://aistudio.google.com/) API Key (for Gemini insights)
- SMTP credentials (e.g., [Brevo](https://www.brevo.com/) for email delivery)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/pennyFlow_Mern.git
cd pennyFlow_Mern
```

### 2. Setup and Run the Backend
```bash
cd backend
npm install
# Configure your backend/.env as shown above
npm run server
# Server will start on http://localhost:5000
```

### 3. Setup and Run the Frontend
```bash
# In a separate terminal
cd ../frontend
npm install
# Configure your frontend/.env as shown above
npm run dev
# Frontend will start on http://localhost:5173
```

### 4. Build for Production
```bash
# Build frontend
cd frontend
npm run build

# Start backend in production
cd ../backend
npm start
```

---
<h2><a class="anchor" id="security--optimization"></a>Security & Optimization</h2>

- **Token Versioning (`tokenVersion`):** Passwords updates increment the user's `tokenVersion`, instantly invalidating previous JWTs across all active client devices.
- **Auto-Expiring OTPs (MongoDB TTL):** Reset OTP documents automatically expire via MongoDB TTL index (`expiresAt`), leaving zero orphaned reset tokens in the database.
- **SHA-256 Hashing for Reset Tokens:** OTPs and reset tokens are hashed before storage in MongoDB to protect against database leak exposures.
- **Rate Limiting:** Protects recovery endpoints (5 attempts / 15 min), Google Auth (20 attempts / 15 min), and Gemini insights (10 queries / 15 min per user).
- **Safe AI Prompts:** Transaction descriptions and aggregates are pre-processed and clamped to the top 10 expense categories and past 6 months to minimize prompt token overhead and eliminate hallucinations.

---
<h2><a class="anchor" id="author--contact"></a>Author & Contact</h2>

**Amrapali Bala**  
Full-Stack Developer  
📧 Email: amrapalibala51@gmail.com 
🔗 GitHub: [https://github.com/AmrapaliBala?tab=repositories](https://github.com/AmrapaliBala?tab=repositories)  
🔗 LinkedIn: [https://www.linkedin.com/in/amrapali-bala-546b78252/](https://www.linkedin.com/in/amrapali-bala-546b78252/)
