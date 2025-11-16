# Sistema Checador - Configuración de Deploy en Render

## Backend API

**Service Type**: Web Service  
**Runtime**: Node  
**Build Command**: `npm install`  
**Start Command**: `npm start`  

### Variables de Entorno:
```
NODE_ENV=production
PORT=10000
SUPABASE_URL=https://bqreiifjmrscrmbbacpi.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxcmVpaWZqbXJzY3JtYmJhY3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MzQ0ODgsImV4cCI6MjA3NDUxMDQ4OH0.6cx8-75Wm1Jb5T6MvhOnbv3mof7bykp2wvtTCHPJM_s
FRONTEND_URL=https://tu-frontend.onrender.com
```

---

## Frontend Angular

**Service Type**: Static Site  
**Build Command**: `npm install && npm run build`  
**Publish Directory**: `dist/front/browser`  

### Notas:
- Asegúrate de actualizar `environment.prod.ts` con la URL del backend
- El frontend se reconstruye automáticamente en cada push

---

## 🚀 Pasos para Deploy:

### 1. Backend
1. Ve a Render Dashboard
2. New + → Web Service
3. Conecta tu repositorio
4. Root Directory: `back`
5. Configura las variables de entorno
6. Deploy

### 2. Frontend
1. New + → Static Site
2. Conecta tu repositorio
3. Root Directory: `front`
4. Deploy

### 3. Actualizar CORS
1. Copia la URL del frontend
2. Actualiza `FRONTEND_URL` en las variables del backend
3. El backend se redespleará automáticamente

---

## 📋 Checklist de Deploy

- [ ] Backend desplegado y respondiendo
- [ ] Variables de entorno configuradas
- [ ] Frontend desplegado
- [ ] `environment.prod.ts` actualizado con URL del backend
- [ ] CORS actualizado con URL del frontend
- [ ] Login funciona correctamente
- [ ] Endpoints de API funcionan

---

## 🔗 URLs de Servicios

- **Backend**: https://checador-backend.onrender.com
- **Frontend**: https://checador-frontend.onrender.com (actualizar según tu deploy)

---

## ⚠️ Importante

- No subas el archivo `.env` al repositorio
- Las credenciales de Supabase están configuradas en variables de entorno de Render
- El plan gratuito de Render pone el servicio en "sleep" después de 15 min de inactividad
