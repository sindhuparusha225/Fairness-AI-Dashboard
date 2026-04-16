#AI Fairness Evaluation Dashboard
This project focuses on evaluating fairness in machine learning models by analyzing prediction bias across different groups.

A full-stack system designed to **analyze, quantify, and visualize bias in AI models across demographic dimensions**.

Inspired by *"Towards Measuring Fairness in AI: The Casual Conversations Dataset"*, this platform goes beyond dataset storage — it enables **structured fairness evaluation across age, gender, skin tone, and lighting conditions**, helping uncover hidden model biases.

---

## 🚀 Key Insight

Most ML systems optimize for **overall accuracy**, ignoring how performance varies across different groups.

This platform highlights that gap by:

* Breaking down model performance **per demographic segment**
* Exposing **false positive / false negative disparities**
* Visualizing fairness issues using aggregated analytics

👉 The goal: **Make bias visible, measurable, and actionable**

---

## ⚡ What Makes This Different

* Not just dataset storage — **fairness-focused evaluation system**
* Multi-dimensional bias tracking (**4 fairness axes**)
* Real-time analytics using **MongoDB aggregation + Chart.js**
* Structured evaluation pipeline aligned with research practices

---
<img width="1898" height="1027" alt="Screenshot 2026-03-18 142630" src="https://github.com/user-attachments/assets/4f78464b-7c1a-41f4-935c-2ccd43c1ac74" />

<img width="1915" height="1019" alt="Screenshot 2026-03-18 142700" src="https://github.com/user-attachments/assets/4fcc9816-86ef-43f8-a86f-f64cf9903919" />



## 🧠 What This Demonstrates

* Understanding of **AI fairness concepts**
* Ability to design **data-driven evaluation systems**
* Full-stack engineering (Node.js, MongoDB, EJS)
* Translating research ideas → working product


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

## 📊 Interpreting Fairness Results

This system highlights disparities across demographic groups, but interpretation is critical.

For example:
- A higher false positive rate for one group indicates potential bias
- Differences in accuracy across groups may signal unfair model behavior
- Trade-offs may exist between overall accuracy and fairness

This dashboard helps identify such disparities, but further mitigation strategies 
(e.g., reweighting, bias correction) are required to improve fairness.

---

## 📌 Example Insight

For instance, if a model shows:
- 85% accuracy for ages 18–30
- 60% accuracy for ages 46–85

This indicates a performance disparity, suggesting the model is less reliable for older individuals.

Such insights help identify bias patterns that are not visible from overall accuracy alone.

---

## ⚠️ Limitation

Currently, fairness metrics are manually entered and visualized.
Future improvements would include automated metric computation from real model predictions.

---

Future Work:
- Integrate fairness metrics like demographic parity and equalized odds
- Add bias mitigation techniques
- Support model comparison across fairness-performance trade-offs

---

## License

MIT
