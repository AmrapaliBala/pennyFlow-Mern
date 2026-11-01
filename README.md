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
- <a href="#production-deployment">Production Deployment</a>
- <a href="#security--optimization">Security & Optimization</a>
- <a href="#author--contact">Author & Contact</a>

---
<h2><a class="anchor" id="overview"></a>Overview</h2>

**PennyFlow** is a personal finance management web application built on the MERN stack (MongoDB, Express, React, Node.js). It simplifies personal budgeting by enabling users to track daily income and expenses with real-time balance calculations, structured transaction histories, and visual summary cards.

PennyFlow integrates **Google Gemini** (`gemini-3.5-flash-lite` default with `gemini-2.5-flash-lite` fallback handling) through the official `@google/genai` SDK to serve as an intelligent financial assistant. The backend compiles a verified, deterministic financial snapshot directly from the user's recorded database transactions—aggregating lifetime totals, month-over-month comparisons, and top expense categories—and passes it to Gemini with strict guardrails to produce grounded, plain-language financial guidance in INR.

---
<h2><a class="anchor" id="core-features"></a>Core Features</h2>

- **Authentication & Security:**
  - Standard email/password signup and login with `bcrypt` password hashing and format validation.
  - One-click Google Sign-In with `@react-oauth/google` and backend token verification using `google-auth-library`.
  - Secure stateless JWT authentication with `tokenVersion` revocation for immediate multi-device session invalidation upon password reset.
  - Multi-step Forgot Password workflow with 6-digit OTP verification delivered via SMTP (e.g. Brevo) and single-use, timed reset tokens.
- **Transaction & Budget Management:**
  - Record positive (income) and negative (expense) transactions.
  - Real-time balance, lifetime income, and lifetime expense computations.
  - Immediate transaction deletion with instant summary recalculation.
- **Intelligent Financial Assistant (PennyFlow AI):**
  - Powered by Google Gemini (`gemini-3.5-flash-lite`).
  - Automatically compiles up to 6 months of monthly totals and top 10 expense categories.
  - Zero-hallucination prompt guardrails that enforce data grounding, plain-language calculation explanations in INR, and privacy preservation.
  - Per-user rate limiting (10 queries / 15 minutes) to protect against abuse and API quota drain.
- **Responsive & Accessible UI:**
  - Modern dashboard design using React 19, Tailwind CSS v4, and Lucide React icons.
  - Clean component architecture (`SummaryCard`, `BalanceSummary`, `TransactionForm`, `TransactionList`, `InsightsAssistant`).
  - Screen-reader accessible forms, error alerts, and empty states.

---
<h2><a class="anchor" id="system-architecture"></a>System Architecture</h2>

```
┌─────────────────────────────────────────────────────────────┐
│                       React Frontend                        │
│       (Vite, Tailwind CSS, React Router, Lucide React)      │
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
     │   MongoDB Atlas   │  │  SMTP Relay │  │  Google Gemini   │
     │ Users, Transacts, │  │ (Nodemailer │  │  (@google/genai  │
     │  PasswordResets   │  │  OTP Mail)  │  │   AI Insights)   │
     └───────────────────┘  └─────────────┘  └──────────────────┘
```

---
<h2><a class="anchor" id="tools--technologies"></a>Tools & Technologies</h2>

### Frontend
- **Framework & Bundler:** React 19, Vite 8
- **Routing:** React Router v7 (`react-router-dom`)
- **Styling:** Tailwind CSS v4, `@tailwindcss/vite`
- **Icons:** Lucide React (`lucide-react`)
- **Authentication & HTTP:** Axios (`axios`), `@react-oauth/google`
- **Linting:** ESLint 10 with `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh`

### Backend
- **Runtime & Framework:** Node.js (ES Modules), Express 5
- **Database & ODM:** MongoDB, Mongoose 9
- **Authentication:** JSON Web Tokens (`jsonwebtoken`), `bcrypt`, `google-auth-library`
- **AI Integration:** `@google/genai` (Google GenAI SDK)
- **Email Service:** Nodemailer (`nodemailer`) via SMTP
- **Validation & Security:** `validator`, `express-rate-limit`, `cors`, `dotenv`

---
<h2><a class="anchor" id="project-structure"></a>Project Structure</h2>

