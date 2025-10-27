import { supabase } from '../config/supabase.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// GET /api/grupos
export const getAllGrupos = asyncHandler(async (req, res) => {
  const { carrera_id } = req.query;

  let query = supabase
    .from('grupo')
    .select(`
      *,
      aula:aula!aula_id(id, numero, edificio_id, edificio:edificios!edificio_id(nombre))
    `)
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

// GET /api/grupos/:id
export const getGrupoById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('grupo')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;

  if (!data) {
    return res.status(404).json({
      success: false,
      error: 'Grupo no encontrado'
    });
  }

  res.json({
    success: true,
    data
  });
});

// POST /api/grupos
export const createGrupo = asyncHandler(async (req, res) => {
  const { name, aula_id, jefe_id, carrera_id } = req.body;

  if (!name || !jefe_id) {
    return res.status(400).json({
      success: false,
      error: 'Name y jefe_id son requeridos'
    });
  }

  const { data, error } = await supabase
    .from('grupo')
    .insert([{ name, aula_id, jefe_id, carrera_id }])
    .select()
    .single();

  if (error) throw error;

  res.status(201).json({
    success: true,
    data
  });
});

// PUT /api/grupos/:id
export const updateGrupo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, aula_id, jefe_id, carrera_id } = req.body;

  const { data, error } = await supabase
    .from('grupo')
    .update({ name, aula_id, jefe_id, carrera_id })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  res.json({
    success: true,
    data
  });
});

// DELETE /api/grupos/:id
export const deleteGrupo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('grupo')
    .delete()
    .eq('id', id);

  if (error) throw error;

  res.json({
    success: true,
    message: 'Grupo eliminado correctamente'
  });
});
