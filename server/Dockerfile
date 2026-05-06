# استخدام نسخة Node مستقرة
FROM node:20-alpine

# تحديد مجلد العمل داخل الحاوية
WORKDIR /app

# نسخ ملفات التعريف وتثبيت المكتبات
COPY package*.json ./
RUN npm install

# نسخ بقية كود السيرفر
COPY . .

# فتح المنفذ الذي يعمل عليه Express (مثلاً 5000)
EXPOSE 5000

# أمر التشغيل
CMD ["npm", "run", "dev"]