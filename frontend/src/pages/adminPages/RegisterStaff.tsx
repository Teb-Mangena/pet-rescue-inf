import { useState, useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import {
  UserPlus,
  Briefcase,
  Radio,
  Search,
  Check,
  ShieldCheck,
  Users,
  Mail,
  ArrowLeft,
  CircleUser,
} from "lucide-react";
import { Link, useSearchParams } from "react-router";
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

type StaffType = "rescue_operator" | "manager";

const STAFF_TYPES: {
  value: StaffType;
  label: string;
  desc: string;
  icon: typeof Briefcase;
  tone: string;
}[] = [
  {
    value: "manager",
    label: "Manager",
    desc: "Assign tasks and oversee reports",
    icon: Briefcase,
    tone: "bg-amber/15 text-amber",
  },
  {
    value: "rescue_operator",
    label: "Rescue Operator",
    desc: "Complete tasks and update status",
    icon: Radio,
    tone: "bg-moss/10 text-moss",
  },
];

function initials(first?: string, last?: string) {
  const a = (first ?? "").trim().charAt(0);
  const b = (last ?? "").trim().charAt(0);
  return (a + b).toUpperCase() || "PR";
}

function RegisterStaff() {
  const [params] = useSearchParams();
  const presetRole = params.get("role") as StaffType | null;

  const { registerStaffMutation, membersQuery } = useAdminActions();
  const { mutate, isPending } = registerStaffMutation;
  const { data, isLoading } = membersQuery;

  const [personId, setPersonId] = useState<number | null>(null);
  const [staffType, setStaffType] = useState<StaffType>(
    presetRole === "manager" || presetRole === "rescue_operator"
      ? presetRole
      : "rescue_operator",
  );
  const [search, setSearch] = useState("");

  // membersQuery returns IMember[] directly
  const members = useMemo(() => data ?? [], [data]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) =>
        `${m.firstname} ${m.lastname}`.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q),
    );
  }, [members, search]);

  const selectedPerson = members.find((m) => m.person_id === personId);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!personId) return;
    mutate({ personId, staffType });
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
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-stone hover:text-ink transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to dashboard
            </Link>

            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-burnt/10 text-burnt text-[11px] font-bold uppercase tracking-widest mb-3">
              <UserPlus className="w-3 h-3" />
              Register staff
            </div>

            <h1 className="font-display font-black text-3xl sm:text-4xl tracking-[-0.02em]">
              Add someone to your organisation
            </h1>
            <p className="mt-2 text-stone max-w-xl">
              Pick a role, then choose a person. They'll be scoped to your
              organisation once registered.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============ BODY ============ */}
      <section className="max-w-[1400px] mx-auto px-6 py-10 grid lg:grid-cols-12 gap-6">
        {/* LEFT — FORM */}
        <motion.form
          onSubmit={handleSubmit}
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="show"
          className="lg:col-span-7 space-y-6"
        >
          {/* Step 1 — role */}
          <div className="rounded-2xl border border-ink/10 bg-bone p-6 sm:p-7">
            <StepHeader n="01" title="Choose a role" />

            <div className="mt-5 grid sm:grid-cols-2 gap-3">
              {STAFF_TYPES.map((t) => {
                const Icon = t.icon;
                const active = staffType === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setStaffType(t.value)}
                    className={`relative text-left p-4 rounded-2xl border transition-all ${
                      active
                        ? "border-burnt bg-burnt/5 ring-2 ring-burnt/15"
                        : "border-ink/10 bg-bone hover:border-ink/25"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`grid place-items-center w-10 h-10 rounded-xl shrink-0 ${t.tone}`}
                      >
                        <Icon className="w-5 h-5" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm">{t.label}</div>
                        <div className="text-xs text-stone mt-0.5">
                          {t.desc}
                        </div>
                      </div>
                      {active && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="grid place-items-center w-5 h-5 rounded-full bg-burnt text-bone shrink-0"
                        >
                          <Check className="w-3 h-3" strokeWidth={3} />
                        </motion.span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2 — person */}
          <div className="rounded-2xl border border-ink/10 bg-bone p-6 sm:p-7">
            <StepHeader n="02" title="Select a person" />

            <label className="mt-5 flex items-center gap-2 h-11 px-3.5 rounded-xl bg-bone border border-ink/10 focus-within:border-burnt focus-within:ring-2 focus-within:ring-burnt/15 transition-all">
              <Search className="w-4 h-4 text-stone shrink-0" />
              <input
                type="text"
                placeholder="Search by name or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="grow bg-transparent outline-none text-sm text-ink placeholder:text-stone/60"
              />
            </label>

            <div className="mt-4 max-h-[380px] overflow-y-auto rounded-xl border border-ink/10 divide-y divide-ink/5">
              {isLoading && (
                <div className="p-10 grid place-items-center">
                  <span className="w-6 h-6 rounded-full border-2 border-ink/20 border-t-burnt animate-spin" />
                </div>
              )}

              {!isLoading && visible.length === 0 && (
                <div className="p-8 text-center">
                  <div className="grid place-items-center w-12 h-12 mx-auto rounded-2xl bg-ink/5 text-stone mb-3">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="font-medium">
                    {search ? "No matches" : "No members found"}
                  </div>
                  <div className="text-sm text-stone mt-1">
                    {search
                      ? "Try a different name or email."
                      : "There's nobody to add right now."}
                  </div>
                </div>
              )}

              {!isLoading &&
                visible.map((m) => {
                  const active = personId === m.person_id;
                  return (
                    <button
                      key={m.person_id}
                      type="button"
                      onClick={() => setPersonId(m.person_id)}
                      className={`w-full text-left flex items-center gap-3 p-3.5 transition-colors ${
                        active ? "bg-burnt/5" : "hover:bg-ink/[0.03]"
                      }`}
                    >
                      {m.profileImage ? (
                        <img
                          src={m.profileImage}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <span className="grid place-items-center w-10 h-10 rounded-full bg-ink text-bone text-xs font-bold shrink-0">
                          {initials(m.firstname, m.lastname)}
                        </span>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm truncate">
                          {m.firstname} {m.lastname}
                        </div>
                        <div className="text-xs text-stone truncate flex items-center gap-1.5">
                          <Mail className="w-3 h-3 shrink-0" />
                          {m.email}
                        </div>
                      </div>

                      <span
                        className={`grid place-items-center w-6 h-6 rounded-full transition-colors shrink-0 ${
                          active
                            ? "bg-burnt text-bone"
                            : "border border-ink/15 text-transparent"
                        }`}
                      >
                        <Check className="w-3 h-3" strokeWidth={3} />
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* submit */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={!personId || isPending}
              className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-burnt text-bone font-medium hover:bg-burnt-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-bone/40 border-t-bone animate-spin" />
                  Registering…
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Register{" "}
                  {staffType === "manager" ? "manager" : "rescue operator"}
                </>
              )}
            </button>

            <Link
              to="/"
              className="inline-flex items-center justify-center h-12 px-5 rounded-xl border border-ink/15 hover:border-ink/30 hover:bg-ink/5 transition-colors text-sm font-medium"
            >
              Cancel
            </Link>
          </div>
        </motion.form>

        {/* RIGHT — SUMMARY */}
        <motion.aside
          variants={fadeUp}
          custom={2}
          initial="hidden"
          animate="show"
          className="lg:col-span-5"
        >
          <div className="rounded-2xl border border-ink/10 bg-ink text-bone p-6 sm:p-7 relative overflow-hidden sticky top-24">
            <div
              aria-hidden
              className="absolute -bottom-10 -right-10 opacity-[0.06]"
            >
              <ShieldCheck className="w-48 h-48" strokeWidth={0.6} />
            </div>

            <div className="relative">
              <div className="text-amber text-[11px] font-bold uppercase tracking-widest mb-4">
                Summary
              </div>

              {selectedPerson ? (
                <>
                  <div className="flex items-center gap-4">
                    {selectedPerson.profileImage ? (
                      <img
                        src={selectedPerson.profileImage}
                        alt=""
                        className="w-14 h-14 rounded-2xl object-cover shrink-0"
                      />
                    ) : (
                      <span className="grid place-items-center w-14 h-14 rounded-2xl bg-bone/10 font-display font-black text-lg">
                        {initials(
                          selectedPerson.firstname,
                          selectedPerson.lastname,
                        )}
                      </span>
                    )}
                    <div className="min-w-0">
                      <div className="font-display font-black text-xl truncate">
                        {selectedPerson.firstname} {selectedPerson.lastname}
                      </div>
                      <div className="text-xs text-bone/60 truncate">
                        {selectedPerson.email}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-bone/10 space-y-3 text-sm">
                    <SummaryLine
                      label="Role"
                      value={
                        staffType === "manager" ? "Manager" : "Rescue Operator"
                      }
                    />
                    <SummaryLine
                      label="Person ID"
                      value={`#${selectedPerson.person_id}`}
                    />
                  </div>
                </>
              ) : (
                <div className="py-10">
                  <div className="grid place-items-center w-12 h-12 mx-auto rounded-2xl bg-bone/5 text-bone/40 mb-3">
                    <CircleUser className="w-5 h-5" />
                  </div>
                  <div className="text-center text-bone/60 text-sm">
                    Select a person to preview their registration.
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.aside>
      </section>
    </div>
  );
}

/* ---------- helpers ---------- */

function StepHeader({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid place-items-center w-9 h-9 rounded-xl bg-ink text-bone font-display font-black text-sm">
        {n}
      </span>
      <h2 className="font-display font-black text-xl tracking-tight">
        {title}
      </h2>
    </div>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-bone/50 text-xs uppercase tracking-widest">
        {label}
      </span>
      <span className="text-bone/95 text-sm font-medium truncate">{value}</span>
    </div>
  );
}

export default RegisterStaff;
