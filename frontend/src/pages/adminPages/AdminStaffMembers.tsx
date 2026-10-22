import { useMemo, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Users,
  ShieldCheck,
  UserPlus,
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
} from "lucide-react";
import { Link } from "react-router";
import { useAdminActions } from "../../hooks/useAdminActions";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease },
  }),
};

const TONE_MAP = {
  burnt: "bg-burnt/10 text-burnt",
  amber: "bg-amber/15 text-amber",
  moss: "bg-moss/10 text-moss",
  stone: "bg-ink/5 text-stone",
} as const;

const ROLE_META: Record<
  string,
  { label: string; icon: typeof Briefcase; tone: string }
> = {
  manager: {
    label: "Manager",
    icon: Briefcase,
    tone: "bg-amber/15 text-amber",
  },
  rescue_operator: {
    label: "Rescue Operator",
    icon: Radio,
    tone: "bg-moss/10 text-moss",
  },
  it_admin: {
    label: "IT Admin",
    icon: ShieldCheck,
    tone: "bg-burnt/10 text-burnt",
  },
};

function initials(first?: string, last?: string) {
  const a = (first ?? "").trim().charAt(0);
  const b = (last ?? "").trim().charAt(0);
  return (a + b).toUpperCase() || "PR";
}

type RoleFilter = "all" | "manager" | "rescue_operator" | "it_admin";

function AdminStaffMembers() {
  const { staffMembersQuery } = useAdminActions();
  const { data: staff = [], isLoading } = staffMembersQuery;

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // --- counts ---
  const counts = useMemo(
    () => ({
      all: staff.length,
      manager: staff.filter((s) => s.role === "manager").length,
      rescue_operator: staff.filter((s) => s.role === "rescue_operator").length,
      it_admin: staff.filter((s) => s.role === "it_admin").length,
    }),
    [staff],
  );

  // --- filtered ---
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return staff.filter((p) => {
      const matchesQuery =
        !q ||
        `${p.firstname} ${p.lastname}`.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q);
      const matchesRole = roleFilter === "all" || p.role === roleFilter;
      return matchesQuery && matchesRole;
    });
  }, [staff, search, roleFilter]);

  const hasFilters = search.length > 0 || roleFilter !== "all";

  function copyEmail(email: string, id: number) {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  function clearFilters() {
    setSearch("");
    setRoleFilter("all");
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
              to="/admin"
              className="inline-flex items-center gap-1.5 text-sm text-stone hover:text-ink transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to dashboard
            </Link>

            <div className="flex flex-wrap items-start justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-ink text-bone text-[11px] font-bold uppercase tracking-widest">
                    <ShieldCheck className="w-3 h-3" />
                    IT Admin
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest text-stone">
                    <Building2 className="w-3 h-3" />
                    Your organisation
                  </span>
                </div>

                <h1 className="font-display font-black text-3xl sm:text-4xl tracking-[-0.02em]">
                  All staff
                </h1>
                <p className="mt-2 text-stone max-w-xl">
                  Everyone registered under your organisation — managers, rescue
                  operators, and admins.
                </p>
              </div>

              <Link
                to="/admin/staff/new"
                className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-burnt text-bone font-medium hover:bg-burnt-deep transition-colors group"
              >
                <UserPlus className="w-4 h-4" />
                Register staff
                <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ BODY ============ */}
      <section className="max-w-[1400px] mx-auto px-6 py-8">
        {/* role stat chips */}
        <motion.div
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        >
          <StatChip
            active={roleFilter === "all"}
            onClick={() => setRoleFilter("all")}
            icon={Users}
            label="All staff"
            count={counts.all}
            tone="stone"
          />
          <StatChip
            active={roleFilter === "manager"}
            onClick={() => setRoleFilter("manager")}
            icon={Briefcase}
            label="Managers"
            count={counts.manager}
            tone="amber"
          />
          <StatChip
            active={roleFilter === "rescue_operator"}
            onClick={() => setRoleFilter("rescue_operator")}
            icon={Radio}
            label="Operators"
            count={counts.rescue_operator}
            tone="moss"
          />
          <StatChip
            active={roleFilter === "it_admin"}
            onClick={() => setRoleFilter("it_admin")}
            icon={ShieldCheck}
            label="Admins"
            count={counts.it_admin}
            tone="burnt"
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
            <div className="flex items-center gap-3 min-w-0">
              <h2 className="font-display font-black text-xl tracking-tight">
                Staff directory
              </h2>
              <span className="text-xs text-stone px-2 py-0.5 rounded-full bg-ink/5 tabular-nums">
                {filtered.length}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* search */}
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

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
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
                  <th className="px-5 py-3 font-semibold">Person</th>
                  <th className="px-5 py-3 font-semibold">Role</th>
                  <th className="px-5 py-3 font-semibold">Email</th>
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
                        {hasFilters ? "No matches" : "No staff yet"}
                      </div>
                      <div className="text-sm text-stone mt-1 max-w-xs mx-auto">
                        {hasFilters
                          ? "Try a different search, or clear the filters."
                          : "Register your first manager or rescue operator to build your team."}
                      </div>
                      {!hasFilters && (
                        <Link
                          to="/admin/staff/new"
                          className="inline-flex items-center gap-1.5 mt-4 h-9 px-4 rounded-lg bg-burnt text-bone text-sm font-medium hover:bg-burnt-deep transition-colors"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          Register staff
                        </Link>
                      )}
                    </td>
                  </tr>
                )}

                {/* rows */}
                <AnimatePresence>
                  {!isLoading &&
                    filtered.map((p, i) => {
                      const roleMeta = ROLE_META[p.role] ?? {
                        label: p.role,
                        icon: Users,
                        tone: "bg-ink/5 text-stone",
                      };
                      const RoleIcon = roleMeta.icon;
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

                          {/* role */}
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${roleMeta.tone}`}
                            >
                              <RoleIcon className="w-3 h-3" />
                              {roleMeta.label}
                            </span>
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

                          {/* actions */}
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Link
                                to={`/user/${p.person_id}`}
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
                {staff.length === 1 ? "person" : "people"}
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
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  count: number;
  tone: keyof typeof TONE_MAP;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left p-4 rounded-2xl border transition-all ${
        active
          ? "border-burnt bg-burnt/5 ring-2 ring-burnt/15"
          : "border-ink/10 bg-bone hover:border-ink/25"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`grid place-items-center w-9 h-9 rounded-xl shrink-0 ${TONE_MAP[tone]}`}
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

export default AdminStaffMembers;
