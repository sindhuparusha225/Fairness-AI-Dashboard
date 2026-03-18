# FairnessAI Research Management Platform

A full-stack web application for managing AI fairness research datasets, inspired by the paper:

> **"Towards Measuring Fairness in AI: The Casual Conversations Dataset"**
> Hazirbas et al. · IEEE TBIOM · Vol. 4, No. 3 · July 2022

---

## Features

- 🔐 Session-based authentication (register / login / logout)
- 📊 Dashboard with live Chart.js analytics (age, gender, skin tone, lighting)
- 🗄️ Full CRUD for datasets with file uploads (PDF + ZIP/CSV)
- 🔬 Fairness Evaluation module (bias metrics across all 4 dimensions)
- 👥 Admin researcher management with role control
- 👤 Profile settings with avatar upload & password change

---

## Quick Start

### 1. Clone / unzip the project

```bash
cd fairness-ai-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/fairness_ai_db?retryWrites=true&w=majority
SESSION_SECRET=your_super_secret_key_here
NODE_ENV=development
```

> **MongoDB Atlas Setup:**
> 1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
> 2. Create a free cluster
> 3. Add a database user
> 4. Whitelist your IP (or `0.0.0.0/0` for dev)
> 5. Get the connection string and paste into `MONGODB_URI`

### 4. Run locally

```bash
npm start
# or for development with auto-restart:
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| View Engine | EJS |
| Auth | express-session + connect-mongo |
| Password hashing | bcryptjs |
| File uploads | multer |
| Charts | Chart.js 4 (CDN) |
| Fonts | DM Serif Display + DM Mono + DM Sans |

---

## Project Structure

```
fairness-ai-app/
├── config/
│   ├── db.js                 # MongoDB connection
│   └── session.js            # Session config
├── controllers/
│   ├── authController.js     # Login/register/logout
│   ├── dashboardController.js# Dashboard analytics
│   ├── datasetController.js  # Full CRUD + evaluations
│   ├── userController.js     # Admin user management
│   └── profileController.js  # Profile & password
├── middleware/
│   ├── auth.js               # isAuthenticated guard
│   ├── role.js               # isAdmin / isResearcher guard
│   └── multer.js             # File upload config
├── models/
│   ├── User.js               # User schema + bcrypt
│   ├── Dataset.js            # Dataset schema
│   └── Evaluation.js         # Fairness metrics schema
├── routes/
│   ├── auth.js
│   ├── dashboard.js
│   ├── datasets.js
│   ├── users.js
│   └── profile.js
├── views/
│   ├── auth/
│   │   ├── login.ejs
│   │   └── register.ejs
│   ├── dashboard/index.ejs
│   ├── datasets/
│   │   ├── index.ejs
│   │   ├── create.ejs
│   │   ├── edit.ejs
│   │   ├── show.ejs
│   │   └── evaluation.ejs
│   ├── users/
│   │   ├── index.ejs
│   │   └── show.ejs
│   ├── profile/index.ejs
│   └── partials/
│       ├── head.ejs
│       ├── sidebar.ejs
│       ├── topnav.ejs
│       ├── flash.ejs
│       ├── layout_start.ejs
│       ├── layout_end.ejs
│       ├── 404.ejs
│       └── error.ejs
├── public/
│   ├── css/main.css
│   ├── js/main.js
│   └── uploads/
│       ├── papers/
│       ├── datasets/
│       └── avatars/
├── app.js
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

---

## GitHub Upload

```bash
git init
git add .
git commit -m "Initial commit: FairnessAI Research Platform"
git branch -M main
git remote add origin https://github.com/<your-username>/fairness-ai-app.git
git push -u origin main
```

---

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET/POST | `/auth/login` | Login |
| GET/POST | `/auth/register` | Register |
| POST | `/auth/logout` | Logout |
| GET | `/dashboard` | Analytics dashboard |
| GET | `/datasets` | List all datasets |
| GET/POST | `/datasets/new` | Upload new dataset |
| GET | `/datasets/:id` | View dataset |
| GET/PUT | `/datasets/:id/edit` | Edit dataset |
| DELETE | `/datasets/:id` | Delete dataset |
| GET/POST | `/datasets/:id/evaluations/new` | Fairness evaluation |
| GET | `/users` | Admin: all researchers |
| GET | `/users/:id` | Admin: researcher activity |
| PUT | `/users/:id/role` | Admin: change role |
| DELETE | `/users/:id` | Admin: deactivate |
| GET/PUT | `/profile` | Profile settings |
| PUT | `/profile/password` | Change password |

---

## Fairness Dimensions

Based on the Casual Conversations Dataset paper, the platform evaluates across:

| Dimension | Sub-groups |
|-----------|-----------|
| **Age** | 18–30, 31–45, 46–85 |
| **Gender** | Male, Female, Other |
| **Skin Tone** | Fitzpatrick Types I–VI |
| **Lighting** | Bright, Dark |

---

## License

MIT
