import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  PawPrint,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  UserPlus,
  Smartphone,
} from "lucide-react";
import { Link } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease },
  }),
};

// Shared field styles — plain Tailwind, no daisyUI .input
const fieldBase =
  "flex items-center gap-3 h-12 w-full rounded-xl bg-base-200 border px-4 transition-all";
const fieldIdle =
  "border-ink/10 focus-within:border-burnt focus-within:ring-2 focus-within:ring-burnt/15";
const fieldError = "border-burnt-deep/60";

const inputBase =
  "grow bg-transparent outline-none text-base text-ink placeholder:text-stone/60 min-w-0";

function LoginPage() {
  const { login, isLoggingIn } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function handleUserLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    try {
      await login({ email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign you in.");
    }
  }

  return (
    <div className="min-h-screen bg-bone text-ink grid lg:grid-cols-2">
      {/* ============ LEFT — BRAND PANEL ============ */}
      <aside className="relative hidden lg:flex flex-col justify-between bg-ink text-bone p-10 xl:p-14 overflow-hidden">
        <div aria-hidden className="absolute inset-0 opacity-[0.05]">
          <PawPrint
            className="absolute -top-16 -right-16 w-80 h-80 text-bone"
            strokeWidth={0.6}
          />
          <PawPrint
            className="absolute -bottom-20 -left-16 w-96 h-96 text-bone"
            strokeWidth={0.6}
          />
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #f5f1ea 1px, transparent 1px), linear-gradient(to bottom, #f5f1ea 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        <div className="relative">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="grid place-items-center w-9 h-9 rounded-lg bg-bone text-ink group-hover:bg-amber transition-colors">
              <PawPrint className="w-4 h-4" />
            </span>
            <span className="font-display font-black text-lg tracking-tight">
              Pet Rescue
            </span>
          </Link>
        </div>

        <div className="relative max-w-md">
          <motion.h2
            variants={fadeUp}
            custom={0}
            initial="hidden"
            animate="show"
            className="font-display font-black text-4xl xl:text-5xl leading-[1.05] tracking-[-0.02em]"
          >
            Welcome back to the
            <span className="text-amber"> rescue desk.</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate="show"
            className="mt-5 text-bone/70 leading-relaxed"
          >
            Sign in with your organisation account to manage staff, assign
            tasks, and keep every report moving.
          </motion.p>

          <div className="mt-10 space-y-3">
            {[
              ["IT Admin", "Register staff and manage the org"],
              ["Manager", "Assign tasks and oversee reports"],
              ["Rescue Operator", "Complete tasks and update status"],
            ].map(([role, desc], i) => (
              <motion.div
                key={role}
                variants={fadeUp}
                custom={2 + i}
                initial="hidden"
                animate="show"
                className="flex items-center gap-3 p-3 rounded-2xl bg-bone/5 border border-bone/10"
              >
                <span className="grid place-items-center w-9 h-9 rounded-xl bg-amber/15 text-amber shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <div className="leading-tight">
                  <div className="font-semibold text-sm">{role}</div>
                  <div className="text-xs text-bone/60">{desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative text-xs text-bone/40">
          © {new Date().getFullYear()} Pet Rescue · For partner organisations
        </div>
      </aside>

      {/* ============ RIGHT — FORM ============ */}
      <main className="relative flex items-center justify-center p-6 sm:p-10">
        <Link
          to="/"
          className="absolute top-6 left-6 inline-flex items-center gap-1.5 text-sm text-stone hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          custom={0}
          className="w-full max-w-md"
        >
          {/* mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <span className="grid place-items-center w-9 h-9 rounded-lg bg-ink text-bone">
              <PawPrint className="w-4 h-4" />
            </span>
            <span className="font-display font-black text-lg tracking-tight">
              Pet Rescue
            </span>
          </div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="font-display font-black text-3xl sm:text-4xl tracking-[-0.02em]"
          >
            Sign in
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="mt-2 text-stone">
            Use your organisation credentials.
          </motion.p>

          <form onSubmit={handleUserLogin} className="mt-8 space-y-5">
            {/* email */}
            <motion.div variants={fadeUp} custom={3}>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Work email
              </label>
              <label
                className={`${fieldBase} ${error ? fieldError : fieldIdle}`}
              >
                <Mail className="w-4 h-4 text-stone shrink-0" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@rescue.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputBase}
                />
              </label>
            </motion.div>

            {/* password */}
            <motion.div variants={fadeUp} custom={4}>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-burnt hover:text-burnt-deep font-medium"
                >
                  Forgot?
                </Link>
              </div>
              <label
                className={`${fieldBase} ${error ? fieldError : fieldIdle}`}
              >
                <Lock className="w-4 h-4 text-stone shrink-0" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputBase}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="grid place-items-center w-7 h-7 rounded-full text-stone hover:text-ink hover:bg-ink/5 transition-colors shrink-0"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </label>
            </motion.div>

            {/* error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 p-3 rounded-xl bg-burnt-deep/10 text-burnt-deep text-sm"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* remember */}
            <motion.div
              variants={fadeUp}
              custom={5}
              className="flex items-center justify-between"
            >
              <label className="flex items-center gap-2.5 text-sm text-stone cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border border-ink/20 bg-base-200 accent-burnt cursor-pointer"
                />
                Keep me signed in
              </label>
            </motion.div>

            {/* submit */}
            <motion.button
              variants={fadeUp}
              custom={6}
              type="submit"
              disabled={isLoggingIn}
              className="inline-flex items-center justify-center gap-2 h-12 w-full rounded-xl bg-burnt text-bone font-medium hover:bg-burnt-deep transition-colors disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              {isLoggingIn ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-bone/40 border-t-bone animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          {/* divider */}
          <motion.div
            variants={fadeUp}
            custom={7}
            className="my-8 flex items-center gap-3 text-xs text-stone"
          >
            <span className="h-px flex-1 bg-ink/10" />
            NEW TO PET RESCUE?
            <span className="h-px flex-1 bg-ink/10" />
          </motion.div>

          {/* sign up CTA */}
          <motion.div variants={fadeUp} custom={8}>
            <Link
              to="/signup"
              className="group flex items-center gap-3 p-4 rounded-2xl border border-ink/10 bg-base-200 hover:border-burnt/40 hover:bg-base-200/70 transition-colors"
            >
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-burnt/10 text-burnt shrink-0 group-hover:bg-burnt group-hover:text-bone transition-colors">
                <UserPlus className="w-4 h-4" />
              </span>
              <div className="flex-1">
                <div className="font-semibold text-sm">
                  Create an organisation account
                </div>
                <div className="text-xs text-stone mt-0.5">
                  For IT admins, managers, and rescue operators
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-stone group-hover:text-burnt group-hover:translate-x-0.5 transition-all" />
            </Link>
          </motion.div>

          {/* app callout */}
          <motion.div
            variants={fadeUp}
            custom={9}
            className="mt-6 flex items-center justify-center gap-2 text-sm text-stone"
          >
            <Smartphone className="w-4 h-4" />
            <span>
              Not a staff member?{" "}
              <a href="#" className="link link-hover text-burnt font-medium">
                Get the Pet Rescue app
              </a>
            </span>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

export default LoginPage;