```
pennyFlow_Mern/
│
├── docs/                               # Project documentation & reference prompts
│   └── ai-prompts/
│       └── DEVELOPMENT_PROMPTS.md      # Development prompt records
│
├── backend/                            # Node.js & Express REST API
│   ├── .env                            # Backend environment configuration
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js                       # Express app entry & server startup
│   │
│   ├── config/
│   │   └── mongodb.js                  # Mongoose MongoDB connection
│   │
│   ├── controllers/
│   │   ├── authController.js           # Signup, login, Google OAuth, OTP reset
│   │   ├── insightsController.js       # AI insights request handler & rate limiting
│   │   └── transactionController.js    # Transaction CRUD & dashboard summary logic
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
├── frontend/                           # React + Vite client application
│   ├── .env                            # Frontend environment variables
│   ├── .gitignore
│   ├── eslint.config.js                # ESLint flat configuration
│   ├── index.html                      # HTML template
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js                  # Vite configuration with Tailwind CSS plugin
│   │
│   ├── public/                         # Static assets
│   │   ├── favicon.svg                 # Application favicon
│   │   └── icons.svg                   # SVG icon assets
│   │
│   └── src/
│       ├── App.css                     # Component stylesheet
│       ├── App.jsx                     # Route definitions & layout wrapper
│       ├── index.css                   # Global styles & Tailwind imports
│       ├── main.jsx                    # Application entry root & GoogleOAuthProvider
│       │
│       ├── components/
│       │   ├── auth/
│       │   │   └── GoogleSignInButton.jsx # Google OAuth button component
│       │   └── dashboard/
│       │       ├── BalanceSummary.jsx  # Balance display and layout wrapper
│       │       ├── InsightsAssistant.jsx # AI financial query assistant component
│       │       ├── SummaryCard.jsx     # Reusable income/expense card
│       │       ├── TransactionForm.jsx # Add transaction inputs & validation
│       │       └── TransactionList.jsx # Responsive transaction list with delete
│       │
│       ├── layout/
│       │   ├── Footer.jsx              # Shared page footer
│       │   ├── Layout.jsx              # Main layout wrapper with route conditions
│       │   └── Navbar.jsx              # Top navigation bar with auth state handling
│       │
│       ├── pages/
│       │   ├── DashboardPage.jsx       # Main application dashboard
│       │   ├── ForgotPasswordPage.jsx  # 3-step OTP password recovery page
│       │   ├── LoginPage.jsx           # User sign-in page
│       │   ├── NotFoundPage.jsx        # 404 error page
│       │   └── RegisterPage.jsx        # Account registration page
│       │
│       ├── services/
│       │   ├── apiClient.js            # Axios client with JWT request interceptor
│       │   ├── authService.js          # Authentication API calls & token storage
│       │   ├── insightsService.js      # AI insights API service
│       │   └── transactionService.js   # Transaction CRUD API service
│       │
│       └── utils/
│           ├── calculations.js         # Calculation utility placeholder
│           ├── currency.js             # Currency formatting placeholder
│           └── validation.js           # Form validation placeholder
│
└── README.md                           # Project documentation
```

---
<h2><a class="anchor" id="api-reference"></a>API Reference</h2>

### 🏥 Health Check (`/api/health`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/health` | Check API server status | Public |

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user account (`name`, `email`, `password`) | Public |
| `POST` | `/api/auth/login` | Log in with email and password | Public |
| `POST` | `/api/auth/google` | Authenticate using Google OAuth token (`credential`) | Public (Rate Limited: 20 / 15m) |
| `POST` | `/api/auth/forgot-password/request` | Request a 6-digit password reset OTP via email | Public (Rate Limited: 5 / 15m) |
| `POST` | `/api/auth/forgot-password/verify` | Validate OTP and receive a single-use reset token | Public (Rate Limited: 5 / 15m) |
| `POST` | `/api/auth/forgot-password/reset` | Set new password with reset token | Public (Rate Limited: 5 / 15m) |

### 💳 Transactions (`/api/transactions`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/transactions` | Fetch all transactions for authenticated user | Private (Bearer JWT) |
| `POST` | `/api/transactions` | Create a transaction (`description`, `amount`) | Private (Bearer JWT) |
| `GET` | `/api/transactions/summary` | Fetch computed income, expense, balance totals | Private (Bearer JWT) |
| `DELETE` | `/api/transactions/:id` | Delete a specific transaction by ID | Private (Bearer JWT) |

### 🤖 AI Financial Insights (`/api/insights`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/insights` | Submit financial question to Gemini (`question`) | Private (Rate Limited: 10 / 15m) |

---
<h2><a class="anchor" id="environment-variables"></a>Environment Variables</h2>

### Backend (`backend/.env`)
Create a `.env` file in the `backend/` directory:

