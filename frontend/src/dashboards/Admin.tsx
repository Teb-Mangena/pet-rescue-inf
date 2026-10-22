import { useMemo, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Users,
  ShieldCheck,
  UserPlus,
  Briefcase,
  Radio,
  TrendingUp,
  ArrowUpRight,
  Search,
  MoreHorizontal,
  Mail,
  Copy,
  Check,
  Building2,
  Inbox,
} from "lucide-react";
import { Link } from "react-router";
import { useAdminActions } from "../hooks/useAdminActions";

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

type RoleFilter = "all" | "manager" | "rescue_operator";

function Admin() {
  const { recentStaffQuery, staffMembersQuery } = useAdminActions();
  const { data: recentStaff = [], isLoading: loadingRecent } = recentStaffQuery;
  const { data: staff = [], isLoading: loadingStaff } = staffMembersQuery;

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // --- derived stats ---
  const stats = useMemo(() => {
    const managers = staff.filter((s) => s.role === "manager").length;
    const operators = staff.filter((s) => s.role === "rescue_operator").length;
    const admins = staff.filter((s) => s.role === "it_admin").length;
    return {
      total: staff.length,
      managers,
      operators,
      admins,
    };
  }, [staff]);

  const STATS = [
    {
      label: "Total staff",
      value: stats.total,
      delta: "Across all roles",
      icon: Users,
      tone: "burnt" as const,
    },
    {
      label: "Managers",
      value: stats.managers,
      delta: "Task & reporting access",
      icon: Briefcase,
      tone: "amber" as const,
    },
    {
      label: "Rescue operators",
      value: stats.operators,
      delta: "Field operators",
      icon: Radio,
      tone: "moss" as const,
    },
    {
      label: "Recent additions",
      value: recentStaff.length,
      delta: "Latest joined",
      icon: TrendingUp,
      tone: "stone" as const,
    },
  ];

  // --- filtered recent staff ---
  const filteredRecent = useMemo(() => {
    const q = search.trim().toLowerCase();
    return recentStaff.filter((p) => {
      const matchesQuery =
        !q ||
        `${p.firstname} ${p.lastname}`.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q);
      const matchesRole = roleFilter === "all" || p.role === roleFilter;
      return matchesQuery && matchesRole;
    });
  }, [recentStaff, search, roleFilter]);

  // --- org name (from any staff record that has it) ---
  const orgName =
    staff.find((s) => s.npo_spca_id)?.npo_spca_id && "Your organisation";

  const isLoadingAny = loadingStaff || loadingRecent;

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
            className="flex flex-wrap items-start justify-between gap-6"
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-ink text-bone text-[11px] font-bold uppercase tracking-widest">
                  <ShieldCheck className="w-3 h-3" />
                  IT Admin
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest text-stone">
                  <Building2 className="w-3 h-3" />
                  {orgName}
                </span>
              </div>

              <h1 className="font-display font-black text-3xl sm:text-4xl tracking-[-0.02em]">
                Organisational control
              </h1>
              <p className="mt-2 text-stone max-w-xl">
                Register staff, manage roles, and keep your rescue organisation
                running smoothly.
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
          </motion.div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="max-w-[1400px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                variants={fadeUp}
                custom={1 + i}
                initial="hidden"
                animate="show"
                className="p-5 rounded-2xl border border-ink/10 bg-bone hover:border-ink/20 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <span
                    className={`grid place-items-center w-10 h-10 rounded-xl ${TONE_MAP[s.tone]}`}
                  >
                    <Icon className="w-5 h-5" />
                  </span>
                  <TrendingUp className="w-4 h-4 text-stone" />
                </div>
                <div className="mt-4">
                  <div className="font-display font-black text-3xl tracking-tight text-ink tabular-nums">
                    {isLoadingAny ? (
                      <span className="inline-block w-8 h-8 rounded-md bg-ink/5 animate-pulse" />
                    ) : (
                      s.value
                    )}
                  </div>
                  <div className="mt-1 text-sm font-medium text-ink">
                    {s.label}
                  </div>
                  <div className="text-xs text-stone mt-1.5">{s.delta}</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* role distribution bar */}
        {!loadingStaff && stats.total > 0 && (
          <motion.div
            variants={fadeUp}
            custom={5}
            initial="hidden"
            animate="show"
            className="mt-6 p-5 rounded-2xl border border-ink/10 bg-bone"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-stone">
                Role distribution
              </span>
              <span className="text-xs text-stone">
                {stats.total} {stats.total === 1 ? "person" : "people"}
              </span>
            </div>

            <div className="h-2 w-full rounded-full bg-ink/5 overflow-hidden flex">
              {stats.managers > 0 && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(stats.managers / stats.total) * 100}%`,
                  }}
                  transition={{ duration: 0.6, ease }}
                  className="h-full bg-amber"
                />
              )}
              {stats.operators > 0 && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(stats.operators / stats.total) * 100}%`,
                  }}
                  transition={{ duration: 0.6, delay: 0.1, ease }}
                  className="h-full bg-moss"
                />
              )}
              {stats.admins > 0 && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(stats.admins / stats.total) * 100}%`,
                  }}
                  transition={{ duration: 0.6, delay: 0.2, ease }}
                  className="h-full bg-burnt"
                />
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-stone">
              <Legend
                color="bg-amber"
                label="Managers"
                count={stats.managers}
              />
              <Legend
                color="bg-moss"
                label="Operators"
                count={stats.operators}
              />
              <Legend color="bg-burnt" label="Admins" count={stats.admins} />
            </div>
          </motion.div>
        )}
      </section>

      {/* ============ QUICK ACTIONS ============ */}
      <section className="max-w-[1400px] mx-auto px-6 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              to: "/admin/staff/new?role=manager",
              icon: Briefcase,
              title: "Register a manager",
              desc: "Grant task and reporting privileges",
              tone: "amber" as const,
            },
            {
              to: "/admin/staff/new?role=rescue_operator",
              icon: Radio,
              title: "Register a rescue operator",
              desc: "Add a field operator to your org",
              tone: "moss" as const,
            },
            {
              to: "/admin/staff",
              icon: Users,
              title: "View all staff",
              desc: "Browse, filter, and manage your team",
              tone: "burnt" as const,
            },
          ].map((a, i) => {
            const Icon = a.icon;
            return (
              <motion.div
                key={a.title}
                variants={fadeUp}
                custom={6 + i}
                initial="hidden"
                animate="show"
              >
                <Link
                  to={a.to}
                  className="group flex items-center gap-4 p-5 rounded-2xl border border-ink/10 bg-bone hover:border-burnt/40 hover:bg-bone/60 transition-colors"
                >
                  <span
                    className={`grid place-items-center w-12 h-12 rounded-xl shrink-0 ${TONE_MAP[a.tone]} group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-5 h-5" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold">{a.title}</div>
                    <div className="text-sm text-stone mt-0.5 truncate">
                      {a.desc}
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-stone group-hover:text-burnt group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ============ RECENT STAFF ============ */}
      <section className="max-w-[1400px] mx-auto px-6 pb-20">
        <motion.div
          variants={fadeUp}
          custom={9}
          initial="hidden"
          animate="show"
          className="rounded-2xl border border-ink/10 bg-bone overflow-hidden"
        >
          {/* table header */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-5 border-b border-ink/10">
            <div>
              <h2 className="font-display font-black text-xl tracking-tight">
                Recent staff
              </h2>
              <p className="text-sm text-stone mt-0.5">
                Latest people added to your organisation
              </p>
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
                  className="w-40 sm:w-52 bg-transparent outline-none text-sm text-ink placeholder:text-stone/60"
                />
              </label>

              <Link
                to="/admin/staff"
                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm font-medium text-burnt hover:bg-burnt/10 transition-colors"
              >
                View all
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* role filter chips */}
          <div className="flex flex-wrap items-center gap-2 px-5 py-3 border-b border-ink/10 bg-bone/40">
            <span className="text-[11px] uppercase tracking-widest text-stone">
              Filter
            </span>
            {(
              [
                ["all", "All"],
                ["manager", "Managers"],
                ["rescue_operator", "Operators"],
              ] as const
            ).map(([value, label]) => {
              const active = roleFilter === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRoleFilter(value)}
                  className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                    active
                      ? "bg-ink text-bone"
                      : "bg-ink/5 text-stone hover:bg-ink/10"
                  }`}
                >
                  {label}
                </button>
              );
            })}
            {search && (
              <span className="ml-auto text-xs text-stone">
                {filteredRecent.length} of {recentStaff.length}
              </span>
            )}
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
                {loadingRecent && (
                  <tr>
                    <td colSpan={4} className="px-5 py-16 text-center">
                      <span className="inline-block w-6 h-6 rounded-full border-2 border-ink/20 border-t-burnt animate-spin" />
                    </td>
                  </tr>
                )}

                {/* empty */}
                {!loadingRecent && filteredRecent.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-16 text-center">
                      <div className="grid place-items-center w-12 h-12 mx-auto rounded-2xl bg-ink/5 text-stone mb-3">
                        <Inbox className="w-5 h-5" />
                      </div>
                      <div className="font-medium">
                        {search || roleFilter !== "all"
                          ? "No matches"
                          : "No staff yet"}
                      </div>
                      <div className="text-sm text-stone mt-1 max-w-xs mx-auto">
                        {search || roleFilter !== "all"
                          ? "Try a different search or clear the filters."
                          : "Register your first manager or rescue operator to get started."}
                      </div>
                      {!search && roleFilter === "all" && (
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
                  {!loadingRecent &&
                    filteredRecent.map((p, i) => {
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
                            delay: 0.05 + i * 0.04,
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

                          {/* role badge */}
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${roleMeta.tone}`}
                            >
                              <RoleIcon className="w-3 h-3" />
                              {roleMeta.label}
                            </span>
                          </td>

                          {/* email with copy */}
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
        </motion.div>
      </section>
    </div>
  );
}

/* ---------- helpers ---------- */

function Legend({
  color,
  label,
  count,
}: {
  color: string;
  label: string;
  count: number;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      {label}
      <span className="text-ink font-medium tabular-nums">{count}</span>
    </span>
  );
}

export default Admin;
