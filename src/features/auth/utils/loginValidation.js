const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateLoginField = (fieldName, value) => {
  if (fieldName === "email") {
    const normalizedEmail = value.trim();

    if (!normalizedEmail) {
      return "Ingresa tu correo electrónico.";
    }

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      return "Ingresa un correo electrónico válido.";
    }
  }

  if (fieldName === "password") {
    if (!value) {
      return "Ingresa tu contraseña.";
    }

    if (value.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres.";
    }
  }

  return "";
};

export const validateLogin = ({ email, password }) => {
  const errors = {};

  const emailError = validateLoginField("email", email);
  const passwordError = validateLoginField("password", password);

  if (emailError) {
    errors.email = emailError;
  }

  if (passwordError) {
    errors.password = passwordError;
  }

  return errors;
};
