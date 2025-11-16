# 🚀 Guía de Deploy - Sistema Checador

Esta guía te ayudará a desplegar el Sistema Checador en Render.

## 📋 Pre-requisitos

- [ ] Cuenta en [Render.com](https://render.com)
- [ ] Cuenta en [GitHub](https://github.com)
- [ ] Proyecto de Supabase activo
- [ ] Código en un repositorio de GitHub

## 🔙 Deploy del Backend

### Paso 1: Preparar el Repositorio

1. Asegúrate de que tu código esté en GitHub
2. Verifica que el archivo `back/render.yaml` exista
3. Confirma que `.env` esté en `.gitignore` (no subir credenciales)

### Paso 2: Crear Web Service en Render

1. Ve a [Render Dashboard](https://dashboard.render.com/)
2. Click en **"New +"** → **"Web Service"**
3. Conecta tu repositorio de GitHub
4. Configura el servicio:

```
Name:           checador-backend
Runtime:        Node
Region:         Oregon (o el más cercano)
Branch:         main
Root Directory: back
Build Command:  npm install
Start Command:  npm start
```

### Paso 3: Configurar Variables de Entorno

En la sección **Environment**, agrega:

```bash
NODE_ENV=production
PORT=10000
SUPABASE_URL=https://bqreiifjmrscrmbbacpi.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxcmVpaWZqbXJzY3JtYmJhY3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MzQ0ODgsImV4cCI6MjA3NDUxMDQ4OH0.6cx8-75Wm1Jb5T6MvhOnbv3mof7bykp2wvtTCHPJM_s
FRONTEND_URL=https://tu-app-frontend.onrender.com
```

> ⚠️ **Importante**: Actualiza `FRONTEND_URL` después de desplegar el frontend

### Paso 4: Desplegar

1. Click en **"Create Web Service"**
2. Espera a que termine el build (2-5 minutos)
3. Tu API estará disponible en: `https://checador-backend.onrender.com`

### Paso 5: Verificar el Deploy

Prueba el endpoint raíz:
```bash
curl https://checador-backend.onrender.com/
```

Deberías ver:
```json
{
  "success": true,
  "message": "API Checador Angular - Backend Express.js",
  "version": "1.0.0"
}
```

## 🎨 Deploy del Frontend

### Opción 1: Render Static Site (Recomendado)

1. En Render Dashboard, click **"New +"** → **"Static Site"**
2. Configura:

```
Name:           checador-frontend
Branch:         main
Root Directory: front
Build Command:  npm install && npm run build
Publish Dir:    dist/checador-frontend/browser
```

3. Click en **"Create Static Site"**

### Opción 2: Build Manual + Vercel/Netlify

Si prefieres otra plataforma:

```bash
cd front
npm install
npm run build
```

Sube el contenido de `dist/checador-frontend/browser` a Vercel o Netlify.

### Configurar URL del Backend en Frontend

Actualiza el archivo `front/src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://checador-backend.onrender.com/api'
};
```

Después de actualizar, haz push y Render reconstruirá automáticamente.

## 🔄 Actualizar el CORS

Una vez que tengas la URL del frontend, actualiza la variable de entorno en Render:

1. Ve a tu servicio backend en Render
2. En **Environment**, actualiza:
   ```
   FRONTEND_URL=https://checador-frontend.onrender.com
   ```
3. Guarda y espera el redeploy automático

## ✅ Verificación Final

### Backend
- [ ] La API responde en `https://checador-backend.onrender.com`
- [ ] Los endpoints funcionan correctamente
- [ ] Las variables de entorno están configuradas
- [ ] No hay errores en los logs

### Frontend
- [ ] La aplicación carga en `https://checador-frontend.onrender.com`
- [ ] El login funciona correctamente
- [ ] Las peticiones al backend funcionan
- [ ] No hay errores de CORS

## 🐛 Solución de Problemas

### Error: "Application failed to respond"

**Solución**: Verifica que:
- El puerto sea `process.env.PORT` (Render asigna el puerto automáticamente)
- El start command sea `npm start` no `npm run dev`

### Error: "Cannot find module"

**Solución**: 
- Verifica que `package.json` tenga `"type": "module"`
- Asegúrate de que todas las importaciones usen `.js` al final

### Error de CORS

**Solución**:
- Verifica que `FRONTEND_URL` esté configurado correctamente
- Asegúrate de que el frontend use HTTPS

### El frontend no conecta con el backend

**Solución**:
- Verifica que `environment.prod.ts` tenga la URL correcta del backend
- Asegúrate de haber reconstruido el frontend después de cambiar la URL
- Verifica en DevTools que las peticiones vayan a la URL correcta

## 🔒 Seguridad

- ✅ Archivo `.env` en `.gitignore`
- ✅ Variables sensibles solo en Render Environment
- ✅ CORS configurado para dominios específicos
- ✅ Supabase RLS (Row Level Security) habilitado

## 💰 Plan Gratuito de Render

El plan gratuito incluye:
- 750 horas de servicio por mes (suficiente para 1 servicio 24/7)
- 100 GB de ancho de banda
- El servicio se "duerme" después de 15 min de inactividad
- Primera petición después de dormir toma ~30 segundos

## 📚 Recursos Adicionales

- [Documentación de Render](https://render.com/docs)
- [Documentación de Supabase](https://supabase.com/docs)
- [Angular Deployment](https://angular.io/guide/deployment)

## 🆘 Soporte

Si tienes problemas:
1. Revisa los logs en Render Dashboard
2. Verifica las variables de entorno
3. Prueba los endpoints con curl o Postman
4. Revisa la consola del navegador para errores de frontend
