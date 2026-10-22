import { motion, type Variants } from "framer-motion";
import {
  PawPrint,
  ArrowLeft,
  Home,
  Search,
  Compass,
  MapPin,
} from "lucide-react";
import { Link } from "react-router";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease },
  }),
};

// Props are optional — sensible defaults for a plain 404
type ErrorPageProps = {
  status?: number;
  title?: string;
  message?: string;
};

function ErrorPage({ status = 404, title, message }: ErrorPageProps) {
  const resolvedTitle =
    title ??
    (status === 404
      ? "This page wandered off."
      : "Something slipped the leash.");

  const resolvedMessage =
    message ??
    (status === 404
      ? "We sniffed every corner, but this page doesn't live here anymore."
      : "Something went wrong on our end. Give it a moment and try again.");

  return (
    <div className="relative min-h-screen bg-bone text-ink overflow-hidden">
      {/* faint grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      {/* scattered paw prints */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {[
          {
            top: "12%",
            left: "8%",
            rotate: -25,
            size: "w-10 h-10",
            opacity: "opacity-[0.06]",
          },
          {
            top: "22%",
            left: "18%",
            rotate: 15,
            size: "w-6 h-6",
            opacity: "opacity-[0.08]",
          },
          {
            top: "70%",
            left: "12%",
            rotate: 40,
            size: "w-8 h-8",
            opacity: "opacity-[0.06]",
          },
          {
            top: "18%",
            right: "10%",
            rotate: 30,
            size: "w-9 h-9",
            opacity: "opacity-[0.07]",
          },
          {
            top: "76%",
            right: "14%",
            rotate: -20,
            size: "w-7 h-7",
            opacity: "opacity-[0.08]",
          },
          {
            top: "55%",
            right: "8%",
            rotate: 60,
            size: "w-5 h-5",
            opacity: "opacity-[0.06]",
          },
        ].map((p, i) => (
          <PawPrint
            key={i}
            className={`absolute ${p.size} ${p.opacity} text-ink`}
            style={{
              top: p.top,
              left: p.left,
              right: p.right,
              transform: `rotate(${p.rotate}deg)`,
            }}
          />
        ))}
      </div>

      {/* top nav */}
      <header className="relative max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="grid place-items-center w-8 h-8 rounded-lg bg-ink text-bone group-hover:bg-burnt transition-colors">
            <PawPrint className="w-4 h-4" />
          </span>
          <span className="font-display font-black text-lg tracking-tight">
            Pet Rescue
          </span>
        </Link>

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-stone hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back home
        </Link>
      </header>

      {/* main */}
      <main className="relative max-w-[1400px] mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-12 gap-10 items-center pt-8 md:pt-16">
          {/* LEFT — copy */}
          <div className="lg:col-span-7">
            <motion.div
              variants={fadeUp}
              custom={0}
              initial="hidden"
              animate="show"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-burnt/10 text-burnt text-xs font-semibold mb-7"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-burnt animate-pulse" />
              Error {status}
            </motion.div>

            <motion.div
              variants={fadeUp}
              custom={1}
              initial="hidden"
              animate="show"
              className="flex items-baseline gap-3"
            >
              <span className="font-display font-black text-[clamp(4rem,14vw,10rem)] leading-none tracking-[-0.04em] text-burnt">
                {status}
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={2}
              initial="hidden"
              animate="show"
              className="mt-4 font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-[-0.02em] leading-[1.05]"
            >
              {resolvedTitle}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={3}
              initial="hidden"
              animate="show"
              className="mt-5 text-lg text-ink/70 max-w-lg leading-relaxed"
            >
              {resolvedMessage}
            </motion.p>

            <motion.div
              variants={fadeUp}
              custom={4}
              initial="hidden"
              animate="show"
              className="mt-9 flex flex-wrap gap-3"
            >
              <Link
                to="/"
                className="btn h-12 px-6 rounded-xl bg-burnt text-bone hover:bg-burnt-deep border-0 gap-2 group"
              >
                <Home className="w-4 h-4" />
                Take me home
              </Link>
              <Link
                to="/login"
                className="btn h-12 px-6 rounded-xl btn-outline border-ink/20 hover:bg-ink hover:text-bone hover:border-ink gap-2"
              >
                <Compass className="w-4 h-4" />
                Go to sign in
              </Link>
            </motion.div>

            <motion.div
              variants={fadeUp}
              custom={5}
              initial="hidden"
              animate="show"
              className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone"
            >
              <span className="inline-flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5" />
                Looking for something?
              </span>
              <Link
                to="/#lost"
                className="link link-hover text-ink font-medium"
              >
                Lost pets
              </Link>
              <Link
                to="/#found"
                className="link link-hover text-ink font-medium"
              >
                Found pets
              </Link>
              <Link
                to="/#stories"
                className="link link-hover text-ink font-medium"
              >
                Reunion stories
              </Link>
            </motion.div>
          </div>

          {/* RIGHT — lost pet poster */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="lg:col-span-5"
          >
            <div className="relative mx-auto max-w-sm">
              <div className="relative rounded-[2rem] bg-ink text-bone p-6 pb-8 shadow-2xl shadow-ink/20 overflow-hidden">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-bone/50">
                  <span>Lost page</span>
                  <span>#{status}</span>
                </div>

                <div className="mt-4 aspect-square rounded-2xl bg-amber/10 grid place-items-center overflow-hidden">
                  <LostPet />
                </div>

                <div className="mt-5">
                  <div className="font-display font-black text-3xl leading-none">
                    Last seen?
                  </div>
                  <div className="text-bone/60 text-sm mt-1">
                    Somewhere between /home and /login
                  </div>
                </div>

                <motion.div
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: -8 }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                  className="absolute top-5 right-5 w-14 h-14 rounded-full bg-burnt text-bone grid place-items-center shadow-lg"
                >
                  <MapPin className="w-6 h-6" />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20, rotate: 6 }}
                animate={{ opacity: 1, x: 0, rotate: 4 }}
                transition={{ delay: 0.9, duration: 0.6, ease }}
                className="absolute -bottom-6 -left-6 bg-bone border border-ink/10 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3"
              >
                <span className="grid place-items-center w-9 h-9 rounded-full bg-amber/20 text-amber">
                  <PawPrint className="w-4 h-4" />
                </span>
                <div className="leading-tight">
                  <div className="text-xs text-stone">Reported</div>
                  <div className="font-semibold text-sm">Page not found</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="relative max-w-[1400px] mx-auto px-6 py-8 text-xs text-stone flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <PawPrint className="w-4 h-4 text-burnt" />
          <span className="font-display font-bold text-ink">Pet Rescue</span>
        </div>
        <div>© {new Date().getFullYear()} Pet Rescue</div>
      </footer>
    </div>
  );
}

