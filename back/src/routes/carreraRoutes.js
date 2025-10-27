import express from 'express';
import {
  getAllCarreras,
  getCarreraById,
  createCarrera,
  updateCarrera,
  deleteCarrera
} from '../controllers/carreraController.js';

const router = express.Router();

router.get('/', getAllCarreras);
router.get('/:id', getCarreraById);
router.post('/', createCarrera);
router.put('/:id', updateCarrera);
router.delete('/:id', deleteCarrera);

export default router;
