import express from 'express';
import carreraRoutes from './carreraRoutes.js';
import edificioRoutes from './edificioRoutes.js';
import aulaRoutes from './aulaRoutes.js';
import usuarioRoutes from './usuarioRoutes.js';
import materiaRoutes from './materiaRoutes.js';
import grupoRoutes from './grupoRoutes.js';
import horarioRoutes from './horarioRoutes.js';
import asistenciaRoutes from './asistenciaRoutes.js';
import authRoutes from './authRoutes.js';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Rutas de la API
router.use('/auth', authRoutes);
router.use('/carreras', carreraRoutes);
router.use('/edificios', edificioRoutes);
router.use('/aulas', aulaRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/materias', materiaRoutes);
router.use('/grupos', grupoRoutes);
router.use('/horarios', horarioRoutes);
router.use('/asistencias', asistenciaRoutes);

export default router;
