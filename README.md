cat > README.md << 'EOF'
# Colegio SaaS — Portal Institucional

Sistema web tipo SaaS para gestión institucional de colegios.

Este proyecto permite administrar información académica, comunicados institucionales, pagos escolares, agenda, noticias educativas, reportes y un panel institucional moderno.

---

## Repositorio

```txt
https://github.com/aprend0/colegio-saas-portal-institucional
```

---

## Estructura del proyecto

```txt
colegio-saas-portal-institucional/
├── colegio-saas-main/
│   └── colegio-saas-main/        Backend NestJS + Prisma
│
├── colegio-saas1/
│   └── frontend/                 Frontend React + Vite
│
├── README.md
└── .gitignore
```

---

## Credenciales rápidas

### Super Administrador

```txt
Correo: superadmin@colegio.com
Contraseña: super123
```

### Administrador de Colegio

```txt
Correo: admin@colegio.com
Contraseña: admin123
```

---

## Requisitos para ejecutar

Antes de iniciar, tener instalado:

```txt
Node.js
npm
Git
PostgreSQL
```

Verificar instalación:

```bash
node -v
npm -v
git --version
```

---

## Paso 1: Clonar el proyecto

```bash
git clone https://github.com/aprend0/colegio-saas-portal-institucional.git
```

Entrar al proyecto:

```bash
cd colegio-saas-portal-institucional
```

---

## Paso 2: Ejecutar backend

Entrar a la carpeta del backend:

```bash
cd colegio-saas-main/colegio-saas-main
```

Instalar dependencias:

```bash
npm install
```

Crear archivo `.env` dentro de esta carpeta:

```env
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/colegio_saas?schema=public"
JWT_SECRET="colegio_saas_secret_2026"
PORT=3000
```

Generar Prisma Client:

```bash
npx prisma generate
```

Ejecutar migraciones:

```bash
npx prisma migrate dev
```

Levantar backend:

```bash
npm run start:dev
```

Backend local:

```txt
http://localhost:3000
```

---

## Paso 3: Ejecutar frontend

Abrir otra terminal.

Entrar al frontend:

```bash
cd colegio-saas1/frontend
```

Instalar dependencias:

```bash
npm install
```

Crear archivo `.env` dentro del frontend:

```env
VITE_API_URL="http://localhost:3000"
```

Levantar frontend:

```bash
npm run dev
```

Abrir en navegador:

```txt
http://localhost:5173/panel-warm
```

---

## Módulos principales

```txt
Panel institucional
Noticias educativas
Comunicados institucionales
Pagos escolares
Agenda escolar
Reportes ejecutivos
Gestión académica
Super administrador
Administrador de colegio
```

---

## Flujo recomendado para probar

1. Levantar el backend.
2. Levantar el frontend.
3. Abrir:

```txt
http://localhost:5173/panel-warm
```

4. Revisar el panel principal.
5. Revisar noticias educativas.
6. Revisar comunicados.
7. Revisar pagos.
8. Revisar agenda escolar.
9. Revisar reportes.

---

## Comandos útiles

### Backend

```bash
cd colegio-saas-main/colegio-saas-main
npm run start:dev
```

### Frontend

```bash
cd colegio-saas1/frontend
npm run dev
```

### Prisma

```bash
npx prisma generate
npx prisma migrate dev
npx prisma studio
```

---

## Rutas importantes

```txt
Frontend:
http://localhost:5173/panel-warm

Backend:
http://localhost:3000

Prisma Studio:
http://localhost:5555
```

---

## Archivos que no deben subirse

Este repositorio no debe subir:

```txt
node_modules
.env
dist
build
.vercel
logs
```

Eso ya está protegido en `.gitignore`.

---

## Notas para evaluación

Este sistema fue desarrollado como prototipo SaaS educativo para instituciones escolares.

El objetivo es centralizar la gestión institucional mediante una plataforma moderna, visual y fácil de utilizar.

Incluye módulos para administración, comunicación institucional, gestión académica, pagos escolares, agenda y reportes.

---

## Autor

```txt
Desarrollado por: Ander
GitHub: https://github.com/aprend0
Repositorio: https://github.com/aprend0/colegio-saas-portal-institucional
```
EOF

git add README.md
git commit -m "Agregar guia completa de ejecucion"
git push






