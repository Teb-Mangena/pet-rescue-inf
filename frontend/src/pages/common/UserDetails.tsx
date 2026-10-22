import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  ShieldCheck,
  Briefcase,
  Radio,
  Users,
  Mail,
  Copy,
  Check,
  ArrowLeft,
  Hash,
  Building2,
  CircleUser,
} from "lucide-react";
import { Link, useParams } from "react-router";
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

const ROLE_META: Record<
  string,
  {
    label: string;
    icon: typeof Briefcase;
    tone: string;
    accent: string;
    desc: string;
  }
> = {
  manager: {
    label: "Manager",
    icon: Briefcase,
    tone: "bg-amber/15 text-amber",
    accent: "text-amber",
    desc: "Can assign tasks and oversee org reports",
  },
  rescue_operator: {
    label: "Rescue Operator",
    icon: Radio,
    tone: "bg-moss/10 text-moss",
    accent: "text-moss",
    desc: "Can complete assigned tasks and update statuses",
  },
  it_admin: {
    label: "IT Admin",
    icon: ShieldCheck,
    tone: "bg-burnt/10 text-burnt",
    accent: "text-burnt",
    desc: "Full organisational control",
  },
};

function initials(first?: string, last?: string) {
  const a = (first ?? "").trim().charAt(0);
  const b = (last ?? "").trim().charAt(0);
  return (a + b).toUpperCase() || "PR";
}

function UserDetails() {
  const { id } = useParams();
  const { userDetailsQuery } = useAdminActions(Number(id));
  const { data: user, isLoading } = userDetailsQuery;

  const [copied, setCopied] = useState(false);

  function copyEmail() {
    if (!user?.email) return;
    navigator.clipboard.writeText(user.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const roleMeta = (user && ROLE_META[user.role]) ?? {
    label: user?.role ?? "—",
    icon: Users,
    tone: "bg-ink/5 text-stone",
    accent: "text-stone",
    desc: "Role permissions",
  };
  const RoleIcon = roleMeta.icon;

  return (
    <div className="min-h-screen bg-bone text-ink">
      {/* ============ HEADER ============ */}
      <section className="border-b border-ink/10 bg-bone/60 backdrop-blur-sm">
        <div className="max-w-350 mx-auto px-6 py-8">
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            animate="show"
          >
            <Link
              to="/admin/staff"
              className="inline-flex items-center gap-1.5 text-sm text-stone hover:text-ink transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to staff
            </Link>

            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                {/* avatar */}
                <div className="relative shrink-0">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt=""
                      className="w-16 h-16 rounded-2xl object-cover"
                    />
                  ) : (
                    <span className="grid place-items-center w-16 h-16 rounded-2xl bg-ink text-bone font-display font-black text-xl">
                      {initials(user?.firstname, user?.lastname)}
                    </span>
                  )}
                  <span className="absolute -bottom-1 -right-1 grid place-items-center w-6 h-6 rounded-full bg-bone border border-ink/10">
                    <RoleIcon className={`w-3.5 h-3.5 ${roleMeta.accent}`} />
                  </span>
                </div>

                <div>
                  <div
                    className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest mb-2 ${roleMeta.tone}`}
                  >
                    <RoleIcon className="w-3 h-3" />
                    {roleMeta.label}
                  </div>
                  <h1 className="font-display font-black text-3xl sm:text-4xl tracking-[-0.02em] leading-tight">
                    {isLoading
                      ? "Loading…"
                      : `${user?.firstname ?? ""} ${user?.lastname ?? ""}`.trim() ||
                        "Staff member"}
                  </h1>
                  <p className="mt-1 text-stone text-sm">
                    {user ? `Person ID #${user.person_id}` : ""}
                  </p>
                </div>
              </div>

              {/* read-only badge */}
              {/* <span className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-ink/5 text-xs font-medium text-stone">
                <Info className="w-3.5 h-3.5" />
                Read-only record
              </span> */}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ BODY ============ */}
      <section className="max-w-350 mx-auto px-6 py-10 grid lg:grid-cols-3 gap-6">
        {/* left — details */}
        <motion.div
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="show"
          className="lg:col-span-2 space-y-6"
        >
          {/* personal details */}
          <div className="rounded-2xl border border-ink/10 bg-bone p-6 sm:p-7">
            <SectionHeader
              icon={CircleUser}
              title="Personal details"
              subtitle="Staff member's account information"
            />

            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <Field label="First name" value={user?.firstname} />
              <Field label="Last name" value={user?.lastname} />
              <Field
                label="Email"
                value={user?.email}
                icon={Mail}
                copyable
                copied={copied}
                onCopy={copyEmail}
                span
              />
              <Field
                label="Person ID"
                value={user ? `#${user.person_id}` : undefined}
                icon={Hash}
                span
              />
            </div>
          </div>

          {/* role assignment */}
          <div className="rounded-2xl border border-ink/10 bg-bone p-6 sm:p-7">
            <SectionHeader
              icon={ShieldCheck}
              title="Role & access"
              subtitle="What this person can do in your org"
            />

            <div className="mt-5 flex items-center gap-4 p-4 rounded-2xl border border-ink/10 bg-bone/60">
              <span
                className={`grid place-items-center w-12 h-12 rounded-xl shrink-0 ${roleMeta.tone}`}
              >
                <RoleIcon className="w-5 h-5" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{roleMeta.label}</div>
                <div className="text-xs text-stone mt-0.5">{roleMeta.desc}</div>
              </div>
            </div>

            <p className="mt-4 text-xs text-stone">
              Roles are assigned by your organisation admin and cannot be
              changed from this page.
            </p>
          </div>
        </motion.div>

        {/* right — summary panel */}
        <motion.aside
          variants={fadeUp}
          custom={2}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          <div className="rounded-2xl border border-ink/10 bg-ink text-bone p-6 sm:p-7 overflow-hidden sticky top-24">
            <div
              aria-hidden
              className="absolute -bottom-10 -right-10 opacity-[0.06]"
            >
              <ShieldCheck className="w-48 h-48" strokeWidth={0.6} />
            </div>

            <div className="relative">
              <div className="text-amber text-[11px] font-bold uppercase tracking-widest mb-4">
                At a glance
              </div>

              <div className="space-y-4">
                <SummaryRow
                  icon={Users}
                  label="Full name"
                  value={user ? `${user.firstname} ${user.lastname}` : "—"}
                />
                <SummaryRow
                  icon={Mail}
                  label="Email"
                  value={user?.email ?? "—"}
                />
                <SummaryRow
                  icon={RoleIcon}
                  label="Role"
                  value={roleMeta.label}
                />
                <SummaryRow
                  icon={Hash}
                  label="Person ID"
                  value={user ? `#${user.person_id}` : "—"}
                />
                <SummaryRow
                  icon={Building2}
                  label="Organisation"
                  value="Your organisation"
                />
              </div>

              <div className="mt-6 pt-5 border-t border-bone/10 flex items-center justify-between text-xs text-bone/50">
                <span>Member record</span>
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber" />
                  Verified
                </span>
              </div>
            </div>
          </div>
        </motion.aside>
      </section>
    </div>
  );
}

