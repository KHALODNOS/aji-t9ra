# استخدام نسخة Node خفيفة
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# فتح المنفذ الخاص بـ Vite (غالباً 5173)
EXPOSE 5173

# أمر التشغيل
CMD ["npm", "run", "dev", "--", "--host"]