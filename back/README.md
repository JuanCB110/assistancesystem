# 🚀 Checador Backend - Express.js + Supabase

Backend API REST para el Sistema de Checador Angular.

## 📋 Requisitos

- Node.js >= 16.x
- npm o yarn
- Cuenta de Supabase
- Base de datos PostgreSQL configurada

## 🛠️ Instalación

### 1. Instalar dependencias

```bash
cd Checador-Backend
npm install
```

### 2. Configurar variables de entorno

Editar el archivo `.env`:

```env
PORT=3000
SUPABASE_URL=https://bqreiifjmrscrmbbacpi.supabase.co
SUPABASE_ANON_KEY=tu_clave_aqui
NODE_ENV=development
```

### 3. Verificar conexión a base de datos

Asegúrate de que tu base de datos Supabase tenga las siguientes tablas:
- ✅ carreras
- ✅ edificios
- ✅ usuarios
- ✅ materias
- ✅ grupo
- ✅ horario-maestro
- ✅ asistencia_checador
- ✅ asistencia_jefe
- ✅ asistencia_maestro

## 🚀 Ejecutar

### Modo desarrollo (con auto-reload)

```bash
npm run dev
```

### Modo producción

```bash
npm start
```

El servidor se iniciará en: **http://localhost:3000**

## 📡 API Endpoints

### 🔐 Autenticación
```
POST   /api/auth/login          - Iniciar sesión
POST   /api/auth/register       - Registrar usuario
GET    /api/auth/me             - Obtener usuario actual
```

### 📚 Carreras
```
GET    /api/carreras            - Listar todas las carreras
GET    /api/carreras/:id        - Obtener carrera por ID
POST   /api/carreras            - Crear nueva carrera
PUT    /api/carreras/:id        - Actualizar carrera
DELETE /api/carreras/:id        - Eliminar carrera
```

### 🏢 Edificios
```
GET    /api/edificios           - Listar todos los edificios
GET    /api/edificios/:id       - Obtener edificio por ID
POST   /api/edificios           - Crear nuevo edificio
PUT    /api/edificios/:id       - Actualizar edificio
DELETE /api/edificios/:id       - Eliminar edificio
```

### 👥 Usuarios
```
GET    /api/usuarios            - Listar todos los usuarios
GET    /api/usuarios/maestros   - Listar solo maestros
GET    /api/usuarios/jefes      - Listar solo jefes de grupo
GET    /api/usuarios/:id        - Obtener usuario por ID
GET    /api/usuarios/numero-cuenta/:numeroCuenta - Buscar por número de cuenta
POST   /api/usuarios            - Crear nuevo usuario
PUT    /api/usuarios/:id        - Actualizar usuario
DELETE /api/usuarios/:id        - Eliminar usuario
```

### 📖 Materias
```
GET    /api/materias            - Listar todas las materias
GET    /api/materias/:id        - Obtener materia por ID
POST   /api/materias            - Crear nueva materia
PUT    /api/materias/:id        - Actualizar materia
DELETE /api/materias/:id        - Eliminar materia
```

### 👨‍🎓 Grupos
```
GET    /api/grupos              - Listar todos los grupos
GET    /api/grupos/:id          - Obtener grupo por ID
POST   /api/grupos              - Crear nuevo grupo
PUT    /api/grupos/:id          - Actualizar grupo
DELETE /api/grupos/:id          - Eliminar grupo
```

### 📅 Horarios
```
GET    /api/horarios            - Listar todos los horarios
GET    /api/horarios/:id        - Obtener horario por ID
POST   /api/horarios            - Crear nuevo horario
POST   /api/horarios/multiple   - Crear múltiples horarios
PUT    /api/horarios/:id        - Actualizar horario
DELETE /api/horarios/:id        - Eliminar horario
```

Query params disponibles:
- `?maestro_id=1` - Filtrar por maestro
- `?grupo_id=1` - Filtrar por grupo

### ✅ Asistencias
```
GET    /api/asistencias/checador              - Listar asistencias de checador
POST   /api/asistencias/checador              - Registrar asistencia checador
GET    /api/asistencias/jefe                  - Listar asistencias de jefe
POST   /api/asistencias/jefe                  - Registrar asistencia jefe
GET    /api/asistencias/maestro               - Listar asistencias de maestro
POST   /api/asistencias/maestro               - Registrar asistencia maestro
GET    /api/asistencias/resumen/:maestro_id/:fecha - Obtener resumen de asistencias
```

### 🏥 Health Check
```
GET    /api/health              - Verificar estado del servidor
```

## 📦 Ejemplos de Uso

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"123456"}'
```

### Crear Carrera
```bash
curl -X POST http://localhost:3000/api/carreras \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Ingeniería en Sistemas","semestres":9}'
```

### Listar Maestros
```bash
curl http://localhost:3000/api/usuarios/maestros
```

### Crear Horario
```bash
curl -X POST http://localhost:3000/api/horarios \
  -H "Content-Type: application/json" \
  -d '{
    "maestro_id":1,
    "materia_id":1,
    "grupo_id":1,
    "dia":"Lunes",
    "hora":"08:00-10:00"
  }'
```

## 🔧 Estructura del Proyecto

```
Checador-Backend/
├── src/
│   ├── config/
│   │   └── supabase.js          # Configuración de Supabase
│   ├── controllers/             # Lógica de negocio
│   │   ├── authController.js
│   │   ├── carreraController.js
│   │   ├── edificioController.js
│   │   ├── usuarioController.js
│   │   ├── materiaController.js
│   │   ├── grupoController.js
│   │   ├── horarioController.js
│   │   └── asistenciaController.js
│   ├── middleware/              # Middleware
│   │   ├── auth.js              # Autenticación
│   │   └── errorHandler.js      # Manejo de errores
│   ├── routes/                  # Definición de rutas
│   │   ├── index.js
│   │   ├── authRoutes.js
│   │   ├── carreraRoutes.js
│   │   ├── edificioRoutes.js
│   │   ├── usuarioRoutes.js
│   │   ├── materiaRoutes.js
│   │   ├── grupoRoutes.js
│   │   ├── horarioRoutes.js
│   │   └── asistenciaRoutes.js
│   └── server.js                # Punto de entrada
├── .env                         # Variables de entorno
├── .gitignore
├── package.json
└── README.md
```

## 🛡️ Seguridad

- ⚠️ Las contraseñas se almacenan en texto plano (solo para desarrollo)
- ⚠️ En producción usar bcrypt para hashear contraseñas
- ⚠️ Implementar JWT para autenticación real
- ✅ CORS configurado para localhost
- ✅ Validación de entrada en todos los endpoints

## 🐛 Debugging

Ver logs del servidor:
```bash
npm run dev
```

Probar endpoints con:
- Postman
- Thunder Client (VS Code)
- curl
- Navegador (solo GET)

## 📝 Notas

- El servidor usa módulos ES6 (`type: "module"`)
- Todas las respuestas son en formato JSON
- Formato de respuesta estándar:
  ```json
  {
    "success": true/false,
    "data": { ... },
    "error": "mensaje de error (si aplica)"
  }
  ```

## 🤝 Contribuir

1. Hacer fork del proyecto
2. Crear una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

ISC

## 👨‍💻 Autor

Sistema Checador Angular - Backend Express.js
