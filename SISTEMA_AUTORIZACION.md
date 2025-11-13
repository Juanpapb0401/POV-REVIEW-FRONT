# Sistema de Autorización Basado en Roles - POV Review

## 📋 Resumen de Implementación

Se ha implementado un sistema completo de autorización basado en roles para la aplicación POV Review, cumpliendo con los requisitos del taller.

---

## 🎯 Características Implementadas

### 1. **Sistema de Roles**
- **ADMIN**: Puede gestionar películas (crear, editar, eliminar) y ver usuarios
- **USER**: Puede escribir, editar y eliminar sus propias reseñas

### 2. **Componentes de Autorización Creados**

#### `useAuth` Hook (`src/app/hooks/useAuth.ts`)
Hook personalizado que proporciona:
- `isAuthenticated`: Estado de autenticación
- `isAdmin()`: Verifica si el usuario es administrador
- `isUser()`: Verifica si el usuario es usuario regular
- `canCreateMovie()`: Permiso para crear películas
- `canEditMovie()`: Permiso para editar películas
- `canDeleteMovie()`: Permiso para eliminar películas
- `canViewUsers()`: Permiso para ver lista de usuarios
- `canCreateReview()`: Permiso para crear reseñas
- `canEditReview(reviewUserId)`: Permiso para editar reseñas
- `canDeleteReview(reviewUserId)`: Permiso para eliminar reseñas

#### `RoleGuard` Componente (`src/app/components/auth/RoleGuard.tsx`)
Componente para mostrar/ocultar elementos de la interfaz según el rol:
```tsx
<RoleGuard allowedRoles={['admin']}>
  <button>Eliminar película</button>
</RoleGuard>
```

#### `ProtectedRoute` Componente (`src/app/components/auth/ProtectedRoute.tsx`)
Protege rutas completas requiriendo autenticación y roles específicos:
```tsx
<ProtectedRoute requiredRole="admin">
  <AdminDashboard />
</ProtectedRoute>
```

#### `Navbar` Componente (`src/app/components/layout/Navbar.tsx`)
Barra de navegación que muestra opciones según el rol del usuario:
- Usuarios no autenticados: Login y Registro
- Usuarios autenticados: Películas y Logout
- Administradores: Opción adicional de "Usuarios"

### 3. **Sistema de Reseñas**

#### Service de Reviews (`src/app/services/review/review.service.ts`)
Servicio completo para gestionar reseñas:
- `create()`: Crear reseña
- `getAll()`: Obtener todas las reseñas
- `getMovieReviews()`: Obtener reseñas de una película
- `getUserReviews()`: Obtener reseñas de un usuario
- `getById()`: Obtener reseña por ID
- `update()`: Actualizar reseña
- `delete()`: Eliminar reseña

#### `ReviewCard` Componente (`src/app/components/reviews/ReviewCard.tsx`)
Tarjeta que muestra una reseña con:
- Nombre del autor y fecha
- Calificación con estrellas (1-5)
- Comentario
- Botones de editar/eliminar (solo para el autor o admin)

#### `ReviewForm` Componente (`src/app/components/reviews/ReviewForm.tsx`)
Formulario para crear/editar reseñas con:
- Selector de estrellas interactivo
- Campo de comentario con validación
- Soporte para edición
- Validación (mínimo 10 caracteres)

### 4. **Páginas Actualizadas**

#### Página de Login (`src/app/login/page.tsx`)
- Redirige a `/movies` después del login exitoso (en lugar de dashboard)

#### Página de Películas (`src/app/movies/page.tsx`)
- Usa el nuevo `Navbar` component
- Botón "Agregar Película" solo visible para admins
- Botones de editar/eliminar en tarjetas solo para admins
- Integración con `RoleGuard` y `useAuth`

#### Página de Detalle de Película (`src/app/movies/[id]/page.tsx`)
- Sistema completo de reseñas integrado
- Los usuarios pueden:
  - Ver todas las reseñas de la película
  - Escribir UNA reseña por película
  - Editar/eliminar su propia reseña
- Los admins pueden:
  - Eliminar cualquier reseña
  - Editar/eliminar la película
- Botones de gestión solo visibles para admins

#### Dashboard de Administración (`src/app/dashboard/(main)/page.tsx`)
- Protegido con `ProtectedRoute` requiriendo rol admin
- Lista de usuarios con paginación
- Muestra nombre, email y roles
- Solo accesible para administradores

---

## 🔐 Flujo de Autenticación y Autorización

### 1. **Login**
```
Usuario inicia sesión 
  → Backend valida credenciales
  → Retorna token JWT + datos de usuario (incluye roles)
  → Se guarda en localStorage y Zustand store
  → Redirige a /movies
```

### 2. **Navegación**
```
Usuario navega a una página
  → useAuth verifica token en localStorage
  → Si no hay token → redirige a /login
  → Si hay token → verifica permisos del rol
  → Muestra/oculta elementos según permisos
```

### 3. **Acciones Protegidas**
```
Usuario intenta acción (ej: eliminar película)
  → useAuth verifica permiso (canDeleteMovie)
  → Si es admin → permite acción
  → Si es user → muestra mensaje de error
  → Backend valida nuevamente el token y rol
```

