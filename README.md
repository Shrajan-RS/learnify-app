# Learnify AI 📚🤖

### AI-powered study assistant for turning study material into summaries, flashcards, and interactive quizzes.

Learnify AI is a full-stack AI application that helps students transform their study material into personalized learning resources using **Google Gemini**.

Users can enter study material manually or upload PDF documents, then generate **AI summaries, flashcards, and interactive quizzes**. Generated resources are persisted in MongoDB, allowing users to revisit previous study sessions.

The project combines **React, Node.js, Express, MongoDB, Firebase Authentication, JWT, PDF.js, and Google Gemini** into a complete full-stack application.

---

## 🎥 Demo

> **Replace the placeholders below with your actual project screenshots and demo video/GIF before publishing.**

### Application Preview

![Learnify AI Dashboard](./docs/screenshots/dashboard.png)

### Product Demo

<!-- Replace this image with a GIF exported from your demo video -->

<!-- Recommended: 30–60 second GIF showing login → PDF upload → summary → flashcards → quiz -->

![Learnify AI Demo](./docs/demo/demo.gif)

**[▶️ Watch the full demo video](YOUR_DEMO_VIDEO_URL)**

---

## ✨ Features

### 🤖 AI Study Tools

* **AI Summarization** — Converts study material into concise, structured summaries.
* **AI Flashcards** — Generates question-and-answer cards based on important concepts.
* **Interactive Quizzes** — Generates multiple-choice quizzes with difficulty selection.
* **Quiz Scoring** — Tracks answers and calculates the final score.
* **Answer Explanations** — Explains the correct answer after quiz completion.
* **60-Second Timer** — Adds a timed challenge to each quiz question.

### 📄 PDF Support

* Upload PDF documents directly from the study interface.
* Preview PDFs before processing.
* Extract text from every page using PDF.js.
* Convert extracted content into AI-generated study resources.

### 🔐 Authentication

* Email/password registration and login.
* Password hashing with `bcryptjs`.
* Six-digit email verification OTP.
* OTP expiration and resend functionality.
* Google authentication using Firebase.
* JWT-based authentication.
* HTTP-only authentication cookies.
* Protected API routes.
* Authentication rate limiting.
* Logout functionality.

### 💾 Study History

Generated resources are persisted in MongoDB and associated with the authenticated user.

Users can revisit:

* Previous summaries
* Previous flashcards
* Previous quizzes

### 🎨 User Experience

* Responsive React interface.
* Dark/light theme support.
* Mobile navigation.
* Loading states.
* Toast notifications.
* Clipboard support.
* PDF preview.
* Auto-growing study-material input.
* Interactive quiz interface.

---

## 🛠️ Tech Stack

| Layer              | Technologies                                          |
| ------------------ | ----------------------------------------------------- |
| **Frontend**       | React 19, Vite, React Router                          |
| **Styling**        | Tailwind CSS                                          |
| **HTTP Client**    | Axios                                                 |
| **Authentication** | Firebase Authentication, JWT                          |
| **PDF Processing** | PDF.js                                                |
| **UI / UX**        | React Hot Toast, React Icons, React Spinners, GSAP    |
| **Backend**        | Node.js, Express 5                                    |
| **Database**       | MongoDB, Mongoose                                     |
| **AI**             | Google Gemini API, Gemini 2.5 Flash                   |
| **Security**       | bcryptjs, HTTP-only cookies, Express Rate Limit, CORS |
| **Email**          | Nodemailer                                            |

---

## 🏗️ Architecture

Learnify follows a layered client-server architecture.

```text
                         ┌──────────────────────┐
                         │      React App       │
                         │                      │
                         │  Authentication      │
                         │  Study Interface     │
                         │  Quiz Interface      │
                         │  Study History       │
                         └──────────┬───────────┘
                                    │
                               Axios / HTTP
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │    Express API       │
                         │                      │
                         │ Routes               │
                         │ Controllers          │
                         │ Middleware           │
                         │ Services             │
                         └───────┬───────┬──────┘
                                 │       │
                    ┌────────────┘       └─────────────┐
                    ▼                                  ▼
             ┌──────────────┐                  ┌──────────────┐
             │   MongoDB    │                  │  Gemini API  │
             │              │                  │              │
             │ Users        │                  │ Summaries    │
             │ Study Data   │                  │ Flashcards   │
             │ Preferences  │                  │ Quizzes      │
             └──────────────┘                  └──────────────┘
```

