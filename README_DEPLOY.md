# Sistema Checador - Proyecto Preparado para Deploy

Este proyecto está listo para ser desplegado en Render.com

## 🗂️ Estructura del Proyecto

```
Checador/
├── back/                      # Backend API (Express + Supabase)
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── server.js
│   ├── .env.example          # Template de variables de entorno
│   ├── .gitignore
│   ├── package.json
│   └── render.yaml           # Configuración de Render
│
├── front/                     # Frontend Angular
│   ├── src/
│   │   ├── app/
│   │   └── environments/
│   │       ├── environment.ts      # Desarrollo
│   │       └── environment.prod.ts # Producción
│   ├── angular.json
│   ├── package.json
│   └── render.yaml
│
├── DEPLOY.md                  # Guía completa de deploy
├── CHECKLIST_DEPLOY.md        # Checklist paso a paso
├── RENDER_CONFIG.md           # Configuración específica
└── verificar-deploy.js        # Script de verificación
```

## 🚀 Deploy Rápido

### 1. Verificar que todo esté listo
```bash
node verificar-deploy.js
```

### 2. Push a GitHub
```bash
git add .
git commit -m "Preparado para deploy en Render"
git push origin main
```

### 3. Seguir guía de deploy
Abre `CHECKLIST_DEPLOY.md` y sigue los pasos.

## 📚 Documentación

- **[DEPLOY.md](DEPLOY.md)** - Guía completa y detallada
- **[CHECKLIST_DEPLOY.md](CHECKLIST_DEPLOY.md)** - Lista de verificación paso a paso
- **[RENDER_CONFIG.md](RENDER_CONFIG.md)** - Configuración específica de Render

## 🔑 Variables de Entorno Necesarias

### Backend (Render)
```env
NODE_ENV=production
PORT=10000
SUPABASE_URL=https://bqreiifjmrscrmbbacpi.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
FRONTEND_URL=https://tu-frontend.onrender.com
```

## ⚡ Comandos Importantes

### Backend
```bash
cd back
npm install          # Instalar dependencias
npm start           # Iniciar en producción
npm run dev         # Iniciar en desarrollo
```

### Frontend
```bash
cd front
npm install          # Instalar dependencias
npm start           # Servidor de desarrollo
npm run build       # Build para producción
```

## 🆘 Soporte

Si encuentras problemas durante el deploy:

1. Revisa los logs en Render Dashboard
2. Consulta la sección de Troubleshooting en `DEPLOY.md`
3. Verifica que todas las variables de entorno estén configuradas
4. Asegúrate de que el build haya terminado exitosamente

## 📝 Notas Importantes

- El plan gratuito de Render pone los servicios en "sleep" después de 15 min de inactividad
- La primera petición después de dormir toma ~30 segundos en responder
- Render hace auto-deploy en cada push a la rama configurada
- No subas el archivo `.env` al repositorio (está en `.gitignore`)

## ✅ Estado del Proyecto

- ✅ Backend configurado para Render
- ✅ Frontend configurado para producción
- ✅ CORS configurado correctamente
- ✅ Variables de entorno documentadas
- ✅ Archivos de configuración creados
- ✅ Documentación completa

**El proyecto está listo para deploy! 🎉**
