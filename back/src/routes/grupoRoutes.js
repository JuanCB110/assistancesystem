import express from 'express';
import {
  getAllGrupos,
  getGrupoById,
  createGrupo,
  updateGrupo,
  deleteGrupo
} from '../controllers/grupoController.js';

const router = express.Router();

router.get('/', getAllGrupos);
router.get('/:id', getGrupoById);
router.post('/', createGrupo);
router.put('/:id', updateGrupo);
router.delete('/:id', deleteGrupo);

export default router;
