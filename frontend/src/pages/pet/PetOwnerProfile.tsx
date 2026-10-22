import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  PawPrint,
  ArrowLeft,
  Mail,
  MapPin,
  Copy,
  Check,
  Pencil,
  LogOut,
  ShieldCheck,
  CircleUser,
} from "lucide-react";
import { Link } from "react-router";
import PageLoader from "../../components/PageLoader";
import { useProfiles } from "../../hooks/useProfiles";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease },
  }),
};

function PetOwnerProfile() {
  const { userProfileQuery } = useProfiles();
  const { data, isLoading } = userProfileQuery;
  const user = data?.user;

  const [copied, setCopied] = useState(false);

  function copyEmail() {
    if (!user?.email) return;
    navigator.clipboard.writeText(user.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (isLoading) return <PageLoader />;

  if (!user) {
    return (
      <div className="min-h-screen bg-bone grid place-items-center px-6">
        <div className="max-w-sm text-center">
          <div className="text-6xl mb-5 animate-bob">🐾</div>
          <h1 className="font-display font-black text-2xl tracking-tight">
            Profile unavailable
          </h1>
          <p className="text-stone mt-2 text-sm">
            We couldn't load your profile right now.
          </p>
        </div>
      </div>
    );
  }

  const initials =
    (user.firstname.charAt(0) + user.lastname.charAt(0)).toUpperCase() || "PR";

  const locationParts = [user.neighbourhood_name, user.city_name].filter(
    Boolean,
  );
  const hasLocation = locationParts.length > 0;

  return (
    <div className="relative min-h-screen bg-bone text-ink overflow-hidden">
      {/* decorative paws */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <PawPrint className="absolute top-32 right-12 w-12 h-12 text-amber/15 rotate-[25deg]" />
        <PawPrint className="absolute top-48 left-16 w-8 h-8 text-burnt/10 rotate-[-20deg]" />
        <PawPrint className="absolute bottom-32 left-1/4 w-10 h-10 text-moss/10 rotate-[15deg]" />
      </div>

      {/* HEADER */}
      <section className="relative max-w-[900px] mx-auto px-6 pt-12 pb-6">
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="show"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-stone hover:text-ink transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back home
          </Link>
        </motion.div>
      </section>

      {/* BODY */}
      <section className="relative max-w-[900px] mx-auto px-6 pb-24">
        {/* hero card */}
        <motion.div
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="show"
          className="rounded-[2rem] border border-ink/10 bg-ink text-bone p-8 sm:p-10 relative overflow-hidden"
        >
          <div
            aria-hidden
            className="absolute -bottom-10 -right-10 opacity-[0.06]"
          >
            <PawPrint className="w-56 h-56" strokeWidth={0.6} />
          </div>

          <div className="relative flex flex-wrap items-center gap-6">
            {/* avatar */}
            <div className="relative shrink-0">
              <span className="grid place-items-center w-20 h-20 rounded-[1.5rem] bg-bone text-ink font-display font-black text-2xl">
                {initials}
              </span>
              <span className="absolute -bottom-2 -right-2 grid place-items-center w-8 h-8 rounded-full bg-amber text-ink shadow-lg">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>

            {/* name + role */}
            <div className="min-w-0 flex-1">
              <div className="inline-flex items-center gap-1.5 text-amber text-[11px] font-bold uppercase tracking-widest mb-2">
                Pet Owner
              </div>
              <h1 className="font-display font-black text-3xl sm:text-4xl tracking-[-0.02em] leading-tight">
                {user.firstname} {user.lastname}
              </h1>
              <p className="mt-2 text-bone/60 text-sm">
                Member #{user.person_id}
              </p>
            </div>
          </div>
        </motion.div>

        {/* info cards */}
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          {/* email */}
          <motion.div
            variants={fadeUp}
            custom={2}
            initial="hidden"
            animate="show"
            className="p-6 rounded-[1.5rem] border border-ink/10 bg-bone"
          >
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-burnt/10 text-burnt">
              <Mail className="w-5 h-5" />
            </span>
            <div className="mt-4 text-[11px] uppercase tracking-widest text-stone">
              Email
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="font-medium truncate flex-1">{user.email}</span>
              <button
                type="button"
                onClick={copyEmail}
                className="grid place-items-center w-8 h-8 rounded-full text-stone hover:text-ink hover:bg-ink/5 transition-colors shrink-0"
                aria-label="Copy email"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-moss" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </motion.div>

          {/* location */}
          <motion.div
            variants={fadeUp}
            custom={3}
            initial="hidden"
            animate="show"
            className="p-6 rounded-[1.5rem] border border-ink/10 bg-bone"
          >
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-moss/10 text-moss">
              <MapPin className="w-5 h-5" />
            </span>
            <div className="mt-4 text-[11px] uppercase tracking-widest text-stone">
              Location
            </div>
            <div className="mt-1 font-medium truncate">
              {hasLocation ? locationParts.join(", ") : "Not set yet"}
            </div>
            {!hasLocation && (
              <div className="text-xs text-stone mt-1">
                Add a location to help nearby reports find you.
              </div>
            )}
          </motion.div>
        </div>

        {/* actions */}
        <motion.div
          variants={fadeUp}
          custom={4}
          initial="hidden"
          animate="show"
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <button
            type="button"
            className="inline-flex items-center gap-2 h-12 px-6 rounded-full border border-ink/15 hover:border-ink/30 hover:bg-ink/5 transition-colors text-sm font-medium"
          >
            <Pencil className="w-4 h-4" />
            Edit profile
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 h-12 px-6 rounded-full text-sm font-medium text-burnt-deep hover:bg-burnt-deep/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </motion.div>

        {/* hint */}
        <motion.div
          variants={fadeUp}
          custom={5}
          initial="hidden"
          animate="show"
          className="mt-10 flex items-start gap-3 p-4 rounded-2xl bg-amber/10 border border-amber/20"
        >
          <CircleUser className="w-5 h-5 text-amber shrink-0 mt-0.5" />
          <p className="text-sm text-ink/80">
            Your email and location are only shared with rescue operators when
            you report a pet. You can update them anytime from edit profile.
          </p>
        </motion.div>
      </section>
    </div>
  );
}

export default PetOwnerProfile;
