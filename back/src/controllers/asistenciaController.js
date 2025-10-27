import { supabase } from '../config/supabase.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// GET /api/asistencias/checador
export const getAsistenciasChecador = asyncHandler(async (req, res) => {
  const { horario_id, fecha } = req.query;

  let query = supabase
    .from('asistencia_checador')
    .select('*')
    .order('fecha', { ascending: false });

  if (horario_id) query = query.eq('horario_id', horario_id);
  if (fecha) query = query.eq('fecha', fecha);

  const { data, error } = await query;
  if (error) throw error;

  res.json({ success: true, data });
});

// POST /api/asistencias/checador
export const createAsistenciaChecador = asyncHandler(async (req, res) => {
  const { horario_id, fecha, asistencia, checador_id } = req.body;

  if (!horario_id || !fecha || !asistencia || !checador_id) {
    return res.status(400).json({
      success: false,
      error: 'horario_id, fecha, asistencia y checador_id son requeridos'
    });
  }

  const { data, error } = await supabase
    .from('asistencia_checador')
    .insert([{ horario_id, fecha, asistencia, checador_id }])
    .select()
    .single();

  if (error) throw error;

  res.status(201).json({ success: true, data });
});

// PUT /api/asistencias/checador/:id
export const updateAsistenciaChecador = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { asistencia } = req.body;

  if (!asistencia) {
    return res.status(400).json({
      success: false,
      error: 'asistencia es requerida'
    });
  }

  const { data, error } = await supabase
    .from('asistencia_checador')
    .update({ asistencia })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  res.json({ success: true, data });
});

// GET /api/asistencias/jefe
export const getAsistenciasJefe = asyncHandler(async (req, res) => {
  const { horario_id, fecha } = req.query;

  let query = supabase
    .from('asistencia_jefe')
    .select('*')
    .order('fecha', { ascending: false });

  if (horario_id) query = query.eq('horario_id', horario_id);
  if (fecha) query = query.eq('fecha', fecha);

  const { data, error } = await query;
  if (error) throw error;

  res.json({ success: true, data });
});

// POST /api/asistencias/jefe
export const createAsistenciaJefe = asyncHandler(async (req, res) => {
  const { horario_id, fecha, asistencia, jefe_id } = req.body;

  if (!horario_id || !fecha || !asistencia || !jefe_id) {
    return res.status(400).json({
      success: false,
      error: 'horario_id, fecha, asistencia y jefe_id son requeridos'
    });
  }

  const { data, error } = await supabase
    .from('asistencia_jefe')
    .insert([{ horario_id, fecha, asistencia, jefe_id }])
    .select()
    .single();

  if (error) throw error;

  res.status(201).json({ success: true, data });
});

// PUT /api/asistencias/jefe/:id
export const updateAsistenciaJefe = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { asistencia } = req.body;

  if (!asistencia) {
    return res.status(400).json({
      success: false,
      error: 'asistencia es requerida'
    });
  }

  const { data, error } = await supabase
    .from('asistencia_jefe')
    .update({ asistencia })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  res.json({ success: true, data });
});

// GET /api/asistencias/maestro
export const getAsistenciasMaestro = asyncHandler(async (req, res) => {
  const { horario_id, fecha } = req.query;

  let query = supabase
    .from('asistencia_maestro')
    .select('*')
    .order('fecha', { ascending: false });

  if (horario_id) query = query.eq('horario_id', horario_id);
  if (fecha) query = query.eq('fecha', fecha);

  const { data, error } = await query;
  if (error) throw error;

  res.json({ success: true, data });
});

// POST /api/asistencias/maestro
export const createAsistenciaMaestro = asyncHandler(async (req, res) => {
  const { horario_id, fecha, asistencia, maestro_id } = req.body;

  if (!horario_id || !fecha || !asistencia || !maestro_id) {
    return res.status(400).json({
      success: false,
      error: 'horario_id, fecha, asistencia y maestro_id son requeridos'
    });
  }

  const { data, error } = await supabase
    .from('asistencia_maestro')
    .insert([{ horario_id, fecha, asistencia, maestro_id }])
    .select()
    .single();

  if (error) throw error;

  res.status(201).json({ success: true, data });
});

// GET /api/asistencias/resumen/:maestro_id/:fecha
export const getResumenAsistencias = asyncHandler(async (req, res) => {
  const { maestro_id, fecha } = req.params;

  // Obtener horarios del maestro
  const { data: horarios, error: horError } = await supabase
    .from('horario_maestro')
    .select('*')
    .eq('maestro_id', maestro_id);

  if (horError) throw horError;

  const horariosIds = horarios.map(h => h.id);

  // Obtener asistencias de todas las fuentes
  const [checador, jefe, maestro] = await Promise.all([
    supabase.from('asistencia_checador').select('*').in('horario_id', horariosIds).eq('fecha', fecha),
    supabase.from('asistencia_jefe').select('*').in('horario_id', horariosIds).eq('fecha', fecha),
    supabase.from('asistencia_maestro').select('*').in('horario_id', horariosIds).eq('fecha', fecha)
  ]);

  res.json({
    success: true,
    data: {
      horarios,
      asistencias: {
        checador: checador.data || [],
        jefe: jefe.data || [],
        maestro: maestro.data || []
      }
    }
  });
});
