import { supabase } from '../config/supabase.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// GET /api/edificios
export const getAllEdificios = asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from('edificios')
    .select('*')
    .order('nombre');

  if (error) throw error;

  res.json({
    success: true,
    data
  });
});

// GET /api/edificios/:id
export const getEdificioById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('edificios')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;

  if (!data) {
    return res.status(404).json({
      success: false,
      error: 'Edificio no encontrado'
    });
  }

  res.json({
    success: true,
    data
  });
});

// POST /api/edificios
export const createEdificio = asyncHandler(async (req, res) => {
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({
      success: false,
      error: 'Nombre es requerido'
    });
  }

  const { data, error } = await supabase
    .from('edificios')
    .insert([{ nombre }])
    .select()
    .single();

  if (error) throw error;

  res.status(201).json({
    success: true,
    data
  });
});

// PUT /api/edificios/:id
export const updateEdificio = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;

  const { data, error } = await supabase
    .from('edificios')
    .update({ nombre })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  res.json({
    success: true,
    data
  });
});

// DELETE /api/edificios/:id
export const deleteEdificio = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('edificios')
    .delete()
    .eq('id', id);

  if (error) throw error;

  res.json({
    success: true,
    message: 'Edificio eliminado correctamente'
  });
});
