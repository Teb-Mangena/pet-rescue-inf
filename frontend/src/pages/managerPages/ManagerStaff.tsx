import { useMemo, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Users,
  ShieldCheck,
  Briefcase,
  Radio,
  Search,
  Mail,
  Copy,
  Check,
  ArrowLeft,
  ArrowUpRight,
  MoreHorizontal,
  Building2,
  Inbox,
  X,
  ClipboardList,
} from "lucide-react";
import { Link } from "react-router";
import { useManagerActions } from "../../hooks/useManagerActions";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease },
  }),
};

function initials(first?: string, last?: string) {
  const a = (first ?? "").trim().charAt(0);
  const b = (last ?? "").trim().charAt(0);
  return (a + b).toUpperCase() || "PR";
}

function ManagerStaff() {
  const { staffQuery } = useManagerActions();
  const { data: staff = [], isLoading } = staffQuery;

  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // --- filtered ---
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return staff;
    return staff.filter(
      (p) =>
        `${p.firstname} ${p.lastname}`.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q),
    );
  }, [staff, search]);

  function copyEmail(email: string, id: number) {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  return (
    <div className="min-h-screen bg-bone text-ink">
      {/* ============ HEADER ============ */}
      <section className="border-b border-ink/10 bg-bone/60 backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto px-6 py-8">
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            animate="show"
          >
            <Link
              to="/manager"
              className="inline-flex items-center gap-1.5 text-sm text-stone hover:text-ink transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to dashboard
            </Link>

            <div className="flex flex-wrap items-start justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber/15 text-amber text-[11px] font-bold uppercase tracking-widest">
                    <Briefcase className="w-3 h-3" />
                    Manager
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest text-stone">
                    <Building2 className="w-3 h-3" />
                    Your organisation
                  </span>
                </div>

                <h1 className="font-display font-black text-3xl sm:text-4xl tracking-[-0.02em]">
                  Rescue operators
                </h1>
                <p className="mt-2 text-stone max-w-xl">
                  Everyone you can assign tasks to. Click a name to see their
                  details.
                </p>
              </div>

              <Link
                to="/manager/tasks/new"
                className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-burnt text-bone font-medium hover:bg-burnt-deep transition-colors group"
              >
                <ClipboardList className="w-4 h-4" />
                Assign a task
                <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ BODY ============ */}
      <section className="max-w-[1400px] mx-auto px-6 py-8">
        {/* stat chips */}
        <motion.div
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          <StatChip
            active={!search}
            onClick={() => setSearch("")}
            icon={Radio}
            label="Rescue operators"
            count={staff.length}
            tone="moss"
          />
          <StatChip
            active={!!search}
            onClick={() => setSearch(" ")}
            icon={Users}
            label="Filtered"
            count={filtered.length}
            tone="stone"
            disabled={!search}
          />
        </motion.div>

        {/* table card */}
        <motion.div
          variants={fadeUp}
          custom={2}
          initial="hidden"
          animate="show"
          className="mt-6 rounded-2xl border border-ink/10 bg-bone overflow-hidden"
        >
          {/* toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-ink/10">
            <div className="flex items-center gap-3">
              <h2 className="font-display font-black text-xl tracking-tight">
                Operator directory
              </h2>
              <span className="text-xs text-stone px-2 py-0.5 rounded-full bg-ink/5 tabular-nums">
                {filtered.length}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-2 h-9 px-3 rounded-lg bg-bone border border-ink/10 focus-within:border-burnt focus-within:ring-2 focus-within:ring-burnt/15 transition-all">
                <Search className="w-4 h-4 text-stone shrink-0" />
                <input
                  type="text"
                  placeholder="Search name or email…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-44 sm:w-56 bg-transparent outline-none text-sm text-ink placeholder:text-stone/60"
                />
              </label>

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-medium text-stone hover:text-ink hover:bg-ink/5 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-widest text-stone border-b border-ink/10">
                  <th className="px-5 py-3 font-semibold">Operator</th>
                  <th className="px-5 py-3 font-semibold">Email</th>
                  <th className="px-5 py-3 font-semibold">Role</th>
                  <th className="px-5 py-3 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* loading */}
                {isLoading && (
                  <tr>
                    <td colSpan={4} className="px-5 py-16 text-center">
                      <span className="inline-block w-6 h-6 rounded-full border-2 border-ink/20 border-t-burnt animate-spin" />
                    </td>
                  </tr>
                )}

                {/* empty */}
                {!isLoading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-16 text-center">
                      <div className="grid place-items-center w-12 h-12 mx-auto rounded-2xl bg-ink/5 text-stone mb-3">
                        <Inbox className="w-5 h-5" />
                      </div>
                      <div className="font-medium">
                        {search ? "No matches" : "No operators yet"}
                      </div>
                      <div className="text-sm text-stone mt-1 max-w-xs mx-auto">
                        {search
                          ? "Try a different name or email."
                          : "Your admin hasn't registered any rescue operators yet."}
                      </div>
                    </td>
                  </tr>
                )}

                {/* rows */}
                <AnimatePresence>
                  {!isLoading &&
                    filtered.map((p, i) => {
                      const copied = copiedId === p.person_id;

                      return (
                        <motion.tr
                          key={p.person_id}
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{
                            delay: 0.05 + i * 0.035,
                            duration: 0.3,
                            ease,
                          }}
                          className="border-b border-ink/5 last:border-0 hover:bg-bone/60 transition-colors group"
                        >
                          {/* person */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <span className="grid place-items-center w-9 h-9 rounded-full bg-ink text-bone text-xs font-bold shrink-0">
                                {initials(p.firstname, p.lastname)}
                              </span>
                              <div className="min-w-0">
                                <div className="font-medium truncate">
                                  {p.firstname} {p.lastname}
                                </div>
                                <div className="text-xs text-stone">
                                  #{p.person_id}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* email */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <Mail className="w-3.5 h-3.5 text-stone shrink-0" />
                              <span className="text-stone truncate">
                                {p.email}
                              </span>
                              <button
                                type="button"
                                onClick={() => copyEmail(p.email, p.person_id)}
                                className="grid place-items-center w-6 h-6 rounded-md text-stone hover:text-ink hover:bg-ink/5 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                aria-label="Copy email"
                              >
                                {copied ? (
                                  <Check className="w-3 h-3 text-moss" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* role */}
                          <td className="px-5 py-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-moss/10 text-moss">
                              <Radio className="w-3 h-3" />
                              Rescue Operator
                            </span>
                          </td>

                          {/* actions */}
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Link
                                to={`/manager/operators/${p.person_id}`}
                                className="hidden sm:inline-flex items-center h-8 px-3 rounded-lg text-xs font-medium text-burnt hover:bg-burnt/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                              >
                                View
                              </Link>
                              <button
                                type="button"
                                className="grid place-items-center w-8 h-8 rounded-lg text-stone hover:text-ink hover:bg-ink/5 transition-colors"
                                aria-label="Row actions"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* footer */}
          {!isLoading && filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-ink/10 flex items-center justify-between text-xs text-stone">
              <span>
                Showing{" "}
                <span className="text-ink font-medium">{filtered.length}</span>{" "}
                of <span className="text-ink font-medium">{staff.length}</span>{" "}
                {staff.length === 1 ? "operator" : "operators"}
              </span>
              <span className="hidden sm:inline">
                Scoped to your organisation
              </span>
            </div>
          )}
        </motion.div>
      </section>
    </div>
  );
}

/* ---------- helpers ---------- */

function StatChip({
  active,
  onClick,
  icon: Icon,
  label,
  count,
  tone,
  disabled,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  count: number;
  tone: "moss" | "stone";
  disabled?: boolean;
}) {
  const toneClass =
    tone === "moss" ? "bg-moss/10 text-moss" : "bg-ink/5 text-stone";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`text-left p-4 rounded-2xl border transition-all disabled:opacity-60 disabled:cursor-default ${
        active
          ? "border-burnt bg-burnt/5 ring-2 ring-burnt/15"
          : "border-ink/10 bg-bone hover:border-ink/25"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`grid place-items-center w-9 h-9 rounded-xl shrink-0 ${toneClass}`}
        >
          <Icon className="w-4 h-4" />
        </span>
        <span className="font-display font-black text-2xl tracking-tight tabular-nums">
          {count}
        </span>
      </div>
      <div className="mt-3 text-sm font-medium text-ink">{label}</div>
    </button>
  );
}

export default ManagerStaff;
