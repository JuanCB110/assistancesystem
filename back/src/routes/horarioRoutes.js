import express from 'express';
import {
  getAllHorarios,
  getHorarioById,
  createHorario,
  updateHorario,
  deleteHorario
} from '../controllers/horarioController.js';

const router = express.Router();

router.get('/', getAllHorarios);
router.get('/:id', getHorarioById);
router.post('/', createHorario);
router.put('/:id', updateHorario);
router.delete('/:id', deleteHorario);

export default router;
