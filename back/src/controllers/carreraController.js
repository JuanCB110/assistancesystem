import { supabase } from '../config/supabase.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// GET /api/carreras
export const getAllCarreras = asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from('carreras')
    .select('*')
    .order('nombre');

  if (error) throw error;

  res.json({
    success: true,
    data
  });
});

// GET /api/carreras/:id
export const getCarreraById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('carreras')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;

  if (!data) {
    return res.status(404).json({
      success: false,
      error: 'Carrera no encontrada'
    });
  }

  res.json({
    success: true,
    data
  });
});

// POST /api/carreras
export const createCarrera = asyncHandler(async (req, res) => {
  const { nombre, semestres } = req.body;

  if (!nombre || !semestres) {
    return res.status(400).json({
      success: false,
      error: 'Nombre y semestres son requeridos'
    });
  }

  const { data, error } = await supabase
    .from('carreras')
    .insert([{ nombre, semestres }])
    .select()
    .single();

  if (error) throw error;

  res.status(201).json({
    success: true,
    data
  });
});

// PUT /api/carreras/:id
export const updateCarrera = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { nombre, semestres } = req.body;

  const { data, error } = await supabase
    .from('carreras')
    .update({ nombre, semestres })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  res.json({
    success: true,
    data
  });
});

// DELETE /api/carreras/:id
export const deleteCarrera = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('carreras')
    .delete()
    .eq('id', id);

  if (error) throw error;

  res.json({
    success: true,
    message: 'Carrera eliminada correctamente'
  });
});
