export function validarRegistro(usuario, password, repetir) {
  if (usuario.trim().length < 4) {
    return "El usuario debe tener al menos 4 caracteres";
  }
  if (password.length < 6) {
    return "La contraseña debe tener al menos 6 caracteres";
  }
  if (password !== repetir) {
    return "Las contraseñas no coinciden";
  }
  return null; // null = todo OK
}