# 🎨 Guía de Colores - POV REVIEW

## Paleta de Colores Configurada

### 🌑 Colores de Fondo
```css
bg-pov-dark       → #2d2d2d (Negro Suave)
bg-pov-primary    → #3d3d3d (Gris Oscuro) - Fondo principal
bg-pov-secondary  → #4a4a4a (Gris Medio) - Cards y elementos
```

### ✨ Colores de Acento
```css
bg-pov-gold       → #d4a574 (Dorado Principal) - Botones y acentos
bg-pov-gold-dark  → #c9935a (Dorado Oscuro) - Hover de botones
```

### 📝 Colores de Texto
```css
text-pov-cream    → #f5f5f5 (Blanco Crema) - Texto principal
text-pov-gray     → #b8b8b8 (Gris Claro) - Texto secundario
```

## 🎯 Uso en Tailwind CSS

### Ejemplos de uso:

```tsx
// Fondo principal de la página
<div className="bg-pov-primary">

// Card con fondo secundario
<div className="bg-pov-secondary rounded-lg">

// Botón dorado con hover
<button className="bg-pov-gold hover:bg-pov-gold-dark text-pov-cream">

// Título principal
<h1 className="text-pov-cream text-3xl font-bold">

// Subtítulo o texto secundario
<p className="text-pov-gray">

// Bordes con color dorado
<div className="border border-pov-gold">

// Card completo ejemplo
<div className="bg-pov-secondary border border-pov-gold/20 rounded-lg p-6">
  <h2 className="text-pov-cream text-xl font-semibold mb-2">Título</h2>
  <p className="text-pov-gray">Descripción secundaria</p>
</div>
```

## 🔧 Variables CSS (opcional)

Si prefieres usar CSS variables directamente:

```css
background: var(--bg-primary);
color: var(--accent-gold);
border-color: var(--text-secondary);
```

## 📱 Componentes Comunes

### Botón Principal
```tsx
<button className="bg-pov-gold hover:bg-pov-gold-dark text-pov-cream font-semibold py-2 px-4 rounded-lg transition duration-200">
  Botón Principal
</button>
```

### Botón Secundario
```tsx
<button className="bg-pov-secondary hover:bg-pov-primary text-pov-cream font-semibold py-2 px-4 rounded-lg border border-pov-gold/30 transition duration-200">
  Botón Secundario
</button>
```

### Card
```tsx
<div className="bg-pov-secondary rounded-lg shadow-xl p-6">
  <h3 className="text-pov-cream text-lg font-semibold mb-3">Título</h3>
  <p className="text-pov-gray">Contenido de la card</p>
</div>
```

### Input de Formulario
```tsx
<input 
  className="w-full px-4 py-3 bg-pov-secondary border border-pov-gray/30 rounded-lg text-pov-cream placeholder-pov-gray focus:outline-none focus:ring-2 focus:ring-pov-gold focus:border-transparent transition"
  placeholder="Escribe aquí..."
/>
```

### Tabla
```tsx
<table className="w-full text-left">
  <thead className="bg-pov-secondary">
    <tr>
      <th className="px-6 py-4 text-pov-gray font-semibold">Columna</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-pov-secondary">
    <tr className="hover:bg-pov-secondary/50 transition">
      <td className="px-6 py-4 text-pov-cream">Dato</td>
    </tr>
  </tbody>
</table>
```

## 🎨 Combinaciones Recomendadas

### Layout Principal
- Fondo: `bg-pov-primary`
- Navbar: `bg-pov-dark`
- Cards: `bg-pov-secondary`

### Botones y Acciones
- Primario: `bg-pov-gold hover:bg-pov-gold-dark`
- Secundario: `bg-pov-secondary hover:bg-pov-dark`
- Peligro: `bg-red-600 hover:bg-red-700`

### Estados
- Activo/Seleccionado: `bg-pov-gold/20 border-pov-gold`
- Deshabilitado: `bg-pov-dark opacity-50`
- Éxito: `bg-green-600/10 text-green-400 border-green-500/20`
- Error: `bg-red-600/10 text-red-400 border-red-500/20`
- Advertencia: `bg-yellow-600/10 text-yellow-400 border-yellow-500/20`
