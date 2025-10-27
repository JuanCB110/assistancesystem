import express from 'express';
import {
  getAllMaterias,
  getMateriaById,
  createMateria,
  updateMateria,
  deleteMateria
} from '../controllers/materiaController.js';

const router = express.Router();

router.get('/', getAllMaterias);
router.get('/:id', getMateriaById);
router.post('/', createMateria);
router.put('/:id', updateMateria);
router.delete('/:id', deleteMateria);

export default router;
