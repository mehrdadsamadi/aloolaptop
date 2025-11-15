# Fullstack Application (Next.js + NestJS)

این ریپازیتوری شامل دو بخش اصلی است:

-   **frontend/** → اپلیکیشن Next.js
-   **backend/** → API ساخته شده با NestJS

این ساختار به صورت Monorepo طراحی شده تا توسعه، دیپلوی و مدیریت پروژه
ساده‌تر شود.

## 📂 ساختار پروژه

    my-app/
    ├── frontend/
    ├── backend/
    ├── .gitignore
    └── README.md

## 🚀 نحوه اجرا

### 1. نصب پکیج‌ها

``` bash
cd frontend && npm install
cd ../backend && npm install
```

### 2. اجرای فرانت‌اند

``` bash
npm run dev
```

پورت پیش‌فرض: http://localhost:3000

### 3. اجرای بک‌اند

``` bash
npm run start:dev
```

پورت پیش‌فرض: http://localhost:4000

## 🔗 ارتباط فرانت و بک‌اند

``` ts
const res = await fetch("http://localhost:4000/api/users");
```

## 🧱 تکنولوژی‌ها

Next.js • React • NestJS • TypeScript • ESLint • Prettier

## 📜 License

MIT
