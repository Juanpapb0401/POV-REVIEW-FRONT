# 🚀 Guía de Despliegue en Render con CI/CD

## 📋 Requisitos Previos

- ✅ Cuenta en [Render](https://render.com)
- ✅ Repositorio en GitHub (POV-REVIEW-FRONT)
- ✅ Backend desplegado en Render (https://pov-review.onrender.com)

---

## 🎯 Paso 1: Crear el Servicio Web en Render

### 1.1 Accede a Render Dashboard
- Ve a https://dashboard.render.com
- Haz clic en **"New +"** → **"Web Service"**

### 1.2 Conecta tu Repositorio
- Selecciona **"Build and deploy from a Git repository"**
- Conecta tu cuenta de GitHub si aún no lo has hecho
- Busca y selecciona: `Juanpapb0401/POV-REVIEW-FRONT`

### 1.3 Configura el Servicio

**Configuración Básica:**
```
Name: pov-review-front
Region: Oregon (US West)
Branch: main
Root Directory: (dejar vacío)
Runtime: Node
```

**Build & Deploy:**
```
Build Command: curl -fsSL https://bun.sh/install | bash && export BUN_INSTALL="$HOME/.bun" && export PATH="$BUN_INSTALL/bin:$PATH" && bun install && bun run build
Start Command: export BUN_INSTALL="$HOME/.bun" && export PATH="$BUN_INSTALL/bin:$PATH" && bun start
```

**Plan:**
```
Instance Type: Free
```

### 1.4 Variables de Entorno  

Añade estas variables en la sección **Environment**:

```
NODE_VERSION = 20.11.0
BUN_VERSION = latest
NEXT_PUBLIC_API_URL = https://pov-review.onrender.com/api
```

### 1.5 Crear el Servicio
- Haz clic en **"Create Web Service"**
- Espera 5-10 minutos mientras se despliega por primera vez

---

## 🔗 Paso 2: Obtener el Deploy Hook (para CI/CD)

### 2.1 Ir a Settings
- En tu servicio web recién creado, ve a **Settings**
- Busca la sección **"Deploy Hook"**

### 2.2 Copiar Deploy Hook URL
- Haz clic en **"Create Deploy Hook"**
- Copia la URL generada (algo como):
  ```
  https://api.render.com/deploy/srv-xxxxxxxxxxxxx?key=xxxxxxxxxxxxxx
  ```

---

## 🔐 Paso 3: Configurar GitHub Secrets

### 3.1 Ir a GitHub Repository Settings
- Ve a tu repositorio: https://github.com/Juanpapb0401/POV-REVIEW-FRONT
- Clic en **Settings** → **Secrets and variables** → **Actions**

### 3.2 Añadir Secrets
Haz clic en **"New repository secret"** y añade:

**Secret 1:**
```
Name: RENDER_DEPLOY_HOOK_URL
Value: [pega aquí la URL del Deploy Hook que copiaste]
```

**Secret 2:**
```
Name: NEXT_PUBLIC_API_URL
Value: https://pov-review.onrender.com/api
```

---

## ✅ Paso 4: Verificar el Pipeline

### 4.1 Hacer Push
Ahora haz commit y push de los archivos creados:

```bash
git add .
git commit -m "Add CI/CD pipeline with Bun and Render config"
git push origin main
```

### 4.2 Ver el Pipeline en Acción
- Ve a tu repositorio en GitHub
- Clic en la pestaña **"Actions"**
- Verás el workflow ejecutándose con 3 jobs:
  -  Tests y Linting (usando Bun)
  - 🏗️ Build Application (usando Bun)
  - 🚀 Deploy to Render

### 4.3 Verificar Despliegue
- Ve a tu dashboard de Render
- Verás un nuevo deploy iniciándose automáticamente
- Espera a que termine (5-10 min)
- Tu app estará disponible en: `https://pov-review-front.onrender.com`

---

## 🎬 Paso 5: Configurar Auto-Deploy (Opcional pero Recomendado)

En Render Settings:
- Busca **"Auto-Deploy"**
- Actívalo para la rama `main`
- Ahora cada push a main desplegará automáticamente

---

## 📊 ¿Cómo Funciona el Pipeline?

### Flujo Completo:

```
1. Developer hace git push
         ↓
2. GitHub Actions se activa
         ↓
3. Job: Tests y Linting
   - Instala Bun
   - Instala dependencias con Bun
   - Ejecuta ESLint
   - Corre tests unitarios (Jest con Bun)
   - Corre tests E2E (Playwright)
   ✅ Si pasa → Continúa
   ❌ Si falla → DETIENE el proceso
         ↓
4. Job: Build
   - Instala Bun
   - Construye la aplicación Next.js con Bun
   - Verifica que el build sea exitoso
   ✅ Si pasa → Continúa
   ❌ Si falla → DETIENE el proceso
         ↓
5. Job: Deploy
   - Llama al Deploy Hook de Render
   - Render instala Bun y despliega
   - Tu app se actualiza automáticamente
         ↓
6. ✅ Deploy Completo
```

---

## 🔧 Comandos Útiles

### Ver logs del pipeline:
```bash
# En GitHub → Actions → Selecciona el workflow
```

### Verificar build local antes de push:
```bash
bun run lint
bun test
bun run build
```

### Probar E2E localmente:
```bash
bun run test:e2e
```

---

## 🐛 Troubleshooting

### ❌ Build falla en Render

**Problema:** "Module not found" o errores de dependencias
```bash
# Solución: Limpiar cache en Render
Settings → Clear build cache & deploy
```

**Problema:** "Bun not found"
```bash
# Verifica que el buildCommand incluya la instalación de Bun:
curl -fsSL https://bun.sh/install | bash && export BUN_INSTALL="$HOME/.bun" && export PATH="$BUN_INSTALL/bin:$PATH" && bun install && bun run build
```

**Problema:** "Out of memory"
```
# Solución: Añade esta variable en Render
NODE_OPTIONS = --max_old_space_size=4096
```

### ❌ Tests fallan en GitHub Actions

**Problema:** Tests E2E fallan por timeout
```yaml
# Ya está configurado en el pipeline:
env:
  CI: true
```

### ❌ Deploy Hook no funciona

**Problema:** 404 o error al llamar webhook
```
1. Verifica que el secret esté bien configurado
2. Genera un nuevo Deploy Hook en Render
3. Actualiza el secret en GitHub
```

---

## 📈 Monitoreo

### Ver estado del despliegue:
- **Render Dashboard:** https://dashboard.render.com
- **GitHub Actions:** https://github.com/Juanpapb0401/POV-REVIEW-FRONT/actions

### Logs en tiempo real:
- En Render → Tu servicio → Logs
- Verás todo el proceso de build y deploy

---

## 🎉 ¡Listo!

Ahora tienes:
- ✅ Pipeline de CI/CD automatizado
- ✅ Tests ejecutándose en cada push
- ✅ Deploy automático a Render
- ✅ Sin intervención manual necesaria

### Tu workflow de desarrollo ahora es:

```bash
# 1. Haces cambios
code .

# 2. Commit y push
git add .
git commit -m "Feature: nueva funcionalidad"
git push

# 3. ¡GitHub y Render hacen todo lo demás! 🚀
# - Tests automáticos con Bun ⚡
# - Build automático con Bun ⚡
# - Deploy automático a Render 🚀
```

## ⚡ Ventajas de usar Bun

- **Velocidad:** Bun es hasta 3-4x más rápido que npm/yarn
- **Instalación:** `bun install` es significativamente más rápido
- **Ejecución:** Tests y builds más rápidos
- **Compatibilidad:** Funciona con todas las dependencias de npm
- **Sin configuración extra:** Drop-in replacement para npm

---

## 📞 URLs Importantes

- **Frontend:** https://pov-review-front.onrender.com (después del deploy)
- **Backend:** https://pov-review.onrender.com
- **GitHub Actions:** https://github.com/Juanpapb0401/POV-REVIEW-FRONT/actions
- **Render Dashboard:** https://dashboard.render.com

---

**Nota:** El primer deploy puede tardar 10-15 minutos. Los siguientes serán más rápidos (5-7 min).
