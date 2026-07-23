# Requirement Document — เว็บสะสมผลงาน (Portfolio Website)

> **Stack:** React (Frontend) · Node.js/Express (Backend, JavaScript) · PostgreSQL · Prisma ORM
> **Design Tone:** Clean & Elegant — โทนสีขาว/ครีม/ดำนุ่ม, พื้นที่ว่างเยอะ, ตัวอักษร Serif ผสม Sans-Serif, minimal animation

---

## 1. ภาพรวมโครงการ (Overview)

เว็บไซต์สะสมผลงานส่วนตัว (Personal Portfolio) สำหรับแสดงประวัติ, ทักษะ, ผลงาน (Projects), ประสบการณ์การทำงาน และช่องทางติดต่อ
เจ้าของเว็บสามารถเข้าสู่ระบบเพื่อเพิ่ม/แก้ไข/ลบข้อมูลผลงานได้ผ่าน Admin Dashboard

### 1.1 เป้าหมาย
- แสดงตัวตนและผลงานอย่างมืออาชีพ
- ให้ผู้เยี่ยมชม (recruiter / client) เข้าถึงข้อมูลได้ง่าย รวดเร็ว
- เจ้าของสามารถอัปเดตข้อมูลได้เองโดยไม่ต้องแก้โค้ด

### 1.2 กลุ่มผู้ใช้
เว็บนี้มีผู้ใช้งานเพียง **คนเดียว** คือ **เจ้าของเว็บ (Owner)** สำหรับเก็บผลงานส่วนตัว
ผู้เยี่ยมชมภายนอกสามารถ "ดู" หน้าเว็บได้ แต่ไม่ถือเป็นผู้ใช้งานระบบ (ไม่มีบัญชี, ไม่มีการสมัครสมาชิก, ไม่มีฟอร์มติดต่อที่บันทึกลง DB)

| Role | สิทธิ์ |
|------|-------|
| Owner (ฉัน) | เข้าสู่ระบบเพียงคนเดียว, จัดการ Projects, Skills, Experience ทั้งหมด |

> ระบบไม่รองรับการสมัครสมาชิก (no sign-up) — บัญชี Owner ถูก seed เข้า database ครั้งเดียวตอน setup


---

## 2. Technology Stack

### 2.1 Frontend
- **React 18+** (JavaScript, ไม่ใช้ TypeScript)
- **Vite** — build tool
- **React Router v6** — routing
- **Tailwind CSS** — styling (เน้น utility-first, custom design tokens)
- **Framer Motion** — animation แบบ subtle
- **Axios** — HTTP client
- **React Hook Form + Zod** — form validation

### 2.2 Backend
- **Node.js + Express.js** (JavaScript)
- **Prisma ORM** — database access layer
- **PostgreSQL 15+** — relational database
- **JWT (jsonwebtoken)** — authentication
- **bcrypt** — password hashing
- **Multer + Cloudinary/S3** — image upload
- **CORS, Helmet, Morgan** — middleware

### 2.3 DevOps
- **Docker + docker-compose** — สำหรับ dev/prod environment
- **Vercel / Netlify** — deploy frontend
- **Railway / Render / Fly.io** — deploy backend + PostgreSQL

---

## 3. Design System (Clean + Elegant)

### 3.1 Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-primary` | `#FAFAF7` | Background หลัก (off-white) |
| `--bg-secondary` | `#F0EDE6` | Section แบ่ง (warm cream) |
| `--text-primary` | `#1A1A1A` | ตัวอักษรหลัก |
| `--text-muted` | `#6B6B6B` | ตัวอักษรรอง |
| `--accent` | `#8B7355` | สีเน้น (warm bronze) |
| `--border` | `#E5E1D8` | เส้นขอบบาง |

### 3.2 Typography
- **Heading:** `Cormorant Garamond` หรือ `Playfair Display` (Serif, elegant)
- **Body:** `Inter` หรือ `Karla` (Sans-Serif, readable)
- **Scale:** 14 / 16 / 18 / 24 / 32 / 48 / 72 px

### 3.3 Layout Principles
- Max content width: `1200px`
- Generous whitespace (padding อย่างน้อย 80px ระหว่าง section)
- Grid-based (12 columns)
- Responsive: mobile-first
- Animation: fade-in on scroll, ไม่ใช้ effect รุนแรง

---

## 4. Feature Requirements

### 4.1 Public Pages (ผู้เยี่ยมชมทั่วไปดูได้)
| Page | Path | รายละเอียด |
|------|------|-----------|
| Home | `/` | Hero (ชื่อ + tagline), Featured Projects (3-4), CTA |
| About | `/about` | ประวัติ, รูปภาพ, ทักษะ, ประสบการณ์ |
| Projects | `/projects` | ตารางผลงานทั้งหมด (filter by category/tech) |
| Project Detail | `/projects/:slug` | รายละเอียดผลงาน, gallery, tech stack, link |
| Contact | `/contact` | แสดง social links + email เจ้าของ (ไม่มีฟอร์ม) |

