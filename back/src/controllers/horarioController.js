import { supabase } from '../config/supabase.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// GET /api/horarios
export const getAllHorarios = asyncHandler(async (req, res) => {
  const { maestro_id, grupo_id } = req.query;

  let query = supabase
    .from('horario_maestro')
    .select(`
      *,
      usuario:usuarios!maestro_id(id, name),
      materia:materias!materia_id(id, name),
      grupo:grupo!grupo_id(
        id, 
        name, 
        aula_id,
        aula:aula!aula_id(numero, edificio_id, edificio:edificios!edificio_id(nombre))
      )
    `)
    .order('id');

  if (maestro_id) {
    query = query.eq('maestro_id', maestro_id);
  }

  if (grupo_id) {
    query = query.eq('grupo_id', grupo_id);
  }

  const { data, error } = await query;

  if (error) throw error;

  res.json({
    success: true,
    data
  });
});

// GET /api/horarios/:id
export const getHorarioById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('horario_maestro')
    .select(`
      *,
      usuario:usuarios!maestro_id(id, name),
      materia:materias!materia_id(id, name),
      grupo:grupo!grupo_id(
        id, 
        name, 
        aula_id,
        aula:aula!aula_id(numero, edificio_id)
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;

  if (!data) {
    return res.status(404).json({
      success: false,
      error: 'Horario no encontrado'
    });
  }

  res.json({
    success: true,
    data
  });
});

// POST /api/horarios
export const createHorario = asyncHandler(async (req, res) => {
  const { maestro_id, materia_id, grupo_id, dias, hora_inicio, hora_fin } = req.body;

  if (!maestro_id || !materia_id || !grupo_id || !dias || !hora_inicio || !hora_fin) {
    return res.status(400).json({
      success: false,
      error: 'Todos los campos son requeridos (maestro_id, materia_id, grupo_id, dias, hora_inicio, hora_fin)'
    });
  }

  // Si "dias" es un array, conviértelo a string
  const diasFormateados = Array.isArray(dias) ? dias.join(', ') : dias;

  const { data, error } = await supabase
    .from('horario_maestro')
    .insert([{
      maestro_id,
      materia_id,
      grupo_id,
      dias: diasFormateados,
      hora_inicio,
      hora_fin,
      asistencia: false
    }])
    .select()
    .single();

  if (error) throw error;

  res.status(201).json({
    success: true,
    data
  });
});

// PUT /api/horarios/:id
export const updateHorario = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { maestro_id, materia_id, grupo_id, dias, hora_inicio, hora_fin, asistencia } = req.body;

  const updateData = {};
  if (maestro_id !== undefined) updateData.maestro_id = maestro_id;
  if (materia_id !== undefined) updateData.materia_id = materia_id;
  if (grupo_id !== undefined) updateData.grupo_id = grupo_id;
  if (dias !== undefined) updateData.dias = dias;
  if (hora_inicio !== undefined) updateData.hora_inicio = hora_inicio;
  if (hora_fin !== undefined) updateData.hora_fin = hora_fin;
  if (asistencia !== undefined) updateData.asistencia = asistencia;

  const { data, error } = await supabase
    .from('horario_maestro')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  res.json({
    success: true,
    data
  });
});

// DELETE /api/horarios/:id
export const deleteHorario = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('horario_maestro')
    .delete()
    .eq('id', id);

  if (error) throw error;

  res.json({
    success: true,
    message: 'Horario eliminado correctamente'
  });
});