### Request Flow

```text
React
  │
  ▼
Axios Request
  │
  ▼
Authentication Middleware
  │
  ▼
Controller
  │
  ▼
Gemini Service
  │
  ▼
Generated Study Resource
  │
  ▼
MongoDB
  │
  ▼
API Response
  │
  ▼
React UI
```

---

## 🧠 AI Pipeline

Learnify keeps Gemini API communication on the backend so that API credentials are not exposed to the client.

### Summary

```text
Study Material
      ↓
Backend Prompt
      ↓
Gemini
      ↓
Generated Title + Key Points
      ↓
MongoDB
```

### Flashcards

```text
Study Material
      ↓
Gemini
      ↓
Question / Answer Pairs
      ↓
MongoDB
```

### Quiz

```text
Study Material + Difficulty
            ↓
          Gemini
            ↓
Question + 4 Options + Answer + Explanation
            ↓
          MongoDB
            ↓
       React Quiz UI
```

---

## 📄 PDF Processing

PDF processing currently happens on the client using **PDF.js**.

```text
PDF Upload
    ↓
PDF.js
    ↓
Extract text page-by-page
    ↓
Combine extracted text
    ↓
Send text to backend
    ↓
Gemini
    ↓
Generated study resource
```

This approach avoids requiring a separate PDF-processing backend service for the current implementation.

For very large documents, **PDF chunking and scalable document processing** are planned improvements.

---

## 🔐 Authentication Architecture

Learnify supports two authentication flows.

### Email / Password

```text
Signup
  ↓
Validate Input
  ↓
Hash Password
  ↓
Create User
  ↓
Generate OTP
  ↓
Send Verification Email
  ↓
JWT Authentication
  ↓
HTTP-only Cookie
  ↓
Protected Application
```

### Google Authentication

Google authentication is handled through Firebase Authentication.

The application then establishes the corresponding authenticated user/session for the backend.

> Backend verification of Firebase ID tokens is planned as part of production hardening.

---

## 💾 Data Model

### User

Stores:

* Name
* Email
* Hashed password
* Email verification status
* Verification OTP
* OTP expiration
* Role
* Theme preference
* Study session references
* Timestamps

### UserChat

Stores generated study sessions:

* User reference
* Study mode
* Quiz difficulty
* Study material title
* Original prompt
* AI-generated response
* Timestamps

Relationship:

```text
User
 │
 └── Study Sessions
       ├── Summary
       ├── Flashcards
       └── Quiz
```

---

## 🔌 API

Base API:

```text
/api/v1
```

### Authentication

| Method | Endpoint                   | Description          |
| ------ | -------------------------- | -------------------- |
| `POST` | `/auth/user/signup`        | Register user        |
| `POST` | `/auth/user/google-signup` | Register with Google |
| `POST` | `/auth/user/verify`        | Verify email OTP     |
| `POST` | `/auth/user/resend-otp`    | Resend OTP           |
| `POST` | `/auth/user/login`         | Login                |
| `POST` | `/auth/user/google-login`  | Login with Google    |
| `POST` | `/auth/user/logout`        | Logout               |

### Study

| Method | Endpoint                       | Description             |
| ------ | ------------------------------ | ----------------------- |
| `GET`  | `/user/get-current-user`       | Get authenticated user  |
| `POST` | `/user/summary`                | Generate summary        |
| `POST` | `/user/flashcard`              | Generate flashcards     |
| `POST` | `/user/quiz`                   | Generate quiz           |
| `GET`  | `/user/quiz/:id`               | Retrieve quiz           |
| `POST` | `/user/themeChange`            | Update theme            |
| `POST` | `/user/get-previous-summary`   | Get previous summaries  |
| `POST` | `/user/get-previous-flashcard` | Get previous flashcards |
| `POST` | `/user/get-previous-quiz`      | Get previous quizzes    |