### 4.2 Owner Pages (เฉพาะเจ้าของ, ต้อง login)
| Page | Path | รายละเอียด |
|------|------|-----------|
| Login | `/admin/login` | JWT login (บัญชีเดียว) |
| Dashboard | `/admin` | สรุปจำนวนผลงาน / ทักษะ / ประสบการณ์ |
| Manage Projects | `/admin/projects` | CRUD ผลงาน + upload รูป |
| Manage Skills | `/admin/skills` | CRUD ทักษะ |
| Manage Experience | `/admin/experience` | CRUD ประสบการณ์ |


---

## 5. Database Schema (Prisma)

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Owner บัญชีเดียว — seed ครั้งเดียวตอน setup, ไม่มี register endpoint
model Owner {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // bcrypt hash
  name      String
  bio       String?  @db.Text
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}


model Project {
  id          String    @id @default(cuid())
  slug        String    @unique
  title       String
  summary     String
  description String    @db.Text
  coverImage  String
  images      String[]
  liveUrl     String?
  repoUrl     String?
  featured    Boolean   @default(false)
  category    String
  techStack   String[]
  startedAt   DateTime
  endedAt     DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Skill {
  id       String   @id @default(cuid())
  name     String
  category String   // e.g. Frontend, Backend, Tool
  level    Int      // 1-5
  icon     String?
  order    Int      @default(0)
}

model Experience {
  id          String    @id @default(cuid())
  company     String
  role        String
  description String    @db.Text
  startDate   DateTime
  endDate     DateTime?
  current     Boolean   @default(false)
  location    String?
}



```

---

## 6. API Endpoints

### 6.1 Auth (เจ้าของเท่านั้น — ไม่มี register)
- `POST /api/auth/login` — { email, password } → { token }
- `GET  /api/auth/me` — ตรวจ token

### 6.2 Projects
- `GET    /api/projects` — public, รองรับ `?featured=true&category=web`
- `GET    /api/projects/:slug` — public
- `POST   /api/projects` — owner only
- `PUT    /api/projects/:id` — owner only
- `DELETE /api/projects/:id` — owner only

### 6.3 Skills / Experience — CRUD pattern เดียวกัน (GET public, mutations = owner only)

### 6.4 Upload
- `POST /api/upload` — owner only, multipart/form-data → { url }


---

## 7. Project Structure

```
portfolio/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # UI components (Button, Card, Nav)
│   │   ├── pages/             # Route pages
│   │   ├── layouts/           # PublicLayout, AdminLayout
│   │   ├── hooks/             # useAuth, useProjects
│   │   ├── lib/               # axios instance, utils
│   │   ├── styles/            # tailwind config, globals.css
│   │   └── App.jsx
│   └── package.json
│
├── server/                    # Express backend
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.js
│   ├── src/
│   │   ├── routes/            # auth, projects, skills, ...
│   │   ├── controllers/
│   │   ├── middleware/        # auth, error handler
│   │   ├── lib/               # prisma client, jwt utils
│   │   └── index.js
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## 8. Non-Functional Requirements

- **Performance:** Lighthouse score ≥ 90 (Performance/Accessibility/SEO)
- **Responsive:** รองรับ 320px – 1920px
- **SEO:** Meta tags, OG tags, sitemap.xml, semantic HTML
- **Security:** bcrypt (rounds ≥ 10), JWT expiry 7 วัน, rate limit `/api/auth`, sanitize input
- **A11y:** WCAG 2.1 AA, keyboard navigation, alt text ทุกภาพ
- **Browser Support:** Chrome, Safari, Firefox, Edge (2 versions ล่าสุด)

---

## 9. Environment Variables

### Backend (`.env`)
```
DATABASE_URL="postgresql://user:pass@localhost:5432/portfolio"
JWT_SECRET="your-strong-secret"
JWT_EXPIRES_IN="7d"
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
PORT=4000
CLIENT_URL="http://localhost:5173"
```

### Frontend (`.env`)
```
VITE_API_URL="http://localhost:4000/api"
```

---

## 10. Milestones

| Phase | ระยะเวลา | ผลลัพธ์ |
|-------|---------|--------|
| 1. Setup & Design System | 3 วัน | Repo, Tailwind config, base components |
| 2. Database & API | 5 วัน | Prisma schema, migrations, CRUD APIs |
| 3. Public Pages | 5 วัน | Home, About, Projects, Contact |
| 4. Admin Dashboard | 4 วัน | Login, CRUD UI, image upload |
| 5. Polish & Deploy | 3 วัน | SEO, animation, deploy to production |

**รวม ~ 20 วันทำงาน**

---

## 11. Acceptance Criteria

- [ ] ผู้เยี่ยมชมเข้าดูผลงานได้ทุกหน้าโดยไม่ต้อง login
- [ ] เจ้าของ login ด้วยบัญชีเดียวได้ และ CRUD ข้อมูลได้ครบทุก entity
- [ ] ไม่มีหน้า register / ไม่มีการสร้างบัญชีใหม่ผ่าน UI หรือ API
- [ ] อัปโหลดรูปภาพผ่านหน้า Owner แล้วแสดงบนหน้า public ได้
- [ ] เว็บ responsive สวยงามทั้ง mobile และ desktop
- [ ] Lighthouse score ≥ 90 ทุกหมวด
- [ ] Deploy production ได้จริง (frontend + backend + DB)

