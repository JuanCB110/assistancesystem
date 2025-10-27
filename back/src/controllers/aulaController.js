import { supabase } from '../config/supabase.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// GET /api/aulas
export const getAllAulas = asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from('aula')
    .select('*')
    .order('numero');

  if (error) throw error;

  res.json({
    success: true,
    data
  });
});

// GET /api/aulas/:id
export const getAulaById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('aula')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;

  if (!data) {
    return res.status(404).json({
      success: false,
      error: 'Aula no encontrada'
    });
  }

  res.json({
    success: true,
    data
  });
});

// POST /api/aulas
export const createAula = asyncHandler(async (req, res) => {
  const { numero, edificio_id } = req.body;

  if (!numero || !edificio_id) {
    return res.status(400).json({
      success: false,
      error: 'Número de aula y edificio son requeridos'
    });
  }

  const { data, error } = await supabase
    .from('aula')
    .insert([{ numero, edificio_id }])
    .select()
    .single();

  if (error) throw error;

  res.status(201).json({
    success: true,
    data
  });
});

// PUT /api/aulas/:id
export const updateAula = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { numero, edificio_id } = req.body;

  const { data, error } = await supabase
    .from('aula')
    .update({ numero, edificio_id })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  res.json({
    success: true,
    data
  });
});

// DELETE /api/aulas/:id
export const deleteAula = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('aula')
    .delete()
    .eq('id', id);

  if (error) throw error;

  res.json({
    success: true,
    message: 'Aula eliminada correctamente'
  });
});
