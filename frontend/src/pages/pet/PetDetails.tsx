import { motion, type Variants } from "framer-motion";
import {
  PawPrint,
  ArrowLeft,
  ImageOff,
  MapPin,
  Mail,
  Phone,
  Heart,
  Megaphone,
  Pencil,
  Sparkles,
  User as UserIcon,
  Palette,
  Dog,
} from "lucide-react";
import { Link, useParams } from "react-router";
import PageLoader from "../../components/PageLoader";
import { usePetProfile } from "../../hooks/usePetProfile";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease },
  }),
};

const STATUS_META: Record<string, { label: string; tone: string }> = {
  at_home: { label: "At home", tone: "bg-moss/10 text-moss" },
  missing: { label: "Missing", tone: "bg-burnt/10 text-burnt" },
  found: { label: "Found", tone: "bg-amber/15 text-amber" },
};

function PetDetails() {
  const { id } = useParams();
  const { petProfileQuery } = usePetProfile(Number(id));
  const { data, isLoading } = petProfileQuery;
  const pet = data?.pet;

  if (isLoading) return <PageLoader />;

  if (!pet) {
    return (
      <div className="min-h-screen bg-bone grid place-items-center px-6">
        <div className="max-w-sm text-center">
          <div className="text-6xl mb-5 animate-bob">🐾</div>
          <h1 className="font-display font-black text-2xl tracking-tight">
            We couldn't find this pet
          </h1>
          <p className="text-stone mt-2 text-sm">
            It may have been removed or the link is broken.
          </p>
          <Link
            to="/owner/pets"
            className="inline-flex items-center gap-1.5 mt-6 h-11 px-5 rounded-full bg-burnt text-bone text-sm font-medium hover:bg-burnt-deep transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to my pets
          </Link>
        </div>
      </div>
    );
  }

  const statusMeta = STATUS_META[pet.pet_status] ?? {
    label: pet.pet_status,
    tone: "bg-ink/5 text-stone",
  };
  const isMissing = pet.pet_status === "missing";

  return (
    <div className="relative min-h-screen bg-bone text-ink overflow-hidden">
      {/* decorative paws */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <PawPrint className="absolute top-24 left-10 w-10 h-10 text-amber/15 rotate-[-20deg]" />
        <PawPrint className="absolute top-44 right-16 w-8 h-8 text-burnt/10 rotate-[25deg]" />
        <PawPrint className="absolute bottom-32 left-1/4 w-9 h-9 text-moss/10 rotate-[15deg]" />
      </div>

      {/* ============ HEADER ============ */}
      <section className="relative max-w-[1100px] mx-auto px-6 pt-12 pb-6">
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="show"
        >
          <Link
            to="/owner/pets"
            className="inline-flex items-center gap-1.5 text-sm text-stone hover:text-ink transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to my pets
          </Link>
        </motion.div>
      </section>

      {/* ============ HERO + INFO ============ */}
      <section className="relative max-w-[1100px] mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* LEFT — hero image */}
          <motion.div
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate="show"
            className="lg:col-span-5"
          >
            <div className="relative">
              {/* tilted photo frame */}
              <div className="rotate-[-1.5deg] rounded-[2rem] border border-ink/10 bg-bone overflow-hidden shadow-xl shadow-ink/5">
                <div className="aspect-square bg-amber/10 relative overflow-hidden">
                  {pet.pet_image_url ? (
                    <img
                      src={pet.pet_image_url}
                      alt="Pet photo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-amber/60">
                      <PawPrint className="w-20 h-20" />
                    </div>
                  )}
                </div>
              </div>

              {/* status badge — pinned to frame */}
              <span
                className={`absolute -top-3 -right-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest shadow-lg ${
                  isMissing ? "bg-burnt text-bone" : "bg-moss text-bone"
                }`}
              >
                {isMissing ? (
                  <>
                    <Megaphone className="w-3 h-3" />
                    Missing
                  </>
                ) : (
                  <>
                    <Heart className="w-3 h-3" />
                    {statusMeta.label}
                  </>
                )}
              </span>

              {/* paw stamp */}
              <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-amber/15 grid place-items-center rotate-[-8deg]">
                <PawPrint className="w-7 h-7 text-amber" />
              </div>
            </div>
          </motion.div>

          {/* RIGHT — details */}
          <motion.div
            variants={fadeUp}
            custom={2}
            initial="hidden"
            animate="show"
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber/15 text-amber text-xs font-bold uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Pet profile
            </div>

            <h1 className="font-display font-black text-4xl sm:text-5xl tracking-[-0.03em] leading-[0.95]">
              {pet.species_name} · {pet.colour_name}
            </h1>

            <p className="mt-4 text-stone max-w-md leading-relaxed">
              {pet.pet_description || "No description added yet."}
            </p>

            {/* quick facts */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              <FactCard
                icon={Dog}
                label="Species"
                value={pet.species_name}
                tone="burnt"
              />
              <FactCard
                icon={Palette}
                label="Colour"
                value={pet.colour_name}
                tone="amber"
              />
            </div>

            {/* owner */}
            <div className="mt-6 p-5 rounded-[1.5rem] border border-ink/10 bg-bone">
              <div className="text-[11px] uppercase tracking-widest text-stone mb-3">
                Owner
              </div>

              <div className="flex items-center gap-3">
                <span className="grid place-items-center w-11 h-11 rounded-full bg-ink text-bone font-display font-black">
                  {pet.owner_firstname.charAt(0)}
                  {pet.owner_lastname.charAt(0)}
                </span>
                <div className="min-w-0">
                  <div className="font-semibold truncate">
                    {pet.owner_firstname} {pet.owner_lastname}
                  </div>
                  <div className="text-xs text-stone truncate inline-flex items-center gap-1.5">
                    <Mail className="w-3 h-3" />
                    {pet.owner_email}
                  </div>
                </div>
              </div>
            </div>

            {/* actions */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {/* <Link
                to={`/owner/pets/${pet.pet_id}/edit`}
                className="inline-flex items-center gap-2 h-12 px-5 rounded-full border border-ink/15 hover:border-ink/30 hover:bg-ink/5 transition-colors text-sm font-medium"
              >
                <Pencil className="w-4 h-4" />
                Edit details
              </Link> */}

              {!isMissing && (
                <Link
                  to={`/owner/report-lost?petId=${pet.pet_id}`}
                  className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-burnt text-bone font-medium hover:bg-burnt-deep transition-colors group"
                >
                  <Megaphone className="w-4 h-4" />
                  Report lost
                  <span className="inline-block group-hover:rotate-90 transition-transform">
                    <Sparkles className="w-3.5 h-3.5" />
                  </span>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

/* ---------- helpers ---------- */

function FactCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone: "burnt" | "amber";
}) {
  const toneClass =
    tone === "burnt" ? "bg-burnt/10 text-burnt" : "bg-amber/15 text-amber";

  return (
    <div className="p-4 rounded-2xl border border-ink/10 bg-bone">
      <span
        className={`grid place-items-center w-9 h-9 rounded-xl ${toneClass}`}
      >
        <Icon className="w-4 h-4" />
      </span>
      <div className="mt-3 text-[11px] uppercase tracking-widest text-stone">
        {label}
      </div>
      <div className="font-display font-black text-lg tracking-tight truncate">
        {value}
      </div>
    </div>
  );
}

export default PetDetails;
