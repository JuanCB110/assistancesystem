import { supabase } from '../config/supabase.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Email y contraseña son requeridos'
    });
  }

  // Buscar usuario en la base de datos
  const { data: usuario, error: userError } = await supabase
    .from('usuarios')
    .select('id, name, email, role, numero_cuenta, password')
    .eq('email', email)
    .single();

  if (userError || !usuario) {
    return res.status(401).json({
      success: false,
      error: 'Credenciales inválidas'
    });
  }

  // Verificar contraseña (comparación simple - en producción usar bcrypt)
  if (usuario.password !== password) {
    return res.status(401).json({
      success: false,
      error: 'Credenciales inválidas'
    });
  }

  // Remover contraseña de la respuesta
  delete usuario.password;

  res.json({
    success: true,
    data: {
      user: usuario,
      // En producción, aquí generarías un JWT token
      token: `demo-token-${usuario.id}`
    }
  });
});

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, numero_cuenta } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Nombre, email y contraseña son requeridos'
    });
  }

  // Verificar si el usuario ya existe
  const { data: existingUser } = await supabase
    .from('usuarios')
    .select('email')
    .eq('email', email)
    .single();

  if (existingUser) {
    return res.status(409).json({
      success: false,
      error: 'El email ya está registrado'
    });
  }

  // Crear usuario
  const { data, error } = await supabase
    .from('usuarios')
    .insert([{
      name,
      email,
      password, // En producción, hashear con bcrypt
      role: role || 'Alumno',
      numero_cuenta
    }])
    .select('id, name, email, role, numero_cuenta')
    .single();

  if (error) throw error;

  res.status(201).json({
    success: true,
    data: {
      user: data,
      token: `demo-token-${data.id}`
    }
  });
});

// GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  // Este endpoint requeriría el middleware de autenticación
  res.json({
    success: true,
    data: req.user
  });
});
