# Comandos útiles para Deploy

## 🔍 Verificación Pre-Deploy

```bash
# Verificar que todo esté listo
node verificar-deploy.js

# Ver archivos que serán incluidos en el deploy
git status

# Ver archivos ignorados
git status --ignored
```

## 📦 Git & GitHub

```bash
# Crear rama de deploy
git checkout -b deploy

# Agregar todos los cambios
git add .

# Commit con mensaje descriptivo
git commit -m "Configurado para deploy en Render"

# Push a GitHub
git push origin deploy

# O push a main
git push origin main
```

## 🧪 Testing Local

### Backend
```bash
cd back

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Probar en otra terminal
curl http://localhost:3000
curl http://localhost:3000/api/health
```

### Frontend
```bash
cd front

# Instalar dependencias
npm install

# Desarrollo
npm start
# Visitar http://localhost:4200

# Build de producción (para probar)
npm run build

# Servir el build (necesitas un servidor estático)
npx http-server dist/front/browser -p 8080
```

## 🔧 Solución de Problemas

### Limpiar y reinstalar dependencias

**Backend:**
```bash
cd back
rm -rf node_modules package-lock.json
npm install
```

**Frontend:**
```bash
cd front
rm -rf node_modules package-lock.json .angular
npm install
```

### Verificar versiones

```bash
node --version    # Debe ser v18 o superior
npm --version     # Debe ser v9 o superior
```

### Probar build de producción

```bash
# Frontend
cd front
npm run build

# Verificar que se creó la carpeta dist
ls -la dist/front/browser
```

## 📡 Probar API después del Deploy

```bash
# Health check
curl https://tu-backend.onrender.com/api/health

# Login (ajusta el body según tus datos)
curl -X POST https://tu-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@ejemplo.com","password":"test123"}'

# Obtener usuarios
curl https://tu-backend.onrender.com/api/usuarios
```

## 🔄 Actualizar Deploy

```bash
# Hacer cambios en el código
# ...

# Commit y push
git add .
git commit -m "Descripción de los cambios"
git push origin main

# Render hará auto-deploy automáticamente
# Puedes ver el progreso en el dashboard
```

## 📊 Monitoreo

### Ver logs en tiempo real

En Render Dashboard:
1. Ve a tu servicio
2. Click en "Logs"
3. Los logs se actualizan en tiempo real

### Desde terminal (usando Render CLI - opcional)

```bash
# Instalar Render CLI
npm install -g render-cli

# Login
render login

# Ver logs
render logs <service-id>
```

## 🗑️ Rollback

Si algo sale mal después del deploy:

1. Ve al servicio en Render Dashboard
2. Click en "Manual Deploy"
3. Selecciona un commit anterior
4. Click en "Deploy"

## 🔐 Actualizar Variables de Entorno

```bash
# En Render Dashboard:
# 1. Ve al servicio
# 2. Environment
# 3. Edita las variables
# 4. Save changes (se redespleará automáticamente)
```

## ⚡ Optimización

### Reducir tamaño del build del frontend

```bash
cd front

# Build con optimizaciones
npm run build

# Verificar tamaño
du -sh dist/front/browser
```

### Comprimir assets (opcional)

Angular ya hace esto automáticamente en production build.

## 🎯 Checklist Rápido

Antes de cada deploy:

```bash
# 1. Verificar tests (si existen)
npm test

# 2. Verificar build
npm run build

# 3. Commit y push
git add .
git commit -m "mensaje"
git push

# 4. Verificar en Render que el deploy inició
# 5. Esperar a que termine
# 6. Probar la aplicación
```

## 🆘 Comandos de Emergencia

### Servicio no responde

```bash
# Verificar estado del servicio
curl -I https://tu-servicio.onrender.com

# Forzar redeploy en Render Dashboard:
# Manual Deploy → Deploy latest commit
```

### Limpiar caché del navegador

```
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

### Ver requests en tiempo real (Frontend)

```
F12 → Network → Reload page
```

## 📚 Recursos Útiles

- Render Dashboard: https://dashboard.render.com
- Documentación de Render: https://render.com/docs
- Supabase Dashboard: https://supabase.com/dashboard
- Angular CLI: https://angular.io/cli
