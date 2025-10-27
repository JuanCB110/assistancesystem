import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

// Configurar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:4201', 'http://localhost:4305'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger simple
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas
app.use('/api', routes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Checador Angular - Backend Express.js',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      carreras: '/api/carreras',
      edificios: '/api/edificios',
      usuarios: '/api/usuarios',
      materias: '/api/materias',
      grupos: '/api/grupos',
      horarios: '/api/horarios',
      asistencias: '/api/asistencias'
    }
  });
});

// Manejo de errores
app.use(errorHandler);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
Puerto: ${PORT}
Entorno: ${process.env.NODE_ENV || 'development'}
URL: http://localhost:${PORT}
API: http://localhost:${PORT}/api
  `);
});

export default app;