---

## 🎨 Elementos de UI según Rol

### **Usuario NO autenticado**
- ✅ Ver películas (listado y detalle)
- ✅ Ver reseñas
- ❌ Crear reseñas
- ❌ Gestionar películas
- ❌ Ver usuarios

### **Usuario autenticado (role: USER)**
- ✅ Ver películas
- ✅ Ver reseñas
- ✅ Crear UNA reseña por película
- ✅ Editar su propia reseña
- ✅ Eliminar su propia reseña
- ❌ Gestionar películas
- ❌ Ver usuarios
- ❌ Eliminar reseñas de otros

### **Administrador (role: ADMIN)**
- ✅ Todo lo de USER +
- ✅ Crear películas
- ✅ Editar películas
- ✅ Eliminar películas
- ✅ Ver lista de usuarios
- ✅ Eliminar cualquier reseña

---

## 📁 Estructura de Archivos Creados/Modificados

```
src/app/
├── hooks/
│   └── useAuth.ts                    [NUEVO] Hook de autorización
├── components/
│   ├── auth/
│   │   ├── RoleGuard.tsx            [NUEVO] Componente para roles
│   │   └── ProtectedRoute.tsx       [NUEVO] Protección de rutas
│   ├── layout/
│   │   └── Navbar.tsx               [NUEVO] Barra de navegación
│   └── reviews/
│       ├── ReviewCard.tsx           [NUEVO] Tarjeta de reseña
│       └── ReviewForm.tsx           [NUEVO] Formulario de reseña
├── services/
│   └── review/
│       └── review.service.ts        [NUEVO] Servicio de reseñas
├── login/
│   └── page.tsx                     [MODIFICADO] Redirige a /movies
├── movies/
│   ├── page.tsx                     [MODIFICADO] Con autorización
│   └── [id]/
│       └── page.tsx                 [MODIFICADO] Con reseñas
└── dashboard/
    └── (main)/
        └── page.tsx                 [MODIFICADO] Solo admin
```

---

## 🧪 Casos de Prueba

### Como Usuario Regular:
1. ✅ Iniciar sesión → Ver pantalla de películas
2. ✅ Ver películas → NO ver botones de admin
3. ✅ Entrar a detalle de película → Ver reseñas
4. ✅ Escribir una reseña → Aparece en la lista
5. ✅ Intentar escribir otra reseña → No permitido
6. ✅ Editar mi reseña → Funciona
7. ✅ Eliminar mi reseña → Funciona
8. ❌ Intentar acceder a /dashboard → Redirige a /movies
9. ❌ Ver botones de eliminar/editar películas → No visibles

### Como Administrador:
1. ✅ Iniciar sesión → Ver pantalla de películas
2. ✅ Ver botón "Agregar Película" → Visible
3. ✅ Ver botones de editar/eliminar en películas → Visibles
4. ✅ Acceder a /dashboard → Ver lista de usuarios
5. ✅ Escribir reseñas → Funciona igual que usuario
6. ✅ Eliminar reseña de otro usuario → Permitido
7. ✅ Crear nueva película → Funciona
8. ✅ Editar película → Funciona
9. ✅ Eliminar película → Funciona

---

## 🚀 Próximos Pasos Sugeridos

1. **Notificaciones**: Implementar sistema de toasts (react-toastify o sonner)
2. **Validación de formularios**: Usar react-hook-form + zod
3. **Paginación**: Implementar en lista de películas y reseñas
4. **Búsqueda**: Agregar filtros por género, director, etc.
5. **Perfil de usuario**: Página para ver/editar perfil
6. **Estadísticas**: Dashboard con métricas para admin
7. **Calificación promedio**: Mostrar rating promedio en películas
8. **Testing**: Agregar pruebas E2E para flujos de autorización

---

## 🔑 Credenciales de Prueba

**Admin:**
- Email: `admin@example.com`
- Password: `admin123`

**Usuario:**
- Email: `alice@example.com`
- Password: `alice123`

---

## ✅ Requisitos del Taller Cumplidos

- ✅ **Autenticación (10%)**: Sistema JWT implementado con login/logout
- ✅ **Autorización (10%)**: 2 roles (admin/user) con permisos diferenciados
- ✅ **Interfaz de usuario (15%)**: UI atractiva con componentes React
- ✅ **Gestión del estado (10%)**: Zustand para auth, hooks personalizados
- ✅ **Funcionalidades (20%)**: CRUD de películas y reseñas
- ⏳ **Informe (10%)**: Este documento + adicional detallado
- ⏳ **Despliegue (10%)**: Backend en Render, frontend pendiente
- ⏳ **Pruebas (15%)**: E2E de login/register, faltan más pruebas

---

## 📝 Notas Técnicas

- **Estado Global**: Zustand con persistencia en localStorage
- **Validación**: Backend valida todos los permisos
- **Seguridad**: Token JWT en header Authorization
- **UX**: Mensajes claros cuando no hay permisos
- **Responsive**: Diseño adaptable a móviles
- **Accesibilidad**: Uso de colores contrastantes y labels

---

**Desarrollado por:** Juan Pablo Parra
**Fecha:** Noviembre 2025
**Curso:** Computación en Internet III
