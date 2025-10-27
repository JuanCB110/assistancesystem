import { supabase } from '../config/supabase.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// GET /api/materias
export const getAllMaterias = asyncHandler(async (req, res) => {
  const { carrera_id } = req.query;

  let query = supabase
    .from('materias')
    .select('*')
    .order('name');

  if (carrera_id) {
    query = query.eq('carrera_id', carrera_id);
  }

  const { data, error } = await query;

  if (error) throw error;

  res.json({
    success: true,
    data
  });
});

// GET /api/materias/:id
export const getMateriaById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('materias')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;

  if (!data) {
    return res.status(404).json({
      success: false,
      error: 'Materia no encontrada'
    });
  }

  res.json({
    success: true,
    data
  });
});

// POST /api/materias
export const createMateria = asyncHandler(async (req, res) => {
  const { name, semestre, carrera_id } = req.body;

  if (!name || !semestre) {
    return res.status(400).json({
      success: false,
      error: 'Name y semestre son requeridos'
    });
  }

  const { data, error } = await supabase
    .from('materias')
    .insert([{ name, semestre, carrera_id }])
    .select()
    .single();

  if (error) throw error;

  res.status(201).json({
    success: true,
    data
  });
});

// PUT /api/materias/:id
export const updateMateria = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, semestre, carrera_id } = req.body;

  const { data, error } = await supabase
    .from('materias')
    .update({ name, semestre, carrera_id })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  res.json({
    success: true,
    data
  });
});

// DELETE /api/materias/:id
export const deleteMateria = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('materias')
    .delete()
    .eq('id', id);

  if (error) throw error;

  res.json({
    success: true,
    message: 'Materia eliminada correctamente'
  });
});