---

## 📁 Project Structure

```text
learnify-app-main/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   │
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── docs/
│   ├── screenshots/
│   │   └── dashboard.png
│   └── demo/
│       └── demo.gif
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have:

* Node.js
* npm
* MongoDB
* Google Gemini API key
* Firebase project
* Gmail/App Password for email verification

### 1. Clone the repository

```bash
git clone <your-repository-url>

cd learnify-app-main
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`.

### 3. Configure backend environment variables

```env
PORT=7000

MONGO_URI=your_mongodb_connection_string
DB_NAME=your_database_name

JWT_SECRET=your_jwt_secret
JWT_TOKEN_EXPIRES=7d

SALT_ROUNDS=10

GOOGLE_GEMINI_API_KEY=your_gemini_api_key

EMAIL=your_email
APP_PASSWORD=your_email_app_password

NODE_ENV=development
```

### 4. Start the backend

```bash
npm run dev
```

Backend:

```text
http://localhost:7000
```

### 5. Install frontend dependencies

Open another terminal:

```bash
cd frontend
npm install
```

### 6. Configure Firebase

Create the required Vite environment variables:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
```

Add the remaining Firebase configuration required by your Firebase project.

### 7. Start the frontend

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## 🔒 Security

The application currently implements:

* `bcryptjs` password hashing.
* JWT authentication.
* HTTP-only cookies.
* `SameSite` cookie configuration.
* Protected API routes.
* Authentication rate limiting.
* OTP expiration.
* Environment-based secret management.
* Request body size limits.
* Centralized error handling.
* CORS configuration.

### Production Hardening

Before production deployment, the following improvements are planned:

* Backend verification of Firebase ID tokens.
* Structured validation of Gemini responses.
* Stronger request validation.
* Production-specific CORS configuration.
* Secure cookie configuration for HTTPS.
* Automated API and authentication tests.
* Structured logging and monitoring.

---

## 📌 Current Status

**Portfolio Project — Core Features Implemented**

### Implemented

* [x] Email/password authentication
* [x] Email verification
* [x] Google authentication
* [x] JWT authentication
* [x] AI summaries
* [x] AI flashcards
* [x] AI quizzes
* [x] Quiz scoring and timer
* [x] PDF text extraction
* [x] Persistent study history
* [x] Theme preferences
* [x] Protected API routes
* [x] Authentication rate limiting


---

## 🎯 What This Project Demonstrates

Learnify was built to explore how generative AI can be integrated into a real full-stack application rather than exposed as a simple AI interface.

The project demonstrates experience with:

* Full-stack application architecture
* REST API development
* Authentication and authorization
* Database modeling
* Generative AI integration
* PDF processing
* Stateful interactive UI development
* Persistent user data
* Security considerations
* Error handling
* Rate limiting
* Third-party service integration

---

## 👥 Team & Contributions

Learnify AI was developed as a **college mini-project by a student team**.

### Shrajan R.S. — Full-Stack Development & AI Integration

My primary contributions focused on the core technical implementation of the application, including:

* Designed the overall full-stack application architecture.
* Developed the React frontend and interactive study experience.
* Built the Node.js/Express backend and REST API layer.
* Implemented JWT authentication and protected API routes.
* Implemented email verification with OTP generation, expiration, and resend functionality.
* Integrated Firebase Authentication for Google sign-in.
* Designed MongoDB/Mongoose models and persistent study history.
* Integrated Google Gemini for AI-powered summaries, flashcards, and quizzes.
* Implemented PDF text extraction using PDF.js.
* Built the interactive quiz system, including difficulty selection, timer, scoring, and answer explanations.
* Implemented theme preferences and previous study-session retrieval.
* Added authentication rate limiting, HTTP-only cookies, and other security measures.

Other team members contributed to the project as part of the overall college project.

> The contribution list highlights the areas I was primarily responsible for during development.


This project is available under the license specified in the repository.
