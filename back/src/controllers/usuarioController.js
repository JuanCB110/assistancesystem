import { supabase } from '../config/supabase.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// GET /api/usuarios
export const getAllUsuarios = asyncHandler(async (req, res) => {
  const { role } = req.query;

  let query = supabase
    .from('usuarios')
    .select('id, name, email, role, numero_cuenta')
    .order('name');

  if (role) {
    query = query.eq('role', role);
  }

  const { data, error } = await query;

  if (error) throw error;

  res.json({
    success: true,
    data
  });
});

// GET /api/usuarios/maestros
export const getMaestros = asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from('usuarios')
    .select('id, name, email, role, numero_cuenta')
    .eq('role', 'Maestro')
    .order('name');

  if (error) throw error;

  res.json({
    success: true,
    data
  });
});

// GET /api/usuarios/jefes
export const getJefes = asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from('usuarios')
    .select('id, name, email, role, numero_cuenta')
    .eq('role', 'Jefe de Grupo')
    .order('name');

  if (error) throw error;

  res.json({
    success: true,
    data
  });
});

// GET /api/usuarios/:id
export const getUsuarioById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('usuarios')
    .select('id, name, email, role, numero_cuenta')
    .eq('id', id)
    .single();

  if (error) throw error;

  if (!data) {
    return res.status(404).json({
      success: false,
      error: 'Usuario no encontrado'
    });
  }

  res.json({
    success: true,
    data
  });
});

// GET /api/usuarios/numero-cuenta/:numeroCuenta
export const getUsuarioByNumeroCuenta = asyncHandler(async (req, res) => {
  const { numeroCuenta } = req.params;

  const { data, error } = await supabase
    .from('usuarios')
    .select('id, name, email, role, numero_cuenta')
    .eq('numero_cuenta', numeroCuenta)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }
    throw error;
  }

  res.json({
    success: true,
    data
  });
});

// POST /api/usuarios
export const createUsuario = asyncHandler(async (req, res) => {
  const { name, email, password, role, numero_cuenta } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Nombre, email y contraseña son requeridos'
    });
  }

  const { data, error } = await supabase
    .from('usuarios')
    .insert([{ name, email, password, role, numero_cuenta }])
    .select('id, name, email, role, numero_cuenta')
    .single();

  if (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        error: 'El email o número de cuenta ya existe'
      });
    }
    throw error;
  }

  res.status(201).json({
    success: true,
    data
  });
});

// PUT /api/usuarios/:id
export const updateUsuario = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role, numero_cuenta } = req.body;

  const updateData = { name, email, role, numero_cuenta };
  
  // Solo actualizar contraseña si se proporciona
  if (password) {
    updateData.password = password;
  }

  const { data, error } = await supabase
    .from('usuarios')
    .update(updateData)
    .eq('id', id)
    .select('id, name, email, role, numero_cuenta')
    .single();

  if (error) throw error;

  res.json({
    success: true,
    data
  });
});

// DELETE /api/usuarios/:id
export const deleteUsuario = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('usuarios')
    .delete()
    .eq('id', id);

  if (error) throw error;

  res.json({
    success: true,
    message: 'Usuario eliminado correctamente'
  });
});
