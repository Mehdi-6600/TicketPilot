# TicketPilot

پنل داخلی فروش و رزرو بلیت هواپیما برای یک کارمند.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Prisma + PostgreSQL (Neon)
- Tailwind CSS
- Vercel

## راه‌اندازی

### ۱) نصب

```bash
npm install
```

### ۲) Environment Variables

فایل `.env.local` در ریشه بساز:

```env
NEON_DATABASE_URL="postgresql://..."
SESSION_SECRET="حداقل ۳۲ کاراکتر تصادفی"
```

> در Production این‌ها در Vercel → Settings → Environment Variables تنظیم شوند.

### ۳) Database

```bash
npx prisma generate
npx prisma migrate deploy
```

### ۴) اجرا

```bash
npm run dev
```

بعد برو `http://localhost:3000`.

## ساختار

```
src/
  app/
    (panel)/        صفحات محافظت‌شده (today, customers, ...)
    api/            API Routes
    login/          صفحه ورود
  components/       کامپوننت‌های مشترک
  lib/              ابزارها (prisma, auth, date, ...)
  middleware.ts     محافظت از مسیرها
prisma/
  schema.prisma
  migrations/
```

## فیچرها

- ورود امن با Session (JWT + httpOnly Cookie)
- مدیریت مشتریان
- مدیریت سفر و مسافران
- رزرو و فروش (چند ارزی: تومان، ریال عمان، دلار)
- پیگیری‌ها
- ثبت سریع فعالیت
- گزارش روزانه رسمی (بدون AI)
- برنامه کاری روز
- آرشیو گزارش‌ها (۶ ماه)

## دستورات

```bash
npm run dev           # اجرا
npm run build         # Build
npm run start         # اجرای production
npm run typecheck     # بررسی TypeScript
```

## License

Private — Internal use only.