/* ---------- helpers ---------- */

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid place-items-center w-10 h-10 rounded-xl bg-burnt/10 text-burnt shrink-0">
        <Icon className="w-5 h-5" />
      </span>
      <div>
        <h2 className="font-display font-black text-xl tracking-tight">
          {title}
        </h2>
        {subtitle && <p className="text-sm text-stone mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  icon: Icon,
  copyable,
  copied,
  onCopy,
  span,
}: {
  label: string;
  value?: string;
  icon?: React.ComponentType<{ className?: string }>;
  copyable?: boolean;
  copied?: boolean;
  onCopy?: () => void;
  span?: boolean;
}) {
  return (
    <div className={span ? "sm:col-span-2" : ""}>
      <div className="text-xs font-semibold uppercase tracking-widest text-stone mb-1.5">
        {label}
      </div>
      <div className="flex items-center gap-2 h-11 px-3 rounded-xl bg-bone border border-ink/10">
        {Icon && <Icon className="w-4 h-4 text-stone shrink-0" />}
        <span className="text-sm text-ink truncate flex-1">{value ?? "—"}</span>
        {copyable && value && onCopy && (
          <button
            type="button"
            onClick={onCopy}
            className="grid place-items-center w-7 h-7 rounded-lg text-stone hover:text-ink hover:bg-ink/5 transition-colors shrink-0"
            aria-label={`Copy ${label}`}
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-moss" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid place-items-center w-8 h-8 rounded-lg bg-bone/10 text-bone/70 shrink-0">
        <Icon className="w-4 h-4" />
      </span>
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-widest text-bone/40">
          {label}
        </div>
        <div className="text-sm text-bone/95 truncate">{value}</div>
      </div>
    </div>
  );
}

export default UserDetails;