| Variable | Description | Example / Default |
|---|---|---|
| `PORT` | Port number the Express API server listens on | `5000` |
| `FRONTEND_URL` | Allowed origin for Cross-Origin Resource Sharing (CORS) | `http://localhost:5173` |
| `MONGODB_URI` | MongoDB connection string (local or MongoDB Atlas) | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key used to sign and verify JSON Web Tokens | Strong random string |
| `EMAIL_HOST` | SMTP server host address | `smtp-relay.brevo.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_SECURE` | Whether to use SSL/TLS directly | `false` |
| `EMAIL_USER` | SMTP authentication username / account | Provided by SMTP host |
| `EMAIL_PASSWORD` | SMTP authentication password or API key | Provided by SMTP host |
| `EMAIL_FROM` | Sender email address appearing on OTP reset emails | `noreply@yourdomain.com` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID for token verification | `...apps.googleusercontent.com` |
| `GEMINI_API_KEY` | Google AI Studio Gemini API key | Google AI API key |
| `GEMINI_MODEL` | Gemini model name | `gemini-3.5-flash-lite` |
| `GEMINI_TIMEOUT_MS` | Timeout for Gemini API calls in milliseconds | `15000` |

### Frontend (`frontend/.env`)
Create a `.env` file in the `frontend/` directory:

| Variable | Description | Example / Default |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL for the Express backend REST API | `http://localhost:5000/api` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID matching the backend | `...apps.googleusercontent.com` |

---
<h2><a class="anchor" id="how-to-run-this-project"></a>How to Run This Project</h2>

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB Atlas](https://www.mongodb.com/atlas) cluster or local MongoDB instance
- [Google Cloud Console](https://console.cloud.google.com/) OAuth 2.0 Client ID (for Google Sign-In)
- [Google AI Studio](https://aistudio.google.com/) API Key (for Gemini insights)
- SMTP account credentials (e.g., [Brevo](https://www.brevo.com/))

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/pennyFlow_Mern.git
cd pennyFlow_Mern
```

### 2. Setup and Run the Backend
```bash
cd backend
npm install
# Configure your backend/.env as documented above
npm run server
# Server will start on http://localhost:5000
```

### 3. Setup and Run the Frontend
```bash
# In a separate terminal
cd ../frontend
npm install
# Configure your frontend/.env as documented above
npm run dev
# Frontend will start on http://localhost:5173
```

---
<h2><a class="anchor" id="production-deployment"></a>Production Deployment</h2>

### Production Architecture
In production, the frontend and backend are deployed as decoupled services:
- **Frontend:** Built into optimized static HTML, CSS, and JS assets via `npm run build` and served via static hosting platforms (such as Vercel, Netlify, or Cloudflare Pages).
- **Backend:** Node.js Express process hosted on cloud platforms (such as Render, Railway, AWS ECS, or DigitalOcean App Platform).
- **Database:** Hosted on MongoDB Atlas with IP allowlisting and SSL enabled.
- **Reverse Proxy / CORS:** `FRONTEND_URL` on the backend must be set to the production frontend domain (e.g. `https://pennyflow.example.com`), and `VITE_API_BASE_URL` in the frontend build must point to the production API (e.g. `https://api.pennyflow.example.com/api`).

### Build Steps
```bash
# 1. Build frontend static bundle
cd frontend
npm install
npm run build
# Distributable static files are output to frontend/dist/

# 2. Run backend in production
cd ../backend
npm install --omit=dev
npm start
```

---
<h2><a class="anchor" id="security--optimization"></a>Security & Optimization</h2>

- **Token Versioning (`tokenVersion`):** Password updates increment the user's `tokenVersion`, instantly invalidating previous JWTs across all active client devices.
- **Auto-Expiring OTPs (MongoDB TTL):** Reset OTP documents automatically expire via MongoDB TTL index (`expiresAt`), leaving zero orphaned reset tokens in the database.
- **SHA-256 Hashing for Reset Tokens:** OTPs and reset tokens are hashed before storage in MongoDB to protect against database leak exposures.
- **Timing-Safe OTP Verification:** Verification uses `crypto.timingSafeEqual` to safeguard against timing side-channel attacks.
- **Rate Limiting:** Protects recovery endpoints (5 attempts / 15 min), Google Auth (20 attempts / 15 min), and Gemini insights (10 queries / 15 min per user).
- **Safe AI Prompts:** Transaction descriptions and aggregates are pre-processed and clamped to the top 10 expense categories and past 6 months to minimize prompt token overhead and eliminate hallucinations.

---
<h2><a class="anchor" id="author--contact"></a>Author & Contact</h2>

**Amrapali Bala**  
Full-Stack Developer  
📧 Email: amrapalibala51@gmail.com  
🔗 GitHub: [https://github.com/AmrapaliBala?tab=repositories](https://github.com/AmrapaliBala?tab=repositories)  
🔗 LinkedIn: [https://www.linkedin.com/in/amrapali-bala-546b78252/](https://www.linkedin.com/in/amrapali-bala-546b78252/)
