import { useMemo, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  PawPrint,
  Search,
  Heart,
  ArrowUpRight,
  ImageOff,
  Megaphone,
  Plus,
  Dog,
  ListChecks,
  MapPin,
  Calendar,
  Mail,
  X,
  Eye,
  MessageSquare,
} from "lucide-react";
import { Link } from "react-router";
import PageLoader from "../components/PageLoader";
import { useCommunity } from "../hooks/useCommunity";
import type { MissingPet } from "../types/missingPets";
import type { FoundPet } from "../types/foundPets";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease },
  }),
};

const TILT = [-1.5, 1, -1, 1.5, -0.8, 1.2];

function PetOwner() {
  const { allFoundPetsQuery, allMissingPetsQuery } = useCommunity();

  const lostPets: MissingPet[] = useMemo(
    () => allMissingPetsQuery.data?.missingPets ?? [],
    [allMissingPetsQuery.data],
  );

  const foundPets: FoundPet[] = useMemo(
    () => allFoundPetsQuery.data?.foundPets ?? [],
    [allFoundPetsQuery.data],
  );

  const [selectedPet, setSelectedPet] = useState<MissingPet | FoundPet | null>(
    null,
  );

  if (allFoundPetsQuery.isLoading || allMissingPetsQuery.isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="relative min-h-screen bg-bone text-ink overflow-hidden">
      {/* decorative paws */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <PawPrint className="absolute top-32 right-12 w-12 h-12 text-amber/15 rotate-[25deg]" />
        <PawPrint className="absolute top-48 left-16 w-8 h-8 text-burnt/10 rotate-[-20deg]" />
        <PawPrint className="absolute bottom-40 right-1/4 w-10 h-10 text-moss/10 rotate-[15deg]" />
        <PawPrint className="absolute bottom-24 left-1/3 w-6 h-6 text-amber/15 rotate-[-40deg]" />
      </div>

      {/* ============ HERO ============ */}
      <section className="relative max-w-[1100px] mx-auto px-6 pt-14 pb-10">
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="show"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber/15 text-amber text-xs font-bold uppercase tracking-widest mb-5">
            <PawPrint className="w-3.5 h-3.5" />
            Pet Owner
          </div>

          <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-[-0.03em] leading-[0.95]">
            Hey there,
            <br />
            <span className="text-burnt">let's keep them safe.</span>
          </h1>

          <p className="mt-5 text-lg text-stone max-w-md leading-relaxed">
            Manage your pets, report one lost, and help neighbors find their way
            home.
          </p>
        </motion.div>

        {/* actions */}
        <motion.div
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="show"
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <Link
            to="/owner/pets/new"
            className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-burnt text-bone font-medium hover:bg-burnt-deep transition-colors group"
          >
            <Plus className="w-4 h-4" />
            Add a pet
            <span className="inline-block group-hover:rotate-90 transition-transform">
              <Dog className="w-3.5 h-3.5" />
            </span>
          </Link>
          <Link
            to="/owner/pets"
            className="inline-flex items-center gap-2 h-12 px-5 rounded-full border border-ink/15 hover:border-ink/30 hover:bg-ink/5 transition-colors text-sm font-medium"
          >
            <ListChecks className="w-4 h-4" />
            My pets
          </Link>
          <Link
            to="/owner/report-lost"
            className="inline-flex items-center gap-2 h-12 px-5 rounded-full text-sm font-medium text-stone hover:text-ink hover:bg-ink/5 transition-colors"
          >
            <Megaphone className="w-4 h-4" />
            Report lost
          </Link>
        </motion.div>
      </section>

      {/* ============ LOST + FOUND ============ */}
      <section className="relative max-w-[1100px] mx-auto px-6 pb-24 space-y-10">
        {/* LOST NEARBY */}
        <motion.div
          variants={fadeUp}
          custom={2}
          initial="hidden"
          animate="show"
        >
          <div className="flex items-end justify-between mb-5 flex-wrap gap-3">
            <div>
              <h2 className="font-display font-black text-2xl sm:text-3xl tracking-tight">
                Lost nearby
              </h2>
              <p className="text-sm text-stone mt-1">
                Keep an eye out for these friends.
              </p>
            </div>
            {lostPets.length > 0 && (
              <Link
                to="/owner/lost"
                className="inline-flex items-center gap-1 text-sm font-medium text-burnt hover:text-burnt-deep transition-colors"
              >
                See all
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {lostPets.length === 0 ? (
            <PlayfulEmpty
              emoji="🐾"
              title="All quiet around here"
              subtitle="No lost pets reported nearby right now."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {lostPets.slice(0, 3).map((p, i) => (
                <PetCard
                  key={p.missing_pet_id}
                  pet={p}
                  tag="Lost"
                  tone="burnt"
                  index={i}
                  onViewDetails={() => setSelectedPet(p)}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* FOUND FRIENDS */}
        <motion.div
          variants={fadeUp}
          custom={3}
          initial="hidden"
          animate="show"
        >
          <div className="flex items-end justify-between mb-5 flex-wrap gap-3">
            <div>
              <h2 className="font-display font-black text-2xl sm:text-3xl tracking-tight">
                Found friends
              </h2>
              <p className="text-sm text-stone mt-1">
                Someone's looking for them — could it be you?
              </p>
            </div>
            {foundPets.length > 0 && (
              <Link
                to="/owner/found"
                className="inline-flex items-center gap-1 text-sm font-medium text-moss hover:text-moss/80 transition-colors"
              >
                See all
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {foundPets.length === 0 ? (
            <PlayfulEmpty
              emoji="🌟"
              title="Nothing found yet"
              subtitle="No found pets reported nearby right now."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {foundPets.slice(0, 3).map((p, i) => (
                <PetCard
                  key={p.found_pet_id}
                  pet={p}
                  tag="Found"
                  tone="moss"
                  index={i}
                  onViewDetails={() => setSelectedPet(p)}
                />
              ))}
            </div>
          )}
        </motion.div>
      </section>

      {/* ============ PET DETAILS MODAL ============ */}
      <AnimatePresence>
        {selectedPet &&
          (() => {
            const isFound = "found_pet_id" in selectedPet;
            const contact = isFound
              ? (selectedPet as FoundPet).reporter
              : selectedPet;

            return (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSelectedPet(null)}
                  className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
                />

                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.96 }}
                  transition={{ duration: 0.25, ease }}
                  className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 mx-auto max-w-xl rounded-[2rem] border border-ink/10 bg-bone shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                >
                  {/* Image Header */}
                  <div className="relative aspect-[16/9] bg-ink/5">
                    {selectedPet.image_url ? (
                      <img
                        src={selectedPet.image_url}
                        alt={selectedPet.pet_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-stone">
                        <ImageOff className="w-12 h-12" />
                      </div>
                    )}

                    <button
                      onClick={() => setSelectedPet(null)}
                      className="absolute top-4 right-4 grid place-items-center w-9 h-9 rounded-full bg-bone/80 text-ink hover:bg-bone transition-colors backdrop-blur-md"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-bone/90 text-ink backdrop-blur-md">
                      {isFound ? (
                        <>
                          <Heart className="w-3 h-3 text-moss" /> Found Pet
                        </>
                      ) : (
                        <>
                          <Search className="w-3 h-3 text-burnt" /> Lost Pet
                        </>
                      )}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="font-display font-black text-3xl tracking-tight truncate">
                        {selectedPet.pet_name}
                      </h2>
                    </div>

                    <p className="text-stone text-sm">
                      {selectedPet.species_name} · {selectedPet.colour_name}
                    </p>

                    {/* Descriptions */}
                    <div className="mt-6 space-y-3">
                      {/* About the pet */}
                      <div className="p-4 rounded-2xl bg-ink/5">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-stone mb-1">
                          About {selectedPet.pet_name}
                        </div>
                        <p className="text-sm text-ink/80 leading-relaxed italic">
                          "
                          {selectedPet.pet_description ||
                            "No description provided."}
                          "
                        </p>
                      </div>

                      {/* Finder's Note (if found) */}
                      {isFound && (selectedPet as FoundPet).description && (
                        <div className="p-4 rounded-2xl bg-moss/5 border border-moss/10">
                          <div className="text-[10px] font-bold uppercase tracking-widest text-moss mb-1 flex items-center gap-1.5">
                            <MessageSquare className="w-3 h-3" />
                            Finder's Note
                          </div>
                          <p className="text-sm text-ink/80 leading-relaxed italic">
                            "{(selectedPet as FoundPet).description}"
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Details Grid */}
                    <div className="mt-6 grid sm:grid-cols-2 gap-4">
                      <DetailRow
                        icon={MapPin}
                        label="Location"
                        value={`${selectedPet.street}, ${selectedPet.neighbourhood_name}, ${selectedPet.city_name}`}
                      />
                      <DetailRow
                        icon={Calendar}
                        label={isFound ? "Date Found" : "Date Reported"}
                        value={new Date(
                          isFound
                            ? (selectedPet as FoundPet).date_found
                            : (selectedPet as MissingPet).date_reported,
                        ).toLocaleDateString("en-ZA", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      />
                    </div>

                    {/* Contact Info */}
                    <div className="mt-6 pt-6 border-t border-ink/10">
                      <h4 className="text-[11px] uppercase tracking-widest text-stone font-bold mb-3">
                        {isFound ? "Finder's Details" : "Owner's Details"}
                      </h4>

                      <div className="flex items-center gap-3">
                        <span className="grid place-items-center w-10 h-10 rounded-full bg-ink text-bone font-display font-black text-sm">
                          {contact.firstname?.charAt(0) || "?"}
                          {contact.lastname?.charAt(0) || "?"}
                        </span>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold truncate">
                            {contact.firstname} {contact.lastname}
                          </div>
                          <div className="text-xs text-stone truncate inline-flex items-center gap-1.5 mt-0.5">
                            <Mail className="w-3 h-3" />
                            {contact.email}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            );
          })()}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Playful Pet Card ---------- */
function PetCard({
  pet,
  tag,
  tone,
  index,
  onViewDetails,
}: {
  pet: MissingPet | FoundPet;
  tag: "Lost" | "Found";
  tone: "burnt" | "moss";
  index: number;
  onViewDetails: () => void;
}) {
  const tilt = TILT[index % TILT.length];
  const isLost = tone === "burnt";

  // Extract the correct description depending on if it's a Found or Lost pet
  const description =
    "found_pet_id" in pet ? pet.description : pet.pet_description;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotate: tilt * 2 }}
      animate={{ opacity: 1, y: 0, rotate: tilt }}
      transition={{ delay: 0.05 + index * 0.08, duration: 0.5, ease }}
      whileHover={{ rotate: 0, y: -6, transition: { duration: 0.25, ease } }}
      className="group flex flex-col h-full rounded-[2rem] border border-ink/10 bg-bone overflow-hidden shadow-sm hover:shadow-xl hover:shadow-ink/5 transition-shadow"
    >
      {/* Image */}
      <div className="aspect-[4/3] bg-amber/10 relative overflow-hidden shrink-0">
        {pet.image_url ? (
          <img
            src={pet.image_url}
            alt={pet.pet_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-amber/60">
            <PawPrint className="w-12 h-12" />
          </div>
        )}

        <span
          className={`absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest backdrop-blur-md ${
            isLost ? "bg-burnt/90 text-bone" : "bg-bone/90 text-moss"
          }`}
        >
          {isLost ? (
            <Search className="w-3 h-3" />
          ) : (
            <Heart className="w-3 h-3" />
          )}
          {tag}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="font-display font-black text-xl tracking-tight leading-tight truncate">
          {pet.pet_name}
        </div>
        <div className="text-sm text-stone mt-1">
          {pet.species_name} · {pet.colour_name}
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-xs text-stone mb-4">
          <PawPrint className="w-3 h-3 shrink-0" />
          <span className="truncate">
            {pet.neighbourhood_name}, {pet.city_name}
          </span>
        </div>

        {/* Description snippet */}
        {description && (
          <p className="mt-1 mb-4 text-xs text-ink/70 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        <div className="mt-auto pt-4 border-t border-ink/5">
          <button
            onClick={onViewDetails}
            className="w-full inline-flex items-center justify-center gap-2 h-10 rounded-full bg-ink text-bone text-sm font-medium hover:bg-ink/80 transition-colors"
          >
            <Eye className="w-4 h-4" />
            {tag === "Found" ? "View finder details" : "View owner details"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------- Helper Components ---------- */
function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-2xl border border-ink/5 bg-bone">
      <span className="grid place-items-center w-8 h-8 rounded-xl bg-ink/5 text-stone shrink-0">
        <Icon className="w-4 h-4" />
      </span>
      <div className="min-w-0">
        <div className="text-[10px] font-bold uppercase tracking-widest text-stone">
          {label}
        </div>
        <div className="text-sm font-medium text-ink mt-0.5 leading-snug">
          {value}
        </div>
      </div>
    </div>
  );
}

function PlayfulEmpty({
  emoji,
  title,
  subtitle,
}: {
  emoji: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-[2rem] border border-dashed border-ink/15 bg-bone/60 py-14 text-center">
      <div className="text-5xl mb-4 animate-bob">{emoji}</div>
      <div className="font-display font-black text-xl tracking-tight">
        {title}
      </div>
      <p className="text-sm text-stone mt-2 max-w-xs mx-auto">{subtitle}</p>
    </div>
  );
}

export default PetOwner;
