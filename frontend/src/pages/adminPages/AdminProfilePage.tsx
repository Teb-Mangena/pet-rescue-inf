import { motion, type Variants } from "framer-motion";
import {
  PawPrint,
  Mail,
  MapPin,
  Phone,
  Building2,
  ShieldCheck,
  Pencil,
  LogOut,
  Copy,
  Check,
  Hash,
  CircleUser,
} from "lucide-react";
import { useState } from "react";
import PageLoader from "../../components/PageLoader";
import { useProfiles } from "../../hooks/useProfiles";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease },
  }),
};

const ROLE_LABEL: Record<string, string> = {
  community_member: "Community Member",
  pet_owner: "Pet Owner",
  rescue_operator: "Rescue Operator",
  it_admin: "IT Admin",
  manager: "Manager",
};

function initials(first?: string, last?: string) {
  const a = (first ?? "").trim().charAt(0);
  const b = (last ?? "").trim().charAt(0);
  return (a + b).toUpperCase() || "PR";
}

function AdminProfilePage() {
  const { profileQuery } = useProfiles();
  const { data, isLoading } = profileQuery;
  const profile = data?.profile;

  const [copied, setCopied] = useState<string | null>(null);

  function copy(value: string, key: string) {
    navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  }

  if (isLoading) return <PageLoader />;
  if (!profile) {
    return (
      <div className="min-h-screen bg-bone grid place-items-center px-6">
        <div className="max-w-sm text-center">
          <div className="grid place-items-center w-14 h-14 mx-auto rounded-2xl bg-burnt/10 text-burnt mb-4">
            <CircleUser className="w-6 h-6" />
          </div>
          <h1 className="font-display font-black text-2xl">
            Profile unavailable
          </h1>
          <p className="text-stone mt-2 text-sm">
            We couldn't load your profile details right now.
          </p>
        </div>
      </div>
    );
  }

  const roleLabel = ROLE_LABEL[profile.role] ?? profile.role;

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
            className="flex flex-wrap items-start justify-between gap-6"
          >
            <div className="flex items-center gap-5">
              {/* avatar */}
              <div className="relative">
                <span className="grid place-items-center w-16 h-16 rounded-2xl bg-ink text-bone font-display font-black text-xl">
                  {initials(profile.firstname, profile.lastname)}
                </span>
                <span className="absolute -bottom-1 -right-1 grid place-items-center w-6 h-6 rounded-full bg-bone border border-ink/10">
                  <ShieldCheck className="w-3.5 h-3.5 text-burnt" />
                </span>
              </div>

              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-burnt/10 text-burnt text-[11px] font-bold uppercase tracking-widest mb-2">
                  <ShieldCheck className="w-3 h-3" />
                  {roleLabel}
                </div>
                <h1 className="font-display font-black text-3xl sm:text-4xl tracking-[-0.02em] leading-tight">
                  {profile.firstname} {profile.lastname}
                </h1>
                <p className="mt-1 text-stone text-sm">
                  Member ID #{profile.person_id}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-ink/15 hover:border-ink/30 hover:bg-ink/5 transition-colors text-sm font-medium"
              >
                <Pencil className="w-4 h-4" />
                Edit profile
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 h-10 px-4 rounded-xl text-sm font-medium text-burnt hover:bg-burnt/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ CONTENT ============ */}
      <section className="max-w-350 mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* --- identity --- */}
          <motion.div
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate="show"
            className="lg:col-span-2 rounded-2xl border border-ink/10 bg-bone p-6 sm:p-7"
          >
            <SectionHeader
              icon={CircleUser}
              title="Personal details"
              subtitle="Your account information"
            />

            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <Field label="First name" value={profile.firstname} />
              <Field label="Last name" value={profile.lastname} />
              <Field
                label="Email"
                value={profile.email}
                icon={Mail}
                copyable
                copied={copied === "email"}
                onCopy={() => copy(profile.email, "email")}
                span
              />
              <Field
                label="Person ID"
                value={`#${profile.person_id}`}
                icon={Hash}
                span
              />
            </div>
          </motion.div>

          {/* --- quick summary card --- */}
          <motion.div
            variants={fadeUp}
            custom={2}
            initial="hidden"
            animate="show"
            className="rounded-2xl border border-ink/10 bg-ink text-bone p-6 sm:p-7 relative overflow-hidden"
          >
            <div
              aria-hidden
              className="absolute -bottom-10 -right-10 opacity-[0.06]"
            >
              <PawPrint className="w-48 h-48" strokeWidth={0.6} />
            </div>

            <div className="relative">
              <div className="inline-flex items-center gap-2 text-amber text-[11px] font-bold uppercase tracking-widest mb-4">
                <Building2 className="w-3.5 h-3.5" />
                Organisation
              </div>

              <div className="font-display font-black text-2xl leading-tight tracking-tight">
                {profile.npo_spca_name ?? "Unaffiliated"}
              </div>

              {profile.org_neighbourhood && profile.org_city && (
                <div className="mt-3 flex items-start gap-2 text-sm text-bone/70">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>
                    {profile.org_neighbourhood}, {profile.org_city}
                  </span>
                </div>
              )}

              <div className="mt-6 space-y-3 text-sm">
                {profile.org_email && (
                  <SummaryRow
                    icon={Mail}
                    label="Email"
                    value={profile.org_email}
                  />
                )}
                {profile.org_phone && (
                  <SummaryRow
                    icon={Phone}
                    label="Phone"
                    value={profile.org_phone}
                  />
                )}
                {profile.org_street && (
                  <SummaryRow
                    icon={MapPin}
                    label="Street"
                    value={profile.org_street}
                  />
                )}
              </div>

              <div className="mt-6 pt-5 border-t border-bone/10 flex items-center justify-between text-xs text-bone/50">
                <span>NPO #{profile.npo_spca_id ?? "—"}</span>
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber" />
                  Verified
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* --- organisation details (full width table) --- */}
        <motion.div
          variants={fadeUp}
          custom={3}
          initial="hidden"
          animate="show"
          className="mt-6 rounded-2xl border border-ink/10 bg-bone overflow-hidden"
        >
          <div className="p-6 sm:p-7 border-b border-ink/10">
            <SectionHeader
              icon={Building2}
              title="Organisation details"
              subtitle="Read-only — managed by your org admin"
            />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 divide-ink/5">
            <DetailCell label="NPO / SPCA name" value={profile.npo_spca_name} />
            <DetailCell label="NPO / SPCA ID" value={profile.npo_spca_id} />
            <DetailCell label="Email" value={profile.org_email} />
            <DetailCell label="Phone" value={profile.org_phone} />
            <DetailCell label="Street" value={profile.org_street} />
            <DetailCell
              label="Neighbourhood"
              value={profile.org_neighbourhood}
            />
            <DetailCell label="City" value={profile.org_city} />
            <DetailCell label="Location ID" value={profile.org_location_id} />
            <DetailCell label="City ID" value={profile.org_city_id} />
          </div>
        </motion.div>
      </section>
    </div>
  );
}

/* ---------- Small presentational helpers ---------- */

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
  value: string;
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
        <span className="text-sm text-ink truncate flex-1">{value}</span>
        {copyable && onCopy && (
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
      <span className="grid place-items-center w-7 h-7 rounded-lg bg-bone/10 text-bone/70 shrink-0">
        <Icon className="w-3.5 h-3.5" />
      </span>
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-widest text-bone/40">
          {label}
        </div>
        <div className="text-sm text-bone/90 truncate">{value}</div>
      </div>
    </div>
  );
}

function DetailCell({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  const display =
    value === null || value === undefined || value === "" ? "—" : String(value);
  return (
    <div className="p-5 border-ink/5 border-b lg:border-b-0 lg:border-r last:border-r-0">
      <div className="text-[11px] uppercase tracking-widest text-stone mb-1">
        {label}
      </div>
      <div className="text-sm text-ink truncate">{display}</div>
    </div>
  );
}

export default AdminProfilePage;
