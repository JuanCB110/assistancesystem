import express from 'express';
import {
  getAllUsuarios,
  getMaestros,
  getJefes,
  getUsuarioById,
  getUsuarioByNumeroCuenta,
  createUsuario,
  updateUsuario,
  deleteUsuario
} from '../controllers/usuarioController.js';

const router = express.Router();

router.get('/', getAllUsuarios);
router.get('/maestros', getMaestros);
router.get('/jefes', getJefes);
router.get('/numero-cuenta/:numeroCuenta', getUsuarioByNumeroCuenta);
router.get('/:id', getUsuarioById);
router.post('/', createUsuario);
router.put('/:id', updateUsuario);
router.delete('/:id', deleteUsuario);

export default router;
