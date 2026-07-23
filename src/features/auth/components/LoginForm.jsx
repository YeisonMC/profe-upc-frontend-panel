import { useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "../../../app/config/routePaths.js";
import { useAuth } from "../hooks/useAuth.js";
import { getLoginErrorMessage } from "../utils/getLoginErrorMessage.js";
import { validateLogin, validateLoginField } from "../utils/loginValidation.js";
import { AuthField } from "./AuthField.jsx";
import { SecurityNotice } from "./SecurityNotice.jsx";

const INITIAL_VALUES = {
  email: "",
  password: "",
};

export function LoginForm() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const formRef = useRef(null);

  const { signIn } = useAuth();

  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberSession, setRememberSession] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);

  const focusFirstInvalidField = () => {
    window.requestAnimationFrame(() => {
      const firstInvalidField = formRef.current?.querySelector(
        '[aria-invalid="true"]',
      );

      firstInvalidField?.focus();
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [name]: "",
      }));
    }

    if (serverMessage) {
      setServerMessage("");
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    const fieldError = validateLoginField(name, value);

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: fieldError,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting || isSuccessful) {
      return;
    }

    const validationErrors = validateLogin(values);

    setErrors(validationErrors);
    setServerMessage("");

    if (Object.keys(validationErrors).length > 0) {
      focusFirstInvalidField();
      return;
    }

    setIsSubmitting(true);

    try {
      await signIn(
        {
          email: values.email.trim().toLowerCase(),
          password: values.password,
        },
        rememberSession,
      );

      setIsSuccessful(true);

      if (!shouldReduceMotion) {
        await new Promise((resolve) => {
          window.setTimeout(resolve, 180);
        });
      }

      navigate(ROUTES.summary, {
        replace: true,
      });
    } catch (error) {
      setServerMessage(getLoginErrorMessage(error));

      if (import.meta.env.DEV) {
        console.error("Error durante el inicio de sesión:", {
          message: error?.message,
          code: error?.code,
          status: error?.response?.status,
          response: error?.response?.data,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordActionLabel = showPassword
    ? "Ocultar contraseña"
    : "Mostrar contraseña";

  return (
    <form ref={formRef} noValidate className="mt-7" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <AuthField
          label="Correo electrónico"
          name="email"
          type="email"
          value={values.email}
          placeholder="admin@upc.edu.pe"
          autoComplete="username"
          inputMode="email"
          icon={Mail}
          error={errors.email}
          disabled={isSubmitting || isSuccessful}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <AuthField
          label="Contraseña"
          name="password"
          type={showPassword ? "text" : "password"}
          value={values.password}
          placeholder="••••••••"
          autoComplete="current-password"
          icon={LockKeyhole}
          error={errors.password}
          disabled={isSubmitting || isSuccessful}
          onChange={handleChange}
          onBlur={handleBlur}
          labelAction={
            <a
              href="#contacto-administrador"
              className="rounded-sm text-[11px] font-medium text-upc-red outline-none transition-colors hover:text-upc-red-dark focus-visible:ring-2 focus-visible:ring-upc-red/30"
            >
              ¿Olvidaste tu contraseña?
            </a>
          }
          trailingAction={
            <button
              type="button"
              aria-label={passwordActionLabel}
              aria-pressed={showPassword}
              disabled={isSubmitting || isSuccessful}
              className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 outline-none transition-colors hover:bg-zinc-100 hover:text-zinc-600 focus-visible:ring-2 focus-visible:ring-upc-red/30 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => {
                setShowPassword((currentValue) => !currentValue);
              }}
            >
              {showPassword ? (
                <EyeOff
                  aria-hidden="true"
                  className="h-[15px] w-[15px]"
                  strokeWidth={1.8}
                />
              ) : (
                <Eye
                  aria-hidden="true"
                  className="h-[15px] w-[15px]"
                  strokeWidth={1.8}
                />
              )}
            </button>
          }
        />
      </div>

      <label className="mt-4 flex w-fit cursor-pointer items-center gap-2.5 rounded-sm text-[12px] leading-5 text-zinc-500 outline-none">
        <input
          type="checkbox"
          checked={rememberSession}
          disabled={isSubmitting || isSuccessful}
          className="h-4 w-4 cursor-pointer rounded border-zinc-300 accent-upc-red outline-none focus-visible:ring-2 focus-visible:ring-upc-red/30 disabled:cursor-not-allowed"
          onChange={(event) => {
            setRememberSession(event.target.checked);
          }}
        />

        <span>Mantener sesión iniciada</span>
      </label>

      <AnimatePresence initial={false}>
        {serverMessage ? (
          <motion.div
            role="alert"
            aria-live="assertive"
            initial={
              shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -5 }
            }
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={{ duration: 0.17 }}
            className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5"
          >
            <AlertCircle
              aria-hidden="true"
              className="mt-0.5 h-4 w-4 shrink-0 text-red-600"
              strokeWidth={1.9}
            />

            <p className="text-xs leading-[18px] text-red-700">
              {serverMessage}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="submit"
        disabled={isSubmitting || isSuccessful}
        whileTap={
          shouldReduceMotion || isSubmitting || isSuccessful
            ? undefined
            : { scale: 0.985 }
        }
        transition={{ duration: 0.1 }}
        className="mt-3.5 flex h-[42px] w-full items-center justify-center gap-2 rounded-[9px] bg-upc-red px-4 text-[12px] font-semibold text-white shadow-[0_6px_16px_rgba(231,0,11,0.13)] outline-none transition-[background-color,box-shadow,transform] duration-150 hover:bg-upc-red-dark hover:shadow-[0_8px_20px_rgba(231,0,11,0.18)] focus-visible:ring-4 focus-visible:ring-upc-red/20 active:bg-upc-red-active disabled:cursor-not-allowed disabled:bg-red-300 disabled:shadow-none"
      >
        {isSuccessful ? (
          <>
            <CheckCircle2
              aria-hidden="true"
              className="h-4 w-4"
              strokeWidth={2}
            />
            Acceso correcto
          </>
        ) : isSubmitting ? (
          <>
            <LoaderCircle
              aria-hidden="true"
              className="h-4 w-4 animate-spin"
              strokeWidth={2}
            />
            Ingresando...
          </>
        ) : (
          "Iniciar sesión"
        )}
      </motion.button>

      <div className="mt-5">
        <SecurityNotice />
      </div>

      <p
        id="contacto-administrador"
        className="mt-5 text-center text-[11px] leading-5 text-zinc-500"
      >
        ¿Necesitas acceso?{" "}
        <span className="font-semibold text-upc-red">
          Contacta al administrador
        </span>
      </p>
    </form>
  );
}