function LostPet() {
  return (
    <div className="relative w-[75%] aspect-square">
      <div className="absolute inset-0 rounded-[42%_58%_55%_45%/50%_45%_55%_50%] bg-bone/40" />

      <svg
        viewBox="0 0 300 300"
        className="absolute inset-0 w-full h-full animate-bob"
      >
        <ellipse cx="150" cy="215" rx="72" ry="54" fill="#E8A33D" />
        <circle cx="150" cy="132" r="58" fill="#E8A33D" />
        <ellipse cx="150" cy="158" rx="32" ry="24" fill="#F5F1EA" />
        <ellipse cx="150" cy="149" rx="9" ry="6" fill="#1A1A1A" />
        <g className="animate-blink" style={{ transformOrigin: "118px 120px" }}>
          <circle cx="118" cy="120" r="6" fill="#1A1A1A" />
        </g>
        <g className="animate-blink" style={{ transformOrigin: "176px 120px" }}>
          <circle cx="176" cy="120" r="6" fill="#1A1A1A" />
        </g>
        <ellipse
          cx="105"
          cy="90"
          rx="20"
          ry="32"
          fill="#A63A1C"
          transform="rotate(-35 105 90)"
        />
        <ellipse
          cx="195"
          cy="92"
          rx="20"
          ry="30"
          fill="#A63A1C"
          transform="rotate(30 195 92)"
        />
        <g className="animate-wag" style={{ transformOrigin: "220px 215px" }}>
          <path
            d="M220 215 Q245 235 240 258"
            stroke="#E8A33D"
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </svg>
    </div>
  );
}

export default ErrorPage;
