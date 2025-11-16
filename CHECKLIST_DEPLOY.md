# Checklist de Deploy - Sistema Checador

## ✅ Pre-Deploy

### Backend
- [x] Archivo `.env.example` creado
- [x] Archivo `render.yaml` creado
- [x] CORS configurado para aceptar frontend en producción
- [x] Variables de entorno documentadas
- [x] `.gitignore` actualizado
- [ ] Código pusheado a GitHub

### Frontend
- [x] `environment.prod.ts` actualizado
- [x] Script de build para producción
- [x] `.gitignore` configurado
- [ ] Código pusheado a GitHub

---

## 🚀 Deploy en Render

### 1. Deploy del Backend (5-10 min)

1. **Crear Web Service**
   - [ ] Ir a https://dashboard.render.com/
   - [ ] Click en "New +" → "Web Service"
   - [ ] Conectar repositorio de GitHub
   - [ ] Seleccionar rama `main` o `deploy`

2. **Configurar Servicio**
   ```
   Name:           checador-backend
   Runtime:        Node
   Region:         Oregon
   Branch:         main (o deploy)
   Root Directory: back
   Build Command:  npm install
   Start Command:  npm start
   ```

3. **Variables de Entorno**
   - [ ] `NODE_ENV` = `production`
   - [ ] `PORT` = `10000`
   - [ ] `SUPABASE_URL` = `https://bqreiifjmrscrmbbacpi.supabase.co`
   - [ ] `SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - [ ] `FRONTEND_URL` = (dejar vacío por ahora)

4. **Desplegar**
   - [ ] Click en "Create Web Service"
   - [ ] Esperar a que termine el build
   - [ ] Anotar la URL: `https://checador-backend-XXXX.onrender.com`

5. **Verificar**
   - [ ] Visitar la URL del backend
   - [ ] Debe mostrar el mensaje de bienvenida de la API
   - [ ] Probar endpoint: `https://tu-backend.onrender.com/api/health`

---

### 2. Deploy del Frontend (5-10 min)

1. **Actualizar environment.prod.ts**
   - [ ] Abrir `front/src/environments/environment.prod.ts`
   - [ ] Cambiar `apiUrl` a la URL del backend de Render
   - [ ] Commit y push

2. **Crear Static Site**
   - [ ] En Render, click "New +" → "Static Site"
   - [ ] Conectar el mismo repositorio
   
3. **Configurar**
   ```
   Name:           checador-frontend
   Branch:         main (o deploy)
   Root Directory: front
   Build Command:  npm install && npm run build
   Publish Dir:    dist/front/browser
   ```

4. **Desplegar**
   - [ ] Click en "Create Static Site"
   - [ ] Esperar build (puede tomar 5-10 min)
   - [ ] Anotar URL: `https://checador-frontend.onrender.com`

---

### 3. Configurar CORS (2 min)

1. **Actualizar Backend**
   - [ ] Ir al servicio backend en Render
   - [ ] Environment → Add Environment Variable
   - [ ] `FRONTEND_URL` = `https://checador-frontend.onrender.com`
   - [ ] Guardar (se redespleará automáticamente)

---

## ✅ Verificación Post-Deploy

### Backend
- [ ] URL accesible: `https://checador-backend.onrender.com`
- [ ] Endpoint raíz responde con JSON
- [ ] `/api/health` responde correctamente
- [ ] No hay errores en los logs

### Frontend
- [ ] URL accesible: `https://checador-frontend.onrender.com`
- [ ] La aplicación carga correctamente
- [ ] No hay errores en la consola del navegador
- [ ] Verificar en Network que las peticiones van al backend correcto

### Integración
- [ ] Login funciona
- [ ] Se pueden ver horarios
- [ ] Se pueden registrar asistencias
- [ ] No hay errores de CORS
- [ ] Los datos persisten en Supabase

---

## 🐛 Troubleshooting

### "Application failed to respond"
- Verificar que el puerto sea `process.env.PORT`
- Revisar logs en Render
- Verificar que todas las variables estén configuradas

### Error de CORS
- Verificar `FRONTEND_URL` en backend
- Asegurarse de que ambas URLs usen HTTPS
- Limpiar caché del navegador

### Frontend no carga
- Verificar que el build haya terminado exitosamente
- Verificar que `Publish Dir` sea correcto: `dist/front/browser`
- Revisar logs de build

### "Cannot find module"
- Verificar `package.json` tenga `"type": "module"`
- Verificar que todas las importaciones usen `.js`

---

## 📝 Notas

- **Plan Gratuito**: Los servicios se duermen después de 15 min de inactividad
- **Primera carga**: Después de dormir, la primera petición toma ~30 seg
- **Auto-deploy**: Render redespleará automáticamente en cada push a la rama configurada
- **Logs**: Disponibles en tiempo real en el dashboard de Render

---

## 🎉 Deploy Completado

Una vez que todo esté funcionando:

- [ ] Documentar URLs finales en el README
- [ ] Compartir URLs con el equipo
- [ ] Configurar dominio personalizado (opcional)
- [ ] Configurar monitoring (opcional)

**URLs Finales:**
- Backend: `_____________________________`
- Frontend: `_____________________________`
