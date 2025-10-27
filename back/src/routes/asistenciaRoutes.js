import express from 'express';
import {
  getAsistenciasChecador,
  createAsistenciaChecador,
  updateAsistenciaChecador,
  getAsistenciasJefe,
  createAsistenciaJefe,
  updateAsistenciaJefe,
  getAsistenciasMaestro,
  createAsistenciaMaestro,
  getResumenAsistencias
} from '../controllers/asistenciaController.js';

const router = express.Router();

// Rutas para asistencias de checador
router.get('/checador', getAsistenciasChecador);
router.post('/checador', createAsistenciaChecador);
router.put('/checador/:id', updateAsistenciaChecador);

// Rutas para asistencias de jefe
router.get('/jefe', getAsistenciasJefe);
router.post('/jefe', createAsistenciaJefe);
router.put('/jefe/:id', updateAsistenciaJefe);

// Rutas para asistencias de maestro
router.get('/maestro', getAsistenciasMaestro);
router.post('/maestro', createAsistenciaMaestro);

// Ruta para obtener resumen de asistencias
router.get('/resumen/:maestro_id/:fecha', getResumenAsistencias);

export default router;
