

# 🩸 BloodBound Backend

The **BloodBound Backend** powers the BloodBound application — a platform designed to seamlessly connect **blood donors** and **requesters** while facilitating hospital verification, donation tracking, and notifications. It provides secure API endpoints for user management, blood matching, and notifications via the **MantaHQ SDK**.

---

## 🚀 Project Overview

BloodBound’s backend provides a RESTful API that:
- Handles authentication and authorization for different roles (`donor`, `requester`, `admin`).
- Stores and retrieves data securely using MantaHQ's encrypted data tables.
- Exposes endpoints for donor registration, blood requests, hospital confirmations, and notifications.
- Integrates with Swagger UI for clear API documentation.

The backend is built with **Next.js (App Router)**, using serverless API routes and MantaHQ SDK for database interactions.

---

## 🧰 Tech Stack

| Tool / Library | Purpose |
|----------------|----------|
| **Next.js 14+** | API routes & backend runtime |
| **TypeScript** | Static typing & maintainability |
| **MantaHQ SDK** | Secure data storage & API integration |
| **Swagger UI + swagger-jsdoc** | Interactive API documentation |
| **JWT** | User authentication & authorization |
| **Node.js** | Runtime environment |

---

## 🧩 Core Features

- **Authentication**
  - JWT-based signup/login using Manta Auth Service
  - Role-based access control
- **Donor Management**
  - Donor registration & verification
  - Donor availability updates
- **Requester Management**
  - Request blood from specific or matching donors
  - Track blood requests & statuses
- **Hospital Module**
  - Verify donor legitimacy and confirm donations
- **Notifications**
  - Email and in-app alerts for blood matches and hospital confirmations
- **Admin Dashboard**
  - View statistics for hospitals, donors, and requests

---

## 📂 Folder Structure

```
bloodbound-backend/
│
├── app/
│   ├── api/
│   │   ├── auth/                # Login, Signup APIs
│   │   ├── donors/              # Donor endpoints
│   │   ├── requesters/          # Requester endpoints
│   │   ├── profile/             # Profile management
│   │   ├── swagger.v1.json/     # Swagger configuration
│   │   └── ...more endpoints
│   │
│   ├── lib/
│   │   └── mantaClient.ts       # Configured MantaHQ SDK client
│
├── node_modules/
├── package.json
├── next.config.js
├── README.md
└── tsconfig.json
```

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/yourusername/bloodbound-backend.git
cd bloodbound-backend
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Create a `.env.local` file
```bash
MANTA_API_KEY=your_manta_api_key
MANTA_AUTH_BASE_URL=https://api.mantahq.com/api/workflow/your-username/your-project/authservice
JWT_SECRET=your_jwt_secret
```

### 4️⃣ Run the development server
```bash
npm run dev
```

Server runs by default at:  
👉 **http://localhost:5050**

---

## 🧾 API Documentation

Swagger UI is automatically generated for all routes with JSDoc comments.

### Access the docs:
👉 **http://localhost:5050/swagger**

#### Example API Endpoints:
| Endpoint | Method | Description |
|-----------|---------|-------------|
| `/api/auth/signup` | `POST` | Register a new user |
| `/api/auth/login` | `POST` | Login and receive a JWT |
| `/api/profile/update` | `POST` | Create or update user profile |
| `/api/donors` | `GET` | Fetch all donors |
| `/api/requesters` | `GET` | Fetch all blood requests |

---

## 🧠 Development Workflow

1. Create new APIs inside `/app/api/{feature}`.
2. Add Swagger JSDoc annotations for each route.
3. Use `manta` SDK for data CRUD operations:
   ```ts
   const response = await manta.fetchAllRecords({ table: "donors" });
   ```
4. Commit changes following the conventional commit style:
   ```
   feat: add donor matching endpoint
   fix: correct Manta field casing
   ```

---

## ☁️ Deployment

When ready to deploy:
1. Run build command:
   ```bash
   npm run build
   ```
2. Start the server:
   ```bash
   npm run start
   ```
3. Deploy to a platform like **Vercel**, **Render**, or **AWS Lambda**.

---

## 🤝 Contributing

Contributions are welcome!  
If you’d like to fix bugs or improve the project:

1. Fork this repo  
2. Create a feature branch  
3. Submit a Pull Request with detailed explanation  

---

## 📜 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute with proper credit.

---

## 🩸 Author

**Olajide Ojo**  
Backend Engineer / QA Engineer  
[LinkedIn](https://www.linkedin.com/in/olajideojo) • [GitHub](https://github.com/olajideojo)