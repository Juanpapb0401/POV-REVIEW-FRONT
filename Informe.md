# INFORME TÉCNICO DETALLADO - POV REVIEW

## Información General del Proyecto

**Nombre:** POV Review  
**Descripción:** Aplicación web completa para la gestión y reseña de películas  
**Framework Principal:** Next.js 16.0.1 con App Router  
**Lenguaje:** TypeScript  
**Fecha del Informe:** Noviembre 2025

---

## ÍNDICE

1. [Tecnologías y Dependencias](#1-tecnologías-y-dependencias)
2. [Arquitectura General](#2-arquitectura-general)
3. [Funcionalidades Implementadas](#3-funcionalidades-implementadas)
4. [Autenticación y Autorización](#4-autenticación-y-autorización)
5. [Gestión de Estado](#5-gestión-de-estado)
6. [Servicios y APIs](#6-servicios-y-apis)
7. [Componentes y UI](#7-componentes-y-ui)
8. [Testing](#8-testing)
9. [Rutas y Navegación](#9-rutas-y-navegación)
10. [Seguridad](#10-seguridad)
11. [Consideraciones Técnicas](#11-consideraciones-técnicas)

---

## 1. TECNOLOGÍAS Y DEPENDENCIAS

### 1.1 Dependencias de Producción

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **Next.js** | 16.0.1 | Framework React con SSR/SSG y App Router |
| **React** | 19.2.0 | Biblioteca UI declarativa |
| **React DOM** | 19.2.0 | Renderizado de React en el navegador |
| **Zustand** | 5.0.8 | Gestión de estado global minimalista |
| **Axios** | 1.13.2 | Cliente HTTP para llamadas a APIs |
| **Tailwind CSS** | 4 | Framework CSS utility-first |

### 1.2 Dependencias de Desarrollo

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **TypeScript** | 5 | Tipado estático para JavaScript |
| **Jest** | 30.2.0 | Framework de testing unitario |
| **Playwright** | 1.56.1 | Testing E2E de navegador |
| **Testing Library** | 16.3.0 | Utilidades para testing de componentes React |
| **ESLint** | 9 | Linter para código JavaScript/TypeScript |

### 1.3 Características Técnicas

- **TypeScript** configurado con strict mode
- **App Router** de Next.js (no Pages Router)
- **Client Components** y **Server Components**
- **CSS Modules** y **Tailwind CSS**
- **API Interceptors** con Axios
- **Persistencia** con localStorage
- **Testing E2E** con Playwright
- **Testing Unitario** con Jest

---

## 2. ARQUITECTURA GENERAL

### 2.1 Estructura de Carpetas

```
POV-REVIEW-FRONT/
├── src/
│   ├── app/                        # App Router de Next.js
│   │   ├── components/            # Componentes reutilizables
│   │   │   ├── auth/             # Componentes de autenticación
│   │   │   ├── layout/           # Navbar, Footer, etc.
│   │   │   ├── movies/           # Componentes de películas
│   │   │   ├── reviews/          # Componentes de reseñas
│   │   │   └── ui/               # Componentes UI base
│   │   ├── dashboard/            # Panel de administración
│   │   ├── hooks/                # Custom hooks
│   │   ├── interfaces/           # Definiciones TypeScript
│   │   ├── login/                # Página de login
│   │   ├── movies/               # Páginas de películas
│   │   ├── register/             # Página de registro
│   │   ├── services/             # Lógica de negocio y APIs
│   │   └── store/                # Stores de Zustand
│   └── lib/                      # Utilidades y configuraciones
├── e2e/                          # Tests end-to-end
├── public/                       # Archivos estáticos
└── test-results/                 # Resultados de tests
```

### 2.2 Patrón de Arquitectura

El proyecto sigue una **arquitectura en capas** con separación clara de responsabilidades:

1. **Capa de Presentación** (Components/Pages)
   - Componentes React
   - Páginas de Next.js
   - UI/UX

2. **Capa de Lógica de Negocio** (Hooks/Services)
   - Custom hooks (`useAuth`)
   - Servicios de API
   - Validaciones

3. **Capa de Estado** (Zustand Stores)
   - Estado global
   - Persistencia
   - Sincronización

4. **Capa de Datos** (API Services)
   - Llamadas HTTP
   - Interceptors
   - Transformación de datos

---

## 3. FUNCIONALIDADES IMPLEMENTADAS

### 3.1 Autenticación de Usuarios

#### Registro de Usuarios
- **Ruta:** `/register`
- **Campos:**
  - Nombre completo (mínimo 3 caracteres)
  - Email (validación de formato)
  - Contraseña (mínimo 6 caracteres)
  - Confirmación de contraseña
- **Validaciones:**
  - Frontend: Validación en tiempo real
  - Backend: Validación adicional
  - Unicidad de email
- **Flujo:**
  1. Usuario completa formulario
  2. Se validan los datos
  3. Se envía POST a `/auth/register`
  4. Se recibe token JWT
  5. Se guarda en localStorage
  6. Se actualiza el store de Zustand
  7. Se redirige a `/dashboard`

#### Login de Usuarios
- **Ruta:** `/login`
- **Campos:**
  - Email
  - Contraseña
- **Credenciales de prueba:**
  - Admin: `admin@example.com` / `admin123`
  - Usuario: `alice@example.com` / `alice123`
- **Flujo:**
  1. Usuario ingresa credenciales
  2. Se envía POST a `/auth/login`
  3. Se recibe token JWT
  4. Se obtiene perfil del usuario
  5. Se guarda token y usuario en store
  6. Se redirige a `/movies`

#### Logout de Usuarios
- Elimina token de localStorage
- Limpia el estado global
- Redirige a la página principal

### 3.2 Gestión de Películas

#### Listar Películas
- **Ruta:** `/movies`
- **Acceso:** Público (no requiere autenticación)
- **Características:**
  - Grid responsive (1-3 columnas)
  - Paginación (6 películas por página)
  - Información mostrada:
    - Título
    - Director
    - Género
    - Fecha de estreno
    - Descripción
  - Acciones según rol

#### Ver Detalle de Película
- **Ruta:** `/movies/[id]`
- **Características:**
  - Información completa de la película
  - Lista de reviews asociadas
  - Formulario para crear/editar review
  - Estadísticas de ratings
  - Botones de acción según permisos

#### Crear Película (Solo Admin)
- **Ruta:** `/movies/create`
- **Acceso:** Requiere rol `admin`
- **Campos:**
  - Título
  - Descripción
  - Director
  - Género
  - Fecha de estreno
- **Validaciones:** Todos los campos requeridos

#### Editar Película (Solo Admin)
- **Ruta:** `/movies/edit/[id]`
- **Acceso:** Requiere rol `admin`
- **Características:**
  - Carga datos existentes
  - Validación de cambios
  - Actualización parcial permitida

#### Eliminar Película (Solo Admin)
- **Acceso:** Requiere rol `admin`
- **Características:**
  - Modal de confirmación
  - Elimina película y todas sus reviews
  - Feedback visual del resultado

### 3.3 Gestión de Reviews

#### Crear Review
- **Acceso:** Usuario autenticado
- **Campos:**
  - Rating (1-5 estrellas)
  - Comentario (texto libre)
- **Restricciones:**
  - Una review por usuario por película
  - Requiere autenticación

#### Editar Review
- **Acceso:** Propietario de la review
- **Características:**
  - Solo el creador puede editar
  - Formulario prellenado
  - Actualización en tiempo real

#### Eliminar Review
- **Acceso:** Propietario o Admin
- **Características:**
  - Usuario puede eliminar sus propias reviews
  - Admin puede eliminar cualquier review
  - Modal de confirmación

#### Ver Reviews
- **Ubicaciones:**
  - En detalle de película (`/movies/[id]`)
  - En perfil de usuario (`/my-reviews`)
- **Información mostrada:**
  - Nombre del usuario
  - Rating con estrellas
  - Comentario
  - Fecha de creación
  - Película asociada (en perfil)

### 3.4 Gestión de Usuarios (Solo Admin)

#### Dashboard de Usuarios
- **Ruta:** `/dashboard`
- **Acceso:** Solo rol `admin`
- **Características:**
  - Lista de todos los usuarios
  - Paginación (10 usuarios por página)
  - Información mostrada:
    - Nombre
    - Email
    - Roles
    - Estado (activo/inactivo)
    - Número de reviews
  - Acciones disponibles:
    - Ver perfil
    - Editar roles
    - Eliminar usuario

#### Eliminar Usuario
- **Restricciones:**
  - Admin no puede eliminarse a sí mismo
  - Modal de confirmación obligatorio
- **Efectos:**
  - Elimina usuario
  - Elimina todas sus reviews

#### Gestionar Roles
- **Roles disponibles:**
  - `user`: Usuario estándar
  - `admin`: Administrador
- **Características:**
  - Cambio de roles en tiempo real
  - Validación de permisos

### 3.5 Perfil de Usuario

#### Mis Reviews
- **Ruta:** `/my-reviews`
- **Acceso:** Usuario autenticado
- **Características:**
  - Lista de todas las reviews del usuario
  - Agrupadas por película
  - Acciones rápidas: editar, eliminar
  - Link a la película

---

## 4. AUTENTICACIÓN Y AUTORIZACIÓN

### 4.1 Sistema de Autenticación

#### Implementación JWT (JSON Web Tokens)

**Flujo de Autenticación:**

```
1. Login/Register
   ↓
2. Backend genera JWT
   ↓
3. Frontend recibe token
   ↓
4. Se guarda en localStorage
   ↓
5. Se adjunta en cada petición HTTP (Authorization: Bearer <token>)
   ↓
6. Backend valida token
   ↓
7. Backend responde con datos
```

#### authService.ts - Servicio de Autenticación

**Ubicación:** `src/app/services/auth/auth.service.ts`

**Métodos implementados:**

```typescript
// Login de usuario
login(email, password) → Promise<AuthResponse>
  - Envía POST a /auth/login
  - Guarda token en localStorage
  - Retorna { token, user }

// Registro de usuario
register(name, email, password) → Promise<AuthResponse>
  - Envía POST a /auth/register
  - Guarda token automáticamente
  - Retorna { token, user }

// Cerrar sesión
logout() → void
  - Elimina token de localStorage
  - Limpia estado

// Verificar autenticación
isAuthenticated() → boolean
  - Verifica si existe token

// Obtener token
getToken() → string | null
  - Retorna token actual

// Obtener perfil
getProfile() → Promise<User>
  - Obtiene datos del usuario actual
  - Envía GET a /users/profile
```

### 4.2 Sistema de Autorización (RBAC)

#### Roles Implementados

| Rol | Permisos |
|-----|----------|
| **user** | - Ver películas<br>- Crear reviews<br>- Editar sus propias reviews<br>- Eliminar sus propias reviews<br>- Ver su perfil |
| **admin** | - Todos los permisos de user<br>- Crear películas<br>- Editar películas<br>- Eliminar películas<br>- Ver todos los usuarios<br>- Eliminar usuarios<br>- Eliminar cualquier review<br>- Gestionar roles |

#### useAuth Hook - Lógica de Autorización

**Ubicación:** `src/app/hooks/useAuth.ts`

**Funciones principales:**

```typescript
// Verificar roles
hasRole(role: 'admin' | 'user') → boolean
isAdmin() → boolean
isUser() → boolean

// Permisos de películas
canCreateMovie() → boolean      // Solo admin
canEditMovie() → boolean        // Solo admin
canDeleteMovie() → boolean      // Solo admin

// Permisos de reviews
canCreateReview() → boolean     // Cualquier autenticado
canEditReview(userId) → boolean // Solo propietario
canDeleteReview(userId) → boolean // Propietario o admin

// Permisos de usuarios
canViewUsers() → boolean        // Solo admin
```

#### Componentes de Protección

##### 1. **RoleGuard** - Protección Condicional de UI

**Ubicación:** `src/app/components/auth/RoleGuard.tsx`

**Propósito:** Mostrar/ocultar elementos UI según roles

**Uso:**
```tsx
// Solo mostrar para admin
<RoleGuard allowedRoles={['admin']}>
  <button onClick={deleteMovie}>Eliminar</button>
</RoleGuard>

// Mostrar para admin o user
<RoleGuard allowedRoles={['admin', 'user']}>
  <CreateReviewForm />
</RoleGuard>
```

**Comportamiento:**
- Si el usuario no está autenticado → No muestra nada
- Si el usuario no tiene el rol → No muestra nada
- Si el usuario tiene el rol → Muestra el contenido

##### 2. **ProtectedRoute** - Protección de Rutas Completas

**Ubicación:** `src/app/components/auth/ProtectedRoute.tsx`

**Propósito:** Proteger páginas completas

**Uso:**
```tsx
// Proteger ruta para admin
<ProtectedRoute requiredRole="admin">
  <AdminDashboard />
</ProtectedRoute>

// Proteger para cualquier autenticado
<ProtectedRoute>
  <UserProfile />
</ProtectedRoute>
```

**Comportamiento:**
- Si no autenticado → Redirige a `/login`
- Si no tiene rol requerido → Redirige a `/movies`
- Si tiene permiso → Muestra contenido

### 4.3 Interceptor HTTP

**Ubicación:** `src/lib/api.ts`

#### Interceptor de Request

```typescript
authRequestInterceptor(config) {
  // 1. Obtiene token de localStorage
  const token = localStorage.getItem('authToken');
  
  // 2. Si existe token, lo adjunta al header
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // 3. Retorna config modificada
  return config;
}
```

**Beneficios:**
- Token automático en todas las peticiones
- No es necesario adjuntarlo manualmente
- Centralizado en un solo lugar

#### Interceptor de Response

```typescript
responseInterceptor(response) {
  // Si es exitoso, retorna respuesta
  return response;
}

errorInterceptor(error) {
  // Manejo de errores globales
  // Ej: Si 401, redirigir a login
  return Promise.reject(error);
}
```

### 4.4 Flujo Completo de Autenticación y Autorización

#### Ejemplo: Usuario Admin elimina una película

```
1. Usuario hace login
   ├─ POST /auth/login
   ├─ Recibe JWT token
   └─ Token guardado en localStorage

2. Usuario navega a /movies
   ├─ Interceptor adjunta token en header
   ├─ GET /movies
   └─ Backend valida token

3. Usuario ve botón "Eliminar"
   ├─ useAuth() verifica isAdmin()
   ├─ RoleGuard muestra botón solo si admin
   └─ Botón visible

4. Usuario hace click en "Eliminar"
   ├─ canDeleteMovie() verifica permisos
   ├─ Modal de confirmación
   └─ Usuario confirma

5. Se envía petición DELETE
   ├─ Interceptor adjunta token
   ├─ DELETE /movies/:id
   ├─ Backend valida token y rol
   ├─ Backend elimina película
   └─ Frontend actualiza UI
```

### 4.5 Seguridad de Tokens

#### Almacenamiento
- **localStorage** para persistencia
- Vulnerable a XSS (Cross-Site Scripting)
- Mitigado con políticas de seguridad de Next.js

#### Expiración
- No hay refresh tokens implementados
- Token debe ser renovado manualmente
- Mejora futura: Implementar refresh tokens

#### Validación
- Backend valida token en cada request
- Frontend verifica existencia del token
- Redirige a login si token inválido

---

## 5. GESTIÓN DE ESTADO

### 5.1 Zustand - Estado Global

**Zustand** es una biblioteca minimalista de gestión de estado para React.

**Ventajas sobre Redux:**
- Menos boilerplate
- API más simple
- No requiere Context Provider
- TypeScript nativo
- Middleware de persistencia integrado

### 5.2 Stores Implementados

#### 1. **Auth Store** - Autenticación

**Ubicación:** `src/app/store/auth/store/auth.store.ts`

**Estado:**
```typescript
{
  user: User | null,           // Usuario actual
  token: string | null,        // JWT token
  isAuthenticated: boolean     // Estado de autenticación
}
```

**Acciones:**
```typescript
// Login
login(email, password) → Promise<void>
  - Llama a authService.login()
  - Obtiene perfil del usuario
  - Actualiza estado con user y token
  - Persiste en localStorage

// Register
register(name, email, password) → Promise<void>
  - Llama a authService.register()
  - Actualiza estado con user y token
  - Persiste en localStorage

// Logout
logout() → void
  - Limpia localStorage
  - Resetea estado a valores iniciales

// Verificar autenticación
checkAuth() → void
  - Verifica si hay token en localStorage
  - Actualiza isAuthenticated

// Verificar admin
isAdmin() → boolean
  - Verifica si user tiene rol 'admin'
```

**Persistencia:**
```typescript
persist(
  storeImplementation,
  {
    name: 'auth-storage',  // Clave en localStorage
  }
)
```

**Uso en componentes:**
```tsx
const { user, login, logout, isAuthenticated } = useAuthStore();

// Login
await login(email, password);

// Logout
logout();

// Verificar autenticación
if (isAuthenticated) {
  // Usuario autenticado
}
```

#### 2. **Movie Store** - Películas

**Ubicación:** `src/app/store/movie/store/movie.store.ts`

**Estado:**
```typescript
{
  movies: Movies[],              // Lista de películas
  currentMovie: Movies | null    // Película seleccionada
}
```

**Acciones:**
```typescript
// Obtener todas las películas
getMovies() → Promise<void>
  - Llama a movieService.getAll()
  - Actualiza movies[]

// Obtener película por ID
getMovieById(id) → Promise<void>
  - Llama a movieService.getById(id)
  - Actualiza currentMovie

// Crear película
createMovie(data) → Promise<void>
  - Llama a movieService.create(data)
  - Agrega nueva película a movies[]

// Actualizar película
updateMovie(id, data) → Promise<void>
  - Llama a movieService.update(id, data)
  - Actualiza película en movies[]
  - Actualiza currentMovie si es la misma

// Eliminar película
deleteMovie(id) → Promise<void>
  - Llama a movieService.delete(id)
  - Elimina película de movies[]
  - Limpia currentMovie si es la misma

// Limpiar película actual
clearCurrentMovie() → void
  - Resetea currentMovie a null
```

**Uso en componentes:**
```tsx
const { movies, currentMovie, getMovies, createMovie } = useMovieStore();

// Cargar películas
useEffect(() => {
  getMovies();
}, []);

// Crear película
await createMovie({ title, description, ... });
```

#### 3. **User Store** - Usuarios

**Ubicación:** `src/app/store/user/store/user.store.ts`

**Estado:**
```typescript
{
  users: Users[]  // Lista de usuarios
}
```

**Acciones:**
```typescript
// Obtener usuarios con paginación
getUsers(limit, offset) → Promise<void>
  - Llama a userService.getAll(limit, offset)
  - Actualiza users[]
```

**Uso en componentes:**
```tsx
const { users, getUsers } = useUserStore();

// Cargar usuarios
await getUsers(10, 1);
```

### 5.3 Patrón de Uso de Stores

#### Ventajas del enfoque actual:

1. **Separación por dominio:**
   - Auth → Autenticación
   - Movie → Películas
   - User → Usuarios

2. **Estado mínimo:**
   - Solo datos esenciales en el store
   - Resto en estado local

3. **Persistencia selectiva:**
   - Solo auth se persiste
   - Movies y users son volátiles

4. **Tipado fuerte:**
   - Interfaces TypeScript en `/interfaces/type.ts`
   - Autocomplete en toda la app

#### Ejemplo completo de flujo con store:

```tsx
// Componente de login
function LoginPage() {
  // 1. Obtener acciones del store
  const { login } = useAuthStore();
  
  // 2. Estado local del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 3. Handler de submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // 4. Llamar acción del store
      await login(email, password);
      
      // 5. Store actualiza estado global
      // 6. Store persiste en localStorage
      
      // 7. Redirigir
      router.push('/movies');
    } catch (error) {
      // Manejar error
    }
  };
  
  return (/* JSX del formulario */);
}
```

---

## 6. SERVICIOS Y APIs

### 6.1 Configuración Base de API

#### Axios Instance

**Ubicación:** `src/lib/api.ts`

**Configuración:**
```typescript
const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});
```

**Variable de entorno:**
```env
NEXT_PUBLIC_BASE_URL=http://localhost:3001/api
```

### 6.2 API Service - Capa de Abstracción

**Ubicación:** `src/app/services/api.service.ts`

**Propósito:** Wrapper sobre Axios para simplificar llamadas HTTP

**Métodos:**
```typescript
// GET
get<T>(url, config?) → Promise<T>

// POST
post<T>(url, data, config?) → Promise<T>

// PUT
put<T>(url, data, config?) → Promise<T>

// PATCH
patch<T>(url, data, config?) → Promise<T>

// DELETE
delete(url, config?) → Promise<any>
```

**Ventajas:**
- Tipado genérico
- Retorna directamente `.data`
- Manejo de errores centralizado
- Fácil de mockear en tests

### 6.3 Servicios por Dominio

#### 1. Auth Service

**Ubicación:** `src/app/services/auth/auth.service.ts`

**Endpoints:**
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/login` | Login de usuario |
| POST | `/auth/register` | Registro de usuario |
| GET | `/users/profile` | Obtener perfil actual |

**Métodos:**
```typescript
// Login
login(email, password) → Promise<AuthResponse>

// Register
register(name, email, password) → Promise<AuthResponse>

// Logout (solo frontend)
logout() → void

// Verificar autenticación
isAuthenticated() → boolean

// Obtener token
getToken() → string | null

// Obtener perfil
getProfile() → Promise<User>
```

#### 2. Movie Service

**Ubicación:** `src/app/services/movie/movie.service.ts`

**Endpoints:**
| Método | Endpoint | Descripción | Requiere Auth | Rol |
|--------|----------|-------------|---------------|-----|
| GET | `/movies` | Listar todas | No | - |
| GET | `/movies/:id` | Obtener una | No | - |
| POST | `/movies` | Crear | Sí | admin |
| PATCH | `/movies/:id` | Actualizar | Sí | admin |
| DELETE | `/movies/:id` | Eliminar | Sí | admin |

**DTOs:**
```typescript
// Crear película
interface CreateMovieDto {
  title: string;
  description: string;
  director: string;
  releaseDate: string;
  genre: string;
}

// Actualizar película (campos opcionales)
interface UpdateMovieDto {
  title?: string;
  description?: string;
  director?: string;
  releaseDate?: string;
  genre?: string;
}
```

**Métodos:**
```typescript
// Listar
getAll() → Promise<Movies[]>

// Obtener por ID
getById(id) → Promise<Movies>

// Crear
create(data: CreateMovieDto) → Promise<Movies>

// Actualizar
update(id, data: UpdateMovieDto) → Promise<Movies>

// Eliminar
delete(id) → Promise<void>
```

#### 3. Review Service

**Ubicación:** `src/app/services/review/review.service.ts`

**Endpoints:**
| Método | Endpoint | Descripción | Requiere Auth |
|--------|----------|-------------|---------------|
| POST | `/reviews/movie/:movieId` | Crear review | Sí |
| GET | `/reviews` | Listar todas | No |
| GET | `/reviews/movie/:movieId` | Reviews de película | No |
| GET | `/reviews/user/:userId` | Reviews de usuario | No |
| GET | `/reviews/:id` | Obtener review | No |
| PATCH | `/reviews/:id` | Actualizar review | Sí |
| DELETE | `/reviews/:id` | Eliminar review | Sí |

**DTOs:**
```typescript
// Crear review
interface CreateReviewData {
  rating: number;      // 1-5
  comment: string;
  movieId: string;
}

// Actualizar review
interface UpdateReviewData {
  rating?: number;
  comment?: string;
}
```

**Métodos:**
```typescript
// Crear
create(data: CreateReviewData) → Promise<Review>

// Listar todas
getAll() → Promise<Review[]>

// Reviews de película
getMovieReviews(movieId) → Promise<Review[]>

// Reviews de usuario
getUserReviews(userId) → Promise<Review[]>

// Obtener por ID
getById(id) → Promise<Review>

// Actualizar
update(id, data: UpdateReviewData) → Promise<Review>

// Eliminar
delete(id) → Promise<void>
```

#### 4. User Service

**Ubicación:** `src/app/services/user/user.service.ts`

**Endpoints:**
| Método | Endpoint | Descripción | Requiere Auth | Rol |
|--------|----------|-------------|---------------|-----|
| GET | `/users` | Listar usuarios | Sí | admin |
| GET | `/users/:id` | Obtener usuario | Sí | admin |
| DELETE | `/users/:id` | Eliminar usuario | Sí | admin |
| PATCH | `/users/:id/roles` | Actualizar roles | Sí | admin |
| PATCH | `/users/:id` | Actualizar usuario | Sí | admin |

**Métodos:**
```typescript
// Listar con paginación
getAll(limit = 6, offset = 2) → Promise<Users[]>

// Obtener por ID
getById(id) → Promise<Users>

// Eliminar
delete(id) → Promise<void>

// Actualizar roles
updateRoles(id, roles: string[]) → Promise<Users>

// Actualizar datos
update(id, data: Partial<Users>) → Promise<Users>

// Usuario con reviews
getUserWithReviews(id) → Promise<Users>
```

### 6.4 Manejo de Errores

#### En Services:
```typescript
try {
  const response = await apiService.post('/endpoint', data);
  return response;
} catch (error) {
  // Error se propaga al componente
  throw error;
}
```

#### En Componentes:
```typescript
try {
  await movieService.create(movieData);
  // Éxito: mostrar mensaje, actualizar UI
} catch (error: any) {
  // Error: mostrar modal/alert
  console.error(error);
  setError(error.response?.data?.message || 'Error genérico');
}
```

### 6.5 Tipado de Respuestas

**Ubicación:** `src/app/interfaces/`

#### AuthResponse
```typescript
interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    roles: string[];
    isActive: boolean;
  };
}
```

#### Movies
```typescript
interface Movies {
  id: string;
  title: string;
  description: string;
  director: string;
  releaseDate: Date;
  genre: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Reviews
```typescript
interface Reviews {
  id: string;
  name: string;
  rating: number;
  comment: string;
  movie: Movie;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Users
```typescript
interface Users {
  id: string;
  name: string;
  email: string;
  roles: string[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}
```

---

## 7. COMPONENTES Y UI

### 7.1 Sistema de Diseño

#### Paleta de Colores (Tailwind CSS)

**Definición:** `COLORS.md`

| Color | Código | Uso |
|-------|--------|-----|
| `pov-dark` | #2d2d2d | Fondo de navbar |
| `pov-primary` | #3d3d3d | Fondo principal |
| `pov-secondary` | #4a4a4a | Cards y contenedores |
| `pov-gold` | #d4a574 | Botones y acentos |
| `pov-gold-dark` | #c9935a | Hover de botones |
| `pov-cream` | #f5f5f5 | Texto principal |
| `pov-gray` | #b8b8b8 | Texto secundario |

**Configuración en Tailwind:**
```css
bg-pov-gold
text-pov-cream
border-pov-gold/20  /* Opacidad 20% */
```

### 7.2 Componentes UI Base

**Ubicación:** `src/app/components/ui/`

#### 1. **Button**

**Props:**
```typescript
interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
}
```

**Variantes:**
- `primary`: Dorado (`bg-pov-gold`)
- `secondary`: Gris (`bg-pov-secondary`)
- `danger`: Rojo (`bg-red-600`)

**Características:**
- Estado de loading con spinner
- Deshabilitado automático cuando loading
- Ancho completo opcional
- Clases personalizadas

**Uso:**
```tsx
<Button onClick={handleSubmit} loading={isSubmitting}>
  Guardar
</Button>

<Button variant="danger" onClick={handleDelete}>
  Eliminar
</Button>
```

#### 2. **Input**

**Props:**
```typescript
interface InputProps {
  label?: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}
```

**Características:**
- Label automático
- Mensaje de error debajo
- Estilos según estado (normal/error)
- Accesibilidad (htmlFor, aria-invalid)

**Uso:**
```tsx
<Input
  label="Correo Electrónico"
  type="email"
  value={email}
  onChange={setEmail}
  error={errors.email}
  required
/>
```

#### 3. **Alert**

**Props:**
```typescript
interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}
```

**Características:**
- 4 tipos con colores distintos
- Icono según tipo
- Botón de cerrar opcional
- Auto-cierre con timeout

**Uso:**
```tsx
{error && (
  <Alert 
    type="error" 
    message={error} 
    onClose={() => setError('')}
  />
)}
```

#### 4. **Modal**

**Props:**
```typescript
interface ModalProps {
  isOpen: boolean;
  type: 'info' | 'warning' | 'error' | 'success' | 'confirm';
  title: string;
  message: string;
  onConfirm?: () => void;
  onClose: () => void;
  confirmText?: string;
  cancelText?: string;
}
```

**Características:**
- Overlay con backdrop
- Diferentes tipos (info, confirm, error)
- Botones personalizables
- Cierre con ESC
- Bloqueo de scroll del body

**Uso:**
```tsx
<Modal
  isOpen={modal.isOpen}
  type="confirm"
  title="Confirmar Eliminación"
  message="¿Estás seguro?"
  onConfirm={handleDelete}
  onClose={() => setModal({ ...modal, isOpen: false })}
/>
```

#### 5. **Pagination**

**Props:**
```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
```

**Características:**
- Botones anterior/siguiente
- Números de página
- Página actual resaltada
- Deshabilitado en límites

**Uso:**
```tsx
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
/>
```

### 7.3 Componentes de Dominio

#### 1. **MovieCard**

**Ubicación:** `src/app/components/movies/MovieCard.tsx`

**Props:**
```typescript
interface MovieCardProps {
  movie: Movies;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}
```

**Características:**
- Información de película
- Link a detalle
- Botones de editar/eliminar (opcional)
- Formato de fecha localizado
- Badge de género

**Uso:**
```tsx
<MovieCard
  movie={movie}
  onDelete={handleDelete}
  showActions={isAdmin()}
/>
```

#### 2. **MovieForm**

**Ubicación:** `src/app/components/movies/MovieForm.tsx`

**Props:**
```typescript
interface MovieFormProps {
  initialData?: Movies;
  onSubmit: (data: MovieData) => Promise<void>;
  submitText: string;
}
```

**Características:**
- Modo crear/editar
- Validaciones de formulario
- Manejo de errores
- Estado de loading
- Prellenado de datos

#### 3. **ReviewCard**

**Ubicación:** `src/app/components/reviews/ReviewCard.tsx`

**Props:**
```typescript
interface ReviewCardProps {
  review: Review;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}
```

**Características:**
- Estrellas visuales ()
- Información del usuario
- Fecha formateada
- Comentario
- Acciones según permisos
- Badge "Tu reseña"

**Uso:**
```tsx
<ReviewCard
  review={review}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

#### 4. **ReviewForm**

**Ubicación:** `src/app/components/reviews/ReviewForm.tsx`

**Props:**
```typescript
interface ReviewFormProps {
  onSubmit: (rating: number, comment: string) => Promise<void>;
  initialRating?: number;
  initialComment?: string;
  submitText: string;
}
```

**Características:**
- Selector de estrellas interactivo
- Textarea para comentario
- Validación de rating (1-5)
- Modo crear/editar

### 7.4 Componentes de Layout

#### 1. **Navbar**

**Ubicación:** `src/app/components/layout/Navbar.tsx`

**Características:**
- Logo y título de app
- Links de navegación
- Información de usuario
- Botón de logout
- Condicional según autenticación
- Badge de rol admin
- Sticky en top

**Links según estado:**
- No autenticado: Login, Registro
- Autenticado: Películas, Mis Reviews, Logout
- Admin: + Dashboard de Usuarios

**Uso:**
```tsx
<Navbar />
```

#### 2. **AuthLayout**

**Ubicación:** `src/app/components/auth/AuthLayout.tsx`

**Props:**
```typescript
interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}
```

**Características:**
- Layout centrado
- Fondo oscuro
- Card de contenido
- Título y subtítulo
- Footer personalizable
- Responsive

**Uso:**
```tsx
<AuthLayout
  title="POV Review"
  subtitle="Inicia sesión para continuar"
  footer={<Link to="/register">Crear cuenta</Link>}
>
  <LoginForm />
</AuthLayout>
```

### 7.5 Componentes de Autorización

#### 1. **RoleGuard**

**Ubicación:** `src/app/components/auth/RoleGuard.tsx`

**Props:**
```typescript
interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
}
```

**Uso:** Ver sección 4.2

#### 2. **ProtectedRoute**

**Ubicación:** `src/app/components/auth/ProtectedRoute.tsx`

**Props:**
```typescript
interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
  redirectTo?: string;
}
```

**Uso:** Ver sección 4.2

---

## 8. TESTING

### 8.1 Testing unitario (Jest)

- **Comando principal:** `bun run test`  
- **Suites / pruebas:** 23 suites · 95 tests ejecutados sin fallos.  
- **Herramientas:** Jest, Testing Library (render, screen, userEvent), mocks de Axios y `localStorage`, entorno `jsdom`.  
- **Áreas cubiertas:** servicios (`auth`, `movie`, `review`, `user`, `api`), stores de Zustand (`auth`, `movie`, `user`), hooks (`useAuth`), componentes UI (Button, Alert, Input, Modal, Pagination), formularios (MovieForm, ReviewForm) y componentes de layout/autenticación.

### 8.2 Testing end-to-end (Playwright)

- **Comando principal:** `bun run test:e2e`.  
- **Suites / pruebas:** 7 suites · 31 pruebas totales ejecutadas en Chromium (con mocks de API).  
- **Flujos validados:**  
  - **Login/Registro:** render, validaciones, navegación, login/admin happy path.  
  - **Dashboard:** listado, cambio de rol, eliminación de usuario y modal de confirmación.  
  - **Películas:** vista pública, estado vacío para admins, creación, navegación al detalle, paginación, edición y eliminación desde el listado.  
  - **Reviews:** creación desde película, edición, estado vacío con CTA.  
- **Reportes:** HTML disponible en `playwright-report/index.html` y cobertura textual en `.playwright-coverage/report.txt`.

### 8.3 Resumen de cobertura

#### Unit Tests (Jest)

| Métrica | Valor |
|---------|-------|
| Statements | **96.24 %** |
| Branches | **86.66 %** |
| Functions | **84.21 %** |
| Lines | **96.24 %** |

#### E2E (Playwright + instrumentación frontend)

| Métrica | Valor |
|---------|-------|
| Statements | **80.27 %** |
| Branches | **81.04 %** |
| Functions | **80.05 %** |
| Lines | **80.27 %** |

> La cobertura E2E se genera con `npm run test:e2e:coverage` (`--workers=1`) y se concentra en los módulos de `src/` y App Router. El HTML del run está en `playwright-report/`.

---

## 9. RUTAS Y NAVEGACIÓN

### 9.1 Estructura de Rutas (App Router)

```
/                           → Página principal (Landing)
├── /login                  → Login de usuario
├── /register               → Registro de usuario
├── /movies                 → Lista de películas (público)
│   ├── /movies/[id]        → Detalle de película
│   ├── /movies/create      → Crear película (admin)
│   └── /movies/edit/[id]   → Editar película (admin)
├── /my-reviews             → Reviews del usuario actual
└── /dashboard              → Dashboard admin
    └── /dashboard/(main)   → Lista de usuarios (admin)
```

### 9.2 Rutas Públicas

| Ruta | Descripción | Componente |
|------|-------------|------------|
| `/` | Landing page | `src/app/page.tsx` |
| `/login` | Formulario de login | `src/app/login/page.tsx` |
| `/register` | Formulario de registro | `src/app/register/page.tsx` |
| `/movies` | Lista de películas | `src/app/movies/page.tsx` |
| `/movies/[id]` | Detalle de película | `src/app/movies/[id]/page.tsx` |

### 9.3 Rutas Protegidas

#### Requieren Autenticación

| Ruta | Descripción | Protección |
|------|-------------|------------|
| `/my-reviews` | Reviews del usuario | Autenticado |

#### Requieren Rol Admin

| Ruta | Descripción | Protección |
|------|-------------|------------|
| `/movies/create` | Crear película | Admin |
| `/movies/edit/[id]` | Editar película | Admin |
| `/dashboard` | Dashboard admin | Admin |

### 9.4 Navegación con Next.js

#### useRouter Hook
```typescript
import { useRouter } from 'next/navigation';

const router = useRouter();

// Navegar
router.push('/movies');

// Navegar y recargar
router.push('/');
router.refresh();

// Volver atrás
router.back();
```

#### Link Component
```tsx
import Link from 'next/link';

// Link simple
<Link href="/movies">Ver películas</Link>

// Link con estilos
<Link 
  href="/login" 
  className="text-pov-gold hover:text-pov-gold-dark"
>
  Iniciar sesión
</Link>
```

### 9.5 Parámetros Dinámicos

#### Obtener parámetros de ruta
```typescript
import { useParams } from 'next/navigation';

const params = useParams();
const movieId = params.id as string;
```

#### Rutas dinámicas
```
/movies/[id]/page.tsx      → /movies/123
/movies/edit/[id]/page.tsx → /movies/edit/456
```

### 9.6 Redirecciones

#### Después de login exitoso:
```typescript
await login(email, password);
router.push('/movies');
```

#### Después de registro:
```typescript
await register(name, email, password);
router.push('/dashboard');
```

#### Si no autorizado:
```typescript
if (!isAuthenticated) {
  router.push('/login');
}

if (requiredRole && !hasRole(requiredRole)) {
  router.push('/movies');
}
```

---

## 10. SEGURIDAD

### 10.1 Medidas Implementadas

#### Autenticación JWT
- Token guardado en localStorage
- Token enviado en header Authorization
- Validación en backend

#### Autorización por Roles
- Verificación en frontend (RoleGuard, ProtectedRoute)
- Verificación en backend (guards)
- Diferentes permisos por rol

#### Validación de Datos
- Validación de formularios en frontend
- Validación adicional en backend
- Tipado con TypeScript

#### Protección de Rutas
- Rutas protegidas con ProtectedRoute
- Redirección automática si no autorizado
- Verificación de permisos