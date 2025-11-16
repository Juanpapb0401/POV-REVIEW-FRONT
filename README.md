
# 🎬 POV Review - Frontend

[![CI/CD Pipeline](https://github.com/Juanpapb0401/POV-REVIEW-FRONT/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/Juanpapb0401/POV-REVIEW-FRONT/actions/workflows/ci-cd.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com)

Plataforma web para descubrir, reseñar y compartir opiniones sobre películas. Proyecto desarrollado con Next.js 16, TypeScript, Zustand y Tailwind CSS.

## 🚀 Demo

- **Frontend:** [https://pov-review-front.onrender.com](https://pov-review-front.onrender.com) _(después del deploy)_
- **Backend API:** [https://pov-review.onrender.com/api](https://pov-review.onrender.com/api)

## ✨ Características

- 🔐 **Autenticación JWT** con roles (Admin/Usuario)
- 🎥 **CRUD de Películas** con géneros y detalles
- ⭐ **Sistema de Reseñas** con ratings y comentarios
- 👥 **Panel de Administración** para gestión de usuarios
- 📱 **Responsive Design** con Tailwind CSS
- 🎨 **Tema personalizado** (POV Theme)
- 🔄 **Estado Global** con Zustand + persistencia
- 📄 **Paginación** en listados
- ✅ **Validación de formularios**
- 🎭 **Tests E2E** con Playwright
-  **Tests Unitarios** con Jest
- 🚀 **CI/CD** con GitHub Actions + Render

## 🛠️ Tech Stack

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **State Management:** Zustand con persistencia
- **HTTP Client:** Axios
- **Testing:** Jest + Playwright
- **Linting:** ESLint
- **CI/CD:** GitHub Actions
- **Deployment:** Render

## 📋 Requisitos Previos

- Node.js 20.x o superior
- npm o yarn
- Git

## 🚀 Instalación y Desarrollo

### 1. Clonar el repositorio

```bash
git clone https://github.com/Juanpapb0401/POV-REVIEW-FRONT.git
cd POV-REVIEW-FRONT
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz:

```env
NEXT_PUBLIC_API_URL=https://pov-review.onrender.com/api
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

##  Testing

### Tests Unitarios (Jest)

```bash
# Ejecutar todos los tests
npm test

# Modo watch
npm run test:watch
```

### Tests E2E (Playwright)

```bash
# Ejecutar tests E2E
npm run test:e2e

# Modo UI interactivo
npm run test:e2e:ui
```

## 🏗️ Build

```bash
# Construir para producción
npm run build

# Ejecutar versión de producción
npm start
```

## 📂 Estructura del Proyecto

```
src/
├── app/
│   ├── components/      # Componentes reutilizables
│   │   ├── auth/       # Autenticación (ProtectedRoute, RoleGuard)
│   │   ├── layout/     # Layout (Navbar, Footer)
│   │   ├── movies/     # Componentes de películas
│   │   ├── reviews/    # Componentes de reseñas
│   │   └── ui/         # UI compartida (Modal, Pagination)
│   ├── dashboard/      # Panel de administración
│   ├── login/          # Página de inicio de sesión
│   ├── register/       # Página de registro
│   ├── movies/         # Páginas de películas
│   ├── my-reviews/     # Mis reseñas
│   ├── services/       # Servicios API
│   ├── store/          # Zustand stores
│   ├── hooks/          # Custom hooks
│   └── interfaces/     # TypeScript interfaces
├── e2e/                # Tests E2E (Playwright)
└── public/             # Assets estáticos
```

## 🚀 Despliegue

Este proyecto utiliza CI/CD con GitHub Actions y Render.

### Pipeline Automático

Cada push a `main` ejecuta:

1.  **Tests y Linting** - ESLint, Jest, Playwright
2. 🏗️ **Build** - Construcción de Next.js
3. 🚀 **Deploy** - Despliegue automático en Render

### Desplegar Manualmente

Ver la guía completa en [`DESPLIEGUE_RENDER.md`](./DESPLIEGUE_RENDER.md)

## 🎨 Tema de Colores

El proyecto usa una paleta personalizada (POV Theme):

```css
pov-primary: #1a2332    /* Azul oscuro - Fondo principal */
pov-secondary: #2d3748  /* Gris oscuro - Fondos secundarios */
pov-dark: #0f1419       /* Negro azulado - Navbar, footer */
pov-cream: #f5f5dc      /* Crema - Texto principal */
pov-gray: #9ca3af       /* Gris - Texto secundario */
pov-gold: #fbbf24       /* Dorado - Acentos, botones */
```

## 👥 Usuarios de Prueba

Para probar la aplicación:

```
Admin:
Email: admin@test.com
Password: Admin123

Usuario Normal:
Email: user@test.com
Password: User123
```

##  Documentación Adicional

- [`DESPLIEGUE_RENDER.md`](./DESPLIEGUE_RENDER.md) - Guía completa de despliegue
- [`SISTEMA_AUTORIZACION.md`](./SISTEMA_AUTORIZACION.md) - Sistema de roles y permisos
- [`info_base.md`](./info_base.md) - Documentación base del proyecto

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add: Amazing Feature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es parte de un taller académico de Computación en la Nube III.

## 👨‍💻 Autor

**Juan Pablo Parra**
- GitHub: [@Juanpapb0401](https://github.com/Juanpapb0401)

## 🔗 Links

- [Documentación Next.js](https://nextjs.org/docs)
- [Backend Repository](https://github.com/Juanpapb0401/POV-REVIEW-BACK) _(si existe)_
- [API Documentation](https://pov-review.onrender.com/api/docs)
