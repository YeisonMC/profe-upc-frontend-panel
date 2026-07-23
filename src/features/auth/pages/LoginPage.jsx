import { motion, useReducedMotion } from "framer-motion";

import { LoginForm } from "../components/LoginForm.jsx";

export function LoginPage() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      aria-labelledby="login-title"
      initial={
        shouldReduceMotion
          ? { opacity: 0 }
          : {
              opacity: 0,
              y: 12,
            }
      }
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: shouldReduceMotion ? 0.12 : 0.26,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <header>
        <h1
          id="login-title"
          className="font-display text-[27px] font-extrabold leading-[1.15] tracking-[-0.045em] text-zinc-900 sm:text-[28px]"
        >
          Inicia sesión
        </h1>

        <p className="mt-2 max-w-[300px] text-[12px] leading-[18px] text-zinc-500 sm:text-[13px] sm:leading-5">
          Ingresa con tu cuenta autorizada del equipo de moderación.
        </p>
      </header>

      <LoginForm />
    </motion.section>
  );
}
