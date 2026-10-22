import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  PawPrint,
  Mail,
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/useAuthStore";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease },
  }),
};

// ---- Palette-native strength visuals ----
const STRENGTH = {
  label: ["", "Too weak", "Getting there", "Strong password"],
  barColor: ["", "bg-burnt-deep", "bg-amber", "bg-moss"],
  textColor: ["", "text-burnt-deep", "text-amber", "text-moss"],
  width: ["w-0", "w-1/3", "w-2/3", "w-full"],
} as const;

function SignupPage() {
  const { signup, isSigningUp } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Password strength calculation (unchanged)
  const getPasswordStrength = (pwd: string): number => {
    if (pwd.length === 0) return 0;
    const hasMinLength = pwd.length >= 8;
    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    const hasSymbol = /[^a-zA-Z0-9]/.test(pwd);
    const isStrong =
      hasMinLength && hasLower && hasUpper && hasNumber && hasSymbol;
    if (!hasMinLength) return 1;
    if (!isStrong) return 2;
    return 3;
  };

  const strength = getPasswordStrength(password);
  const passwordsMatch =
    confirmPassword.length > 0 && confirmPassword === password;

  // Criteria checklist
  const criteria = [
    { label: "8+ characters", ok: password.length >= 8 },
    { label: "Uppercase letter", ok: /[A-Z]/.test(password) },
    { label: "Lowercase letter", ok: /[a-z]/.test(password) },
    { label: "Number", ok: /\d/.test(password) },
    { label: "Symbol", ok: /[^a-zA-Z0-9]/.test(password) },
  ];

  async function handleRegisterUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (confirmPassword !== password) {
      toast.error("Passwords do not match");
      return;
    }
    await signup({ firstname, lastname, email, password: confirmPassword });
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
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            animate="show"
            className="inline-flex items-center gap-2 text-amber text-xs font-bold uppercase tracking-widest mb-5"
          >
            <ShieldCheck className="w-4 h-4" />
            For rescue organisations
          </motion.div>

          <motion.h2
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate="show"
            className="font-display font-black text-4xl xl:text-5xl leading-[1.05] tracking-[-0.02em]"
          >
            Set up your
            <span className="text-amber"> rescue account.</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={2}
            initial="hidden"
            animate="show"
            className="mt-5 text-bone/70 leading-relaxed"
          >
            Your account is scoped to your organisation. An IT admin or manager
            will assign you a role after signup.
          </motion.p>

          <motion.ul
            variants={fadeUp}
            custom={3}
            initial="hidden"
            animate="show"
            className="mt-10 space-y-3"
          >
            {[
              "Access org-wide reports and tasks",
              "Assign and complete rescue tasks",
              "Keep every pet's status in sync",
            ].map((line) => (
              <li
                key={line}
                className="flex items-center gap-3 text-sm text-bone/80"
              >
                <span className="grid place-items-center w-5 h-5 rounded-full bg-moss/25 text-moss">
                  <Check className="w-3 h-3" />
                </span>
                {line}
              </li>
            ))}
          </motion.ul>
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
            Create your account
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="mt-2 text-stone">
            It only takes a minute.
          </motion.p>

          <form onSubmit={handleRegisterUser} className="mt-8 space-y-5">
            {/* name row */}
            <motion.div
              variants={fadeUp}
              custom={3}
              className="grid grid-cols-2 gap-3"
            >
              <div>
                <label
                  htmlFor="firstname"
                  className="block text-sm font-medium mb-2"
                >
                  First name
                </label>
                <label className="input input-lg w-full rounded-xl bg-base-200 border border-ink/10 focus-within:border-burnt flex items-center gap-3 transition-colors">
                  <User className="w-4 h-4 text-stone shrink-0" />
                  <input
                    id="firstname"
                    type="text"
                    autoComplete="given-name"
                    required
                    placeholder="Jane"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    className="grow bg-transparent outline-none text-base min-w-0"
                  />
                </label>
              </div>
              <div>
                <label
                  htmlFor="lastname"
                  className="block text-sm font-medium mb-2"
                >
                  Last name
                </label>
                <label className="input input-lg w-full rounded-xl bg-base-200 border border-ink/10 focus-within:border-burnt flex items-center gap-3 transition-colors">
                  <input
                    id="lastname"
                    type="text"
                    autoComplete="family-name"
                    required
                    placeholder="Doe"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    className="grow bg-transparent outline-none text-base min-w-0"
                  />
                </label>
              </div>
            </motion.div>

            {/* email */}
            <motion.div variants={fadeUp} custom={4}>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Work email
              </label>
              <label className="input input-lg w-full rounded-xl bg-base-200 border border-ink/10 focus-within:border-burnt flex items-center gap-3 transition-colors">
                <Mail className="w-4 h-4 text-stone shrink-0" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@rescue.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="grow bg-transparent outline-none text-base"
                />
              </label>
            </motion.div>

            {/* password */}
            <motion.div variants={fadeUp} custom={5}>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
              >
                Password
              </label>
              <label className="input input-lg w-full rounded-xl bg-base-200 border border-ink/10 focus-within:border-burnt flex items-center gap-3 transition-colors">
                <Lock className="w-4 h-4 text-stone shrink-0" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="grow bg-transparent outline-none text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="btn btn-ghost btn-xs btn-circle"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </label>

              {/* strength meter */}
              <AnimatePresence>
                {password.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-stone">
                          Password strength
                        </span>
                        <span
                          className={`text-xs font-semibold ${STRENGTH.textColor[strength]}`}
                        >
                          {STRENGTH.label[strength]}
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-ink/10 overflow-hidden">
                        <motion.div
                          initial={false}
                          animate={{ width: `${(strength / 3) * 100}%` }}
                          transition={{ duration: 0.35, ease }}
                          className={`h-full rounded-full ${STRENGTH.barColor[strength]}`}
                        />
                      </div>

                      {/* criteria checklist */}
                      <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5">
                        {criteria.map((c) => (
                          <li
                            key={c.label}
                            className={`flex items-center gap-1.5 text-xs transition-colors ${
                              c.ok ? "text-moss" : "text-stone"
                            }`}
                          >
                            <span
                              className={`grid place-items-center w-3.5 h-3.5 rounded-full transition-colors ${
                                c.ok
                                  ? "bg-moss text-bone"
                                  : "bg-ink/10 text-transparent"
                              }`}
                            >
                              <Check className="w-2.5 h-2.5" strokeWidth={3} />
                            </span>
                            {c.label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* confirm password */}
            <motion.div variants={fadeUp} custom={6}>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-2"
              >
                Confirm password
              </label>
              <label
                className={`input input-lg w-full rounded-xl bg-base-200 border flex items-center gap-3 transition-colors ${
                  confirmPassword.length > 0 && !passwordsMatch
                    ? "border-burnt-deep/60"
                    : passwordsMatch
                      ? "border-moss/60"
                      : "border-ink/10 focus-within:border-burnt"
                }`}
              >
                <Lock className="w-4 h-4 text-stone shrink-0" />
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="grow bg-transparent outline-none text-base"
                />
                {passwordsMatch && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="grid place-items-center w-4 h-4 rounded-full bg-moss text-bone shrink-0"
                  >
                    <Check className="w-2.5 h-2.5" strokeWidth={3} />
                  </motion.span>
                )}
              </label>
              <AnimatePresence>
                {confirmPassword.length > 0 && !passwordsMatch && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="mt-2 text-xs text-burnt-deep"
                  >
                    Passwords don't match yet.
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* terms */}
            <motion.label
              variants={fadeUp}
              custom={7}
              className="flex items-start gap-2.5 text-sm cursor-pointer select-none"
            >
              <input
                type="checkbox"
                required
                className="checkbox checkbox-sm rounded mt-0.5"
              />
              <span className="text-stone">
                I agree to the{" "}
                <a href="#" className="link link-hover text-ink font-medium">
                  Terms
                </a>{" "}
                and{" "}
                <a href="#" className="link link-hover text-ink font-medium">
                  Privacy Policy
                </a>
                .
              </span>
            </motion.label>

            {/* submit */}
            <motion.button
              variants={fadeUp}
              custom={8}
              type="submit"
              disabled={
                isSigningUp || (confirmPassword.length > 0 && !passwordsMatch)
              }
              className="btn h-12 w-full rounded-xl bg-burnt text-bone hover:bg-burnt-deep border-0 gap-2 group disabled:opacity-70"
            >
              {isSigningUp ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Creating account…
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          <motion.p
            variants={fadeUp}
            custom={9}
            className="mt-8 text-center text-sm text-stone"
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="link link-hover text-burnt font-medium"
            >
              Sign in
            </Link>
          </motion.p>
        </motion.div>
      </main>
    </div>
  );
}

export default SignupPage;
