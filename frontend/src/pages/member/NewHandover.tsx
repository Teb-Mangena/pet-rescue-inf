import { useState, useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import {
  ArrowLeft,
  ArrowRightLeft,
  PawPrint,
  Search,
  Building2,
  MapPin,
  Mail,
  ChevronDown,
  AlertCircle,
  Check,
  Heart,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import PageLoader from "../../components/PageLoader";
import { useHandovers } from "../../hooks/useHandovers";
import { useCommunity } from "../../hooks/useCommunity";
import type { MissingPet } from "../../types/missingPets";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease },
  }),
};

// Mocking NPOs for the dropdown since we don't have a hook for it yet
const MOCK_NPOS = [
  {
    id: 1,
    name: "Beacon Bay Vet Clinic",
    street: "Bonza Bay Road",
    neighbourhood: "Beacon Bay",
    city: "East London",
    email: "info@beaconbayvet.co.za",
  },
  {
    id: 2,
    name: "East London Pet Rescue",
    street: "Main Road",
    neighbourhood: "Gonubie",
    city: "East London",
    email: "info@eastlondonpetrescue.co.za",
  },
];

function NewHandover() {
  const navigate = useNavigate();
  const { createHandoverMutation } = useHandovers();
  const { allMissingPetsQuery } = useCommunity();

  const { mutate: createHandover, isPending } = createHandoverMutation;
  const { data: missingData, isLoading: isLoadingPets } = allMissingPetsQuery;

  const [selectedPetId, setSelectedPetId] = useState<string>("");
  const [selectedNpoId, setSelectedNpoId] = useState<string>("");
  const [reason, setReason] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const missingPets: MissingPet[] = useMemo(
    () => missingData?.missingPets ?? [],
    [missingData],
  );

  const selectedPet = missingPets.find(
    (p) => p.pet_id.toString() === selectedPetId,
  );
  const selectedNpo = MOCK_NPOS.find((n) => n.id.toString() === selectedNpoId);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    if (!selectedPetId) return setFormError("Pick a pet to hand over.");
    if (!selectedNpoId) return setFormError("Pick a rescue organization.");
    if (!reason.trim()) return setFormError("Add a reason for the handover.");

    createHandover(
      {
        petId: selectedPetId,
        npoSpcaId: selectedNpoId,
        reason: reason.trim(),
      },
      {
        onSuccess: () => navigate("/community/handovers"),
      },
    );
  }

  if (isLoadingPets) return <PageLoader />;

  return (
    <div className="relative min-h-screen bg-bone text-ink overflow-hidden">
      {/* decorative paws */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <PawPrint className="absolute top-32 right-12 w-12 h-12 text-amber/15 rotate-[25deg]" />
        <PawPrint className="absolute top-48 left-16 w-8 h-8 text-burnt/10 rotate-[-20deg]" />
        <PawPrint className="absolute bottom-40 right-1/4 w-10 h-10 text-moss/10 rotate-[15deg]" />
      </div>

      {/* HEADER */}
      <section className="relative max-w-[900px] mx-auto px-6 pt-12 pb-8">
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="show"
        >
          <Link
            to="/community/handovers"
            className="inline-flex items-center gap-1.5 text-sm text-stone hover:text-ink transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to handovers
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-moss/15 text-moss text-xs font-bold uppercase tracking-widest mb-5">
            <ArrowRightLeft className="w-3.5 h-3.5" />
            New Handover
          </div>

          <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-[-0.03em] leading-[0.95]">
            Hand them over
            <br />
            <span className="text-moss">safely.</span>
          </h1>

          <p className="mt-5 text-lg text-stone max-w-md leading-relaxed">
            Found a missing pet? Let a local rescue organization take it from
            here.
          </p>
        </motion.div>
      </section>

      {/* FORM */}
      <section className="relative max-w-[900px] mx-auto px-6 pb-24">
        <motion.form
          onSubmit={handleSubmit}
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="show"
          className="rounded-[2rem] border border-ink/10 bg-bone p-6 sm:p-10 shadow-sm"
        >
          {missingPets.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4 animate-bob">🐾</div>
              <h2 className="font-display font-black text-2xl tracking-tight">
                No missing pets
              </h2>
              <p className="text-stone mt-2 text-sm max-w-sm mx-auto">
                You can only hand over a pet that has been officially reported
                missing. There are none in your area right now.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* 1. SELECT PET */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-stone mb-2">
                  1. Which pet did you find?
                </label>
                <div className="relative">
                  <select
                    value={selectedPetId}
                    onChange={(e) => {
                      setSelectedPetId(e.target.value);
                      setFormError(null);
                    }}
                    className="w-full h-14 pl-5 pr-12 rounded-full bg-bone border border-ink/10 outline-none text-base text-ink appearance-none cursor-pointer focus:border-moss focus:ring-4 focus:ring-moss/10 transition-all"
                  >
                    <option value="">Select a missing pet…</option>
                    {missingPets.map((pet) => (
                      <option key={pet.missing_pet_id} value={pet.pet_id}>
                        {pet.pet_name} ({pet.species_name} · {pet.colour_name})
                        — {pet.neighbourhood_name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
                </div>

                {/* Pet Preview */}
                {selectedPet && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3 flex items-center gap-3 p-3 rounded-2xl bg-amber/10 border border-amber/20"
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-amber/20 shrink-0">
                      {selectedPet.image_url ? (
                        <img
                          src={selectedPet.image_url}
                          alt={selectedPet.pet_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full grid place-items-center text-amber">
                          <PawPrint className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm">
                        {selectedPet.pet_name}
                      </div>
                      <div className="text-xs text-stone truncate">
                        Last seen: {selectedPet.street},{" "}
                        {selectedPet.neighbourhood_name}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* 2. SELECT NPO */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-stone mb-2">
                  2. Which organization are you handing them to?
                </label>
                <div className="relative">
                  <select
                    value={selectedNpoId}
                    onChange={(e) => {
                      setSelectedNpoId(e.target.value);
                      setFormError(null);
                    }}
                    className="w-full h-14 pl-5 pr-12 rounded-full bg-bone border border-ink/10 outline-none text-base text-ink appearance-none cursor-pointer focus:border-moss focus:ring-4 focus:ring-moss/10 transition-all"
                  >
                    <option value="">Select an organization…</option>
                    {MOCK_NPOS.map((npo) => (
                      <option key={npo.id} value={npo.id}>
                        {npo.name} — {npo.neighbourhood}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
                </div>

                {/* NPO Preview */}
                {selectedNpo && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3 p-4 rounded-2xl bg-moss/5 border border-moss/10"
                  >
                    <div className="font-semibold text-sm text-moss mb-1">
                      {selectedNpo.name}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-stone mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {selectedNpo.street}, {selectedNpo.neighbourhood}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-stone mt-1">
                      <Mail className="w-3.5 h-3.5" />
                      {selectedNpo.email}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* 3. REASON */}
              <div>
                <label
                  htmlFor="reason"
                  className="block text-xs font-bold uppercase tracking-widest text-stone mb-2"
                >
                  3. Why are you handing them over?
                </label>
                <textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    setFormError(null);
                  }}
                  rows={4}
                  maxLength={300}
                  placeholder="e.g. Found wandering near the park. I can't keep them safe at my place, so I brought them to the clinic."
                  className="w-full px-5 py-4 rounded-[1.5rem] bg-bone border border-ink/10 outline-none text-base text-ink placeholder:text-stone/60 focus:border-moss focus:ring-4 focus:ring-moss/10 transition-all resize-none"
                />
                <div className="mt-1.5 text-right text-xs text-stone tabular-nums">
                  {reason.length}/300
                </div>
              </div>

              {/* ERROR */}
              {formError && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2 p-3 rounded-2xl bg-burnt-deep/10 text-burnt-deep text-sm"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </motion.div>
              )}

              {/* SUBMIT */}
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-2 h-14 px-8 rounded-full bg-moss text-bone font-medium hover:bg-moss/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed group"
                >
                  {isPending ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-bone/40 border-t-bone animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4" />
                      Complete handover
                      <span className="inline-block group-hover:translate-x-1 transition-transform">
                        <Check className="w-4 h-4" />
                      </span>
                    </>
                  )}
                </button>

                <Link
                  to="/community/handovers"
                  className="inline-flex items-center h-14 px-6 rounded-full text-sm font-medium text-stone hover:text-ink hover:bg-ink/5 transition-colors"
                >
                  Cancel
                </Link>
              </div>
            </div>
          )}
        </motion.form>
      </section>
    </div>
  );
}

export default NewHandover;
