import express from 'express';
import {
  getAllAulas,
  getAulaById,
  createAula,
  updateAula,
  deleteAula
} from '../controllers/aulaController.js';

const router = express.Router();

router.get('/', getAllAulas);
router.get('/:id', getAulaById);
router.post('/', createAula);
router.put('/:id', updateAula);
router.delete('/:id', deleteAula);

export default router;
