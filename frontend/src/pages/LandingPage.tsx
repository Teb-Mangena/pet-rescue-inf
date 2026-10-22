import { motion, type Variants } from "framer-motion";
import {
  PawPrint,
  MapPin,
  ArrowRight,
  ArrowUpRight,
  Smartphone,
  ShieldCheck,
  Heart,
  Search,
  Plus,
} from "lucide-react";
import { Link } from "react-router";
import PetHero from "../components/PetHero";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease },
  }),
};

const STATS = [
  { value: "1,204", label: "Pets reunited" },
  { value: "87", label: "Found this week" },
  { value: "12", label: "Partner shelters" },
];

const STEPS = [
  {
    n: "01",
    title: "Report",
    text: "Snap a photo, drop a pin, add a note. Takes 30 seconds.",
  },
  {
    n: "02",
    title: "Match",
    text: "Community and rescue operators cross-check reports in real time.",
  },
  {
    n: "03",
    title: "Reunite",
    text: "Get notified when there's a match. Bring them home.",
  },
];

const STORIES = [
  {
    pet: "Biscuit",
    species: "Dog",
    days: 9,
    city: "Cape Town",
    quote: "We'd almost given up. Then a neighbor scanned his tag.",
  },
  {
    pet: "Mochi",
    species: "Cat",
    days: 3,
    city: "Johannesburg",
    quote: "The rescue operator found her under a parked car.",
  },
  {
    pet: "Rex",
    species: "Dog",
    days: 21,
    city: "Durban",
    quote: "Three weeks. One photo. One call. Home.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bone text-ink overflow-x-hidden">
      {/* ============ HERO ============ */}
      <section className="relative max-w-[1400px] mx-auto px-6 pt-14 md:pt-20 pb-20">
        {/* faint grid backdrop */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        <div className="relative grid lg:grid-cols-12 gap-10 items-center">
          {/* LEFT — copy */}
          <div className="lg:col-span-7">
            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={0}
              className="inline-flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full bg-moss/10 text-moss text-xs font-semibold mb-7"
            >
              <span className="grid place-items-center w-4 h-4 rounded-full bg-moss">
                <span className="w-1.5 h-1.5 rounded-full bg-bone animate-pulse" />
              </span>
              87 pets found this week
            </motion.div>

            <h1 className="font-display font-black text-[clamp(2.75rem,7vw,6rem)] leading-[0.92] tracking-[-0.03em]">
              <motion.span
                variants={fadeUp}
                custom={1}
                initial="hidden"
                animate="show"
                className="block"
              >
                Every pet
              </motion.span>
              <motion.span
                variants={fadeUp}
                custom={2}
                initial="hidden"
                animate="show"
                className="block"
              >
                deserves a
              </motion.span>
              <motion.span
                variants={fadeUp}
                custom={3}
                initial="hidden"
                animate="show"
                className="block text-burnt"
              >
                way home.
              </motion.span>
            </h1>

            <motion.p
              variants={fadeUp}
              custom={4}
              initial="hidden"
              animate="show"
              className="mt-7 text-lg md:text-xl text-ink/70 max-w-xl leading-relaxed"
            >
              Report a lost pet, flag a found one, or help a rescue operator
              bring them back together. One community. One map. One happy ending
              at a time.
            </motion.p>

            <motion.div
              variants={fadeUp}
              custom={5}
              initial="hidden"
              animate="show"
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <a
                href="#app"
                className="btn h-12 px-6 rounded-xl bg-burnt text-bone hover:bg-burnt-deep border-0 gap-2 group"
              >
                Report a lost pet
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#found"
                className="btn h-12 px-6 rounded-xl btn-outline border-ink/20 hover:bg-ink hover:text-bone hover:border-ink gap-2"
              >
                <Search className="w-4 h-4" />
                View found pets
              </a>
            </motion.div>

            {/* mini social proof */}
            <motion.div
              variants={fadeUp}
              custom={6}
              initial="hidden"
              animate="show"
              className="mt-10 flex items-center gap-4 text-sm text-stone"
            >
              <div className="flex -space-x-2">
                {["#D4502A", "#E8A33D", "#4A5D3A", "#8A8178"].map((c) => (
                  <span
                    key={c}
                    className="w-8 h-8 rounded-full border-2 border-bone grid place-items-center"
                    style={{ backgroundColor: c }}
                  >
                    <PawPrint className="w-3.5 h-3.5 text-bone/90" />
                  </span>
                ))}
              </div>
              Trusted by 12 rescue organisations
            </motion.div>
          </div>

          {/* RIGHT — poster-style pet card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md">
              {/* poster frame */}
              <div className="relative rounded-[2rem] bg-ink text-bone p-6 pb-8 shadow-2xl shadow-ink/20 overflow-hidden">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-bone/50">
                  <span>Missing</span>
                  <span>#4821</span>
                </div>

                <div className="mt-4 aspect-square rounded-2xl bg-burnt/15 grid place-items-center overflow-hidden">
                  <PetHero />
                </div>

                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <div className="font-display font-black text-3xl leading-none">
                      Biscuit
                    </div>
                    <div className="text-bone/60 text-sm mt-1">
                      Golden retriever · 3 yrs
                    </div>
                  </div>
                  <span className="chip">Last seen 2h ago</span>
                </div>

                {/* pin badge */}
                <motion.div
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: -8 }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                  className="absolute top-5 right-5 w-14 h-14 rounded-full bg-amber text-ink grid place-items-center shadow-lg"
                >
                  <MapPin className="w-6 h-6" />
                </motion.div>
              </div>

              {/* floating "reunited" ticket */}
              <motion.div
                initial={{ opacity: 0, x: 20, rotate: 6 }}
                animate={{ opacity: 1, x: 0, rotate: 4 }}
                transition={{ delay: 0.9, duration: 0.6, ease }}
                className="absolute -bottom-6 -left-6 bg-bone border border-ink/10 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3"
              >
                <span className="grid place-items-center w-9 h-9 rounded-full bg-moss/15 text-moss">
                  <Heart className="w-4 h-4" />
                </span>
                <div className="leading-tight">
                  <div className="text-xs text-stone">Reunited</div>
                  <div className="font-semibold text-sm">Mochi is home</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ MARQUEE ============ */}
      <section className="border-y border-ink/10 bg-ink text-bone py-5 overflow-hidden">
        <div className="flex gap-10 whitespace-nowrap animate-[marquee_28s_linear_infinite] will-change-transform">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex gap-10 shrink-0">
              {[
                "Lost pets",
                "Found pets",
                "Reunion stories",
                "Rescue operators",
                "Shelters",
                "Volunteers",
                "Safe returns",
              ].map((w) => (
                <span
                  key={w}
                  className="flex items-center gap-10 font-display text-2xl md:text-3xl font-bold tracking-tight"
                >
                  {w}
                  <PawPrint className="w-5 h-5 text-amber" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="max-w-[1400px] mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ink/10">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.1, duration: 0.5, ease }}
              className="px-0 md:px-10 py-6 md:py-0 first:md:pl-0 last:md:pr-0"
            >
              <div className="font-display font-black text-5xl md:text-6xl tracking-tight">
                {s.value}
              </div>
              <div className="mt-2 text-stone">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="max-w-[1400px] mx-auto px-6 pb-24">
        <div className="flex items-end justify-between mb-14 flex-wrap gap-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="font-display font-black text-4xl md:text-6xl tracking-[-0.02em]"
          >
            How it works
          </motion.h2>
          <p className="text-stone max-w-sm">
            Three steps. No forms nobody reads. No waiting rooms.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.12, duration: 0.55, ease }}
              className="relative p-8 rounded-2xl border border-ink/10 bg-base-200 hover:bg-bone hover:border-ink/20 transition-colors group"
            >
              <div className="font-display font-black text-6xl text-burnt/25 group-hover:text-burnt transition-colors">
                {step.n}
              </div>
              <h3 className="mt-4 font-display font-bold text-2xl">
                {step.title}
              </h3>
              <p className="mt-2 text-ink/70 leading-relaxed">{step.text}</p>
              <ArrowUpRight className="absolute top-6 right-6 w-5 h-5 text-stone group-hover:text-burnt group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ REUNION STORIES ============ */}
      <section id="stories" className="bg-base-200 border-y border-ink/10">
        <div className="max-w-[1400px] mx-auto px-6 py-24">
          <div className="flex items-end justify-between mb-14 flex-wrap gap-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease }}
              className="font-display font-black text-4xl md:text-6xl tracking-[-0.02em]"
            >
              Happy endings
            </motion.h2>
            <a
              href="#"
              className="link link-hover text-burnt font-medium inline-flex items-center gap-1"
            >
              All stories <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {STORIES.map((s, i) => (
              <motion.article
                key={s.pet}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.12, duration: 0.55, ease }}
                className="p-7 rounded-2xl bg-bone border border-ink/10 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/5 transition-all"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-moss mb-4">
                  <span className="grid place-items-center w-5 h-5 rounded-full bg-moss/15">
                    <Heart className="w-3 h-3" />
                  </span>
                  REUNITED IN {s.days} DAYS
                </div>
                <div className="font-display font-black text-3xl tracking-tight">
                  {s.pet}
                </div>
                <div className="text-sm text-stone mt-1 mb-5">
                  {s.species} · {s.city}
                </div>
                <p className="text-ink/80 italic leading-relaxed">
                  "{s.quote}"
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FOR SHELTERS ============ */}
      <section id="shelters" className="max-w-[1400px] mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease }}
          className="relative rounded-[2rem] bg-ink text-bone overflow-hidden"
        >
          {/* decorative paw pattern */}
          <div aria-hidden className="absolute inset-0 opacity-[0.06]">
            <PawPrint
              className="absolute -top-10 -right-10 w-72 h-72 text-bone"
              strokeWidth={0.6}
            />
            <PawPrint
              className="absolute -bottom-16 -left-10 w-80 h-80 text-bone"
              strokeWidth={0.6}
            />
          </div>

          <div className="relative grid lg:grid-cols-2 gap-10 p-10 md:p-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-amber text-xs font-bold uppercase tracking-widest mb-4">
                <ShieldCheck className="w-4 h-4" />
                For rescue organisations
              </div>
              <h2 className="font-display font-black text-4xl md:text-5xl tracking-[-0.02em] leading-[1.05]">
                Run your rescue.
                <br />
                Not your spreadsheets.
              </h2>
              <p className="mt-5 text-bone/70 max-w-md leading-relaxed">
                Manage staff, assign tasks, and track every report in one place.
                Built for IT admins, managers, and rescue operators.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/login"
                  className="btn h-12 px-6 rounded-xl bg-amber text-ink hover:bg-bone border-0 gap-2 group"
                >
                  Org sign in
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#"
                  className="btn h-12 px-6 rounded-xl btn-outline border-bone/25 text-bone hover:bg-bone hover:text-ink hover:border-bone"
                >
                  Request access
                </a>
              </div>
            </div>

            {/* role chips */}
            <div className="space-y-3">
              {[
                ["IT Admin", "Register staff, manage the org"],
                ["Manager", "Assign tasks, oversee reports"],
                ["Rescue Operator", "Complete tasks, update status"],
              ].map(([role, desc], i) => (
                <motion.div
                  key={role}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.1, duration: 0.5, ease }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-bone/5 border border-bone/10 backdrop-blur-sm"
                >
                  <span className="grid place-items-center w-10 h-10 rounded-xl bg-amber/15 text-amber shrink-0">
                    <PawPrint className="w-5 h-5" />
                  </span>
                  <div>
                    <div className="font-semibold">{role}</div>
                    <div className="text-sm text-bone/60">{desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ============ APP DOWNLOAD ============ */}
      <section id="app" className="max-w-[1400px] mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease }}
          className="rounded-[2rem] border border-ink/10 bg-base-200 p-10 md:p-16 grid lg:grid-cols-2 gap-10 items-center"
        >
          <div>
            <div className="inline-flex items-center gap-2 text-burnt text-xs font-bold uppercase tracking-widest mb-4">
              <Smartphone className="w-4 h-4" />
              Get the app
            </div>
            <h2 className="font-display font-black text-4xl md:text-5xl tracking-[-0.02em] leading-[1.05]">
              The whole community,
              <br />
              in your pocket.
            </h2>
            <p className="mt-5 text-ink/70 max-w-md leading-relaxed">
              Report lost pets, flag found ones, and read reunion stories. Free,
              always.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#"
                className="btn h-12 px-6 rounded-xl bg-ink text-bone hover:bg-burnt border-0"
              >
                App Store
              </a>
              <a
                href="#"
                className="btn h-12 px-6 rounded-xl bg-ink text-bone hover:bg-burnt border-0"
              >
                Google Play
              </a>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-44 h-44 rounded-3xl bg-bone border-2 border-dashed border-ink/20 grid place-items-center">
                <div className="text-center">
                  <Plus className="w-6 h-6 mx-auto text-stone" />
                  <div className="mt-1 text-xs font-semibold tracking-widest text-stone">
                    QR CODE
                  </div>
                </div>
              </div>
              <motion.div
                initial={{ scale: 0, rotate: 20 }}
                whileInView={{ scale: 1, rotate: 10 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-burnt text-bone grid place-items-center shadow-lg"
              >
                <PawPrint className="w-5 h-5" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
