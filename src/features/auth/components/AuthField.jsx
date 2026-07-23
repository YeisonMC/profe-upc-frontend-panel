import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export function AuthField({
  label,
  labelAction,
  name,
  type = "text",
  value,
  placeholder,
  autoComplete,
  inputMode,
  icon: Icon,
  trailingAction,
  error,
  disabled = false,
  onChange,
  onBlur,
}) {
  const shouldReduceMotion = useReducedMotion();
  const errorId = `${name}-error`;

  const fieldClasses = [
    "relative flex min-h-11 items-center rounded-[10px] border bg-white",
    "transition-[border-color,box-shadow,background-color] duration-150",
    "focus-within:ring-4",
    error
      ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500/10"
      : "border-zinc-200 hover:border-zinc-300 focus-within:border-upc-red focus-within:ring-upc-red/10",
    disabled ? "cursor-not-allowed bg-zinc-100 opacity-70" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const inputClasses = [
    "peer h-10 w-full border-0 bg-transparent py-2.5 pl-10",
    trailingAction ? "pr-11" : "pr-3",
    "text-[13px] font-normal text-zinc-800 outline-none",
    "placeholder:text-zinc-400",
    "disabled:cursor-not-allowed",
  ].join(" ");

  return (
    <div>
      <div className="mb-1.5 flex min-h-5 items-center justify-between gap-3">
        <label
          htmlFor={name}
          className="text-[13px] font-medium leading-5 text-zinc-800"
        >
          {label}
        </label>

        {labelAction}
      </div>

      <div className={fieldClasses}>
        <Icon
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 h-[15px] w-[15px] text-zinc-400"
          strokeWidth={1.8}
        />

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          disabled={disabled}
          required
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={inputClasses}
          onChange={onChange}
          onBlur={onBlur}
        />

        {trailingAction ? (
          <div className="absolute right-1.5 flex items-center">
            {trailingAction}
          </div>
        ) : null}
      </div>

      <AnimatePresence initial={false}>
        {error ? (
          <motion.p
            id={errorId}
            role="alert"
            initial={
              shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }
            }
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -3 }}
            transition={{ duration: 0.16 }}
            className="mt-1.5 text-xs leading-4 text-red-600"
          >
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
