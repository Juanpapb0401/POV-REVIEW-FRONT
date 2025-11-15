# Sistema de Autorización Basado en Roles - POV Review

##  Resumen de Implementación

Se ha implementado un sistema completo de autorización basado en roles para la aplicación POV Review, cumpliendo con los requisitos del taller.

---

##  Características Implementadas

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

##  Flujo de Autenticación y Autorización

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

##  Elementos de UI según Rol

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

## 🔑 Credenciales de Prueba

**Admin:**
- Email: `admin@example.com`
- Password: `admin123`

**Usuario:**
- Email: `alice@example.com`
- Password: `alice123`

---
