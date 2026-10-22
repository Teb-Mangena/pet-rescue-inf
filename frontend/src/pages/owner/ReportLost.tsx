import { useMemo, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  PawPrint,
  ArrowLeft,
  Search,
  MapPin,
  X,
  AlertCircle,
  ChevronDown,
  Megaphone,
} from "lucide-react";
import { Link } from "react-router";
import PageLoader from "../../components/PageLoader";
import { usePetOwnerActions } from "../../hooks/usePetOwnerActions";
import type { Pet } from "../../types/pets";

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

const LOCATIONS = [
  {
    location_id: 1,
    neighbourhood_id: 1,
    neighbourhood_name: "Southernwood",
    street: "Frere Road",
  },
  {
    location_id: 2,
    neighbourhood_id: 2,
    neighbourhood_name: "Quigney",
    street: "Fleet Street",
  },
  {
    location_id: 3,
    neighbourhood_id: 3,
    neighbourhood_name: "Beacon Bay",
    street: "Bonza Bay Road",
  },
  {
    location_id: 4,
    neighbourhood_id: 4,
    neighbourhood_name: "Vincent",
    street: "Devereux Avenue",
  },
  {
    location_id: 5,
    neighbourhood_id: 5,
    neighbourhood_name: "Gonubie",
    street: "Main Road",
  },
];

function ReportLost() {
  const { myPetsQuery, reportMyLostPetMutation } = usePetOwnerActions();

  const { data, isLoading } = myPetsQuery;

  // 👇 USE THE CORRECT MUTATION
  const { mutate: reportLost, isPending } = reportMyLostPetMutation;

  // Only show pets that are currently "at_home"
  const myPets: Pet[] = useMemo(() => {
    const allPets = data?.pets ?? [];
    return allPets.filter((p) => p.pet_status === "at_home");
  }, [data]);

  const [search, setSearch] = useState("");

  // ---- modal state ----
  const [reportingPet, setReportingPet] = useState<Pet | null>(null);
  const [lostLocationId, setLostLocationId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const locationsByNeighbourhood = useMemo(() => {
    const map = new Map<string, typeof LOCATIONS>();
    for (const loc of LOCATIONS) {
      const key = loc.neighbourhood_name;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(loc);
    }
    return Array.from(map.entries());
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return myPets;
    return myPets.filter(
      (p) =>
        p.pet_name.toLowerCase().includes(q) ||
        p.species_name.toLowerCase().includes(q),
    );
  }, [myPets, search]);

  function openReport(pet: Pet) {
    setReportingPet(pet);
    setLostLocationId(null);
    setFormError(null);
  }

  function closeReport() {
    if (isPending) return;
    setReportingPet(null);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!reportingPet) return;

    if (!lostLocationId) {
      setFormError("Pick where they were last seen.");
      return;
    }

    // The backend expects exactly this payload
    reportLost(
      {
        petId: reportingPet.pet_id,
        locationId: lostLocationId,
      },
      {
        onSuccess: () => setReportingPet(null),
      },
    );
  }

  if (isLoading) return <PageLoader />;

  return (
    <div className="relative min-h-screen bg-bone text-ink overflow-hidden">
      {/* decorative paws */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <PawPrint className="absolute top-32 right-12 w-12 h-12 text-burnt/15 rotate-[25deg]" />
        <PawPrint className="absolute top-48 left-16 w-8 h-8 text-amber/15 rotate-[-20deg]" />
        <PawPrint className="absolute bottom-40 right-1/4 w-10 h-10 text-burnt/10 rotate-[15deg]" />
      </div>

      {/* HEADER */}
      <section className="relative max-w-[1100px] mx-auto px-6 pt-12 pb-8">
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="show"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-stone hover:text-ink transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back home
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-burnt/15 text-burnt text-xs font-bold uppercase tracking-widest mb-5">
            <Megaphone className="w-3.5 h-3.5" />
            Report Lost
          </div>

          <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-[-0.03em] leading-[0.95]">
            Oh no,
            <br />
            <span className="text-burnt">they've wandered off.</span>
          </h1>

          <p className="mt-5 text-lg text-stone max-w-md leading-relaxed">
            Pick which pet is missing and tell us where they were last seen.
            We'll alert the community immediately.
          </p>
        </motion.div>
      </section>

      {/* SEARCH */}
      <section className="relative max-w-[1100px] mx-auto px-6 pb-6">
        <motion.label
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="show"
          className="flex items-center gap-3 h-14 w-full sm:max-w-md px-5 rounded-full bg-bone border border-ink/10 focus-within:border-burnt focus-within:ring-4 focus-within:ring-burnt/10 transition-all"
        >
          <Search className="w-5 h-5 text-stone shrink-0" />
          <input
            type="text"
            placeholder="Find one of your pets…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="grow bg-transparent outline-none text-base text-ink placeholder:text-stone/60"
          />
          {myPets.length > 0 && (
            <span className="text-xs text-stone shrink-0 tabular-nums">
              {filtered.length}/{myPets.length}
            </span>
          )}
        </motion.label>
      </section>

      {/* GRID */}
      <section className="relative max-w-[1100px] mx-auto px-6 pb-24">
        {myPets.length === 0 && (
          <motion.div
            variants={fadeUp}
            custom={2}
            initial="hidden"
            animate="show"
            className="py-20 text-center rounded-[2rem] border border-dashed border-ink/15 bg-bone/60"
          >
            <div className="text-6xl mb-5 animate-bob">🐾</div>
            <h2 className="font-display font-black text-2xl tracking-tight">
              All your pets are accounted for
            </h2>
            <p className="text-stone mt-2 max-w-sm mx-auto">
              You don't have any pets marked as "at home" right now. If you
              haven't registered them yet, do that first.
            </p>
            <Link
              to="/owner/pets/new"
              className="inline-flex items-center gap-2 mt-6 h-11 px-6 rounded-full bg-ink text-bone font-medium hover:bg-burnt transition-colors"
            >
              Register a pet
            </Link>
          </motion.div>
        )}

        {filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filtered.map((pet, i) => {
                const tilt = TILT[i % TILT.length];

                return (
                  <motion.div
                    key={pet.pet_id}
                    layout
                    initial={{ opacity: 0, y: 20, rotate: tilt * 2 }}
                    animate={{ opacity: 1, y: 0, rotate: tilt }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: 0.05 + i * 0.04, duration: 0.5, ease }}
                    whileHover={{
                      rotate: 0,
                      y: -6,
                      transition: { duration: 0.25, ease },
                    }}
                    className="group"
                  >
                    <div className="rounded-[2rem] border border-ink/10 bg-bone overflow-hidden shadow-sm hover:shadow-xl hover:shadow-ink/5 transition-shadow flex flex-col h-full">
                      <div className="aspect-[4/3] bg-amber/10 relative overflow-hidden">
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
                      </div>

                      <div className="p-5 flex-1 flex flex-col">
                        <div className="font-display font-black text-xl tracking-tight leading-tight truncate">
                          {pet.pet_name}
                        </div>
                        <div className="text-sm text-stone mt-1">
                          {pet.species_name} · {pet.colour_name}
                        </div>

                        <div className="mt-4 pt-4 border-t border-ink/5 mt-auto">
                          <button
                            type="button"
                            onClick={() => openReport(pet)}
                            className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-full bg-burnt text-bone text-sm font-medium hover:bg-burnt-deep transition-colors"
                          >
                            <Megaphone className="w-4 h-4" />
                            Report lost
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* REPORT MODAL */}
      <AnimatePresence>
        {reportingPet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeReport}
              className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.25, ease }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 mx-auto max-w-lg rounded-[2rem] border border-ink/10 bg-bone shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <form onSubmit={handleSubmit}>
                {/* header */}
                <div className="relative bg-ink text-bone p-6">
                  <button
                    type="button"
                    onClick={closeReport}
                    disabled={isPending}
                    className="absolute top-4 right-4 grid place-items-center w-8 h-8 rounded-full bg-bone/10 text-bone/80 hover:bg-bone/20 hover:text-bone transition-colors disabled:opacity-50"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-4">
                    <span className="grid place-items-center w-14 h-14 rounded-2xl bg-bone/10 text-burnt shrink-0">
                      <Megaphone className="w-6 h-6" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-burnt text-[11px] font-bold uppercase tracking-widest">
                        Report lost
                      </div>
                      <div className="font-display font-black text-2xl tracking-tight truncate">
                        {reportingPet.pet_name} is missing?
                      </div>
                    </div>
                  </div>
                </div>

                {/* body */}
                <div className="p-6 space-y-5">
                  {/* pet summary */}
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-amber/10 border border-amber/20">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-amber/20 shrink-0">
                      {reportingPet.image_url ? (
                        <img
                          src={reportingPet.image_url}
                          alt={reportingPet.pet_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full grid place-items-center text-amber">
                          <PawPrint className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm truncate">
                        {reportingPet.pet_name}
                      </div>
                      <div className="text-xs text-stone truncate">
                        {reportingPet.species_name} · {reportingPet.colour_name}
                      </div>
                    </div>
                  </div>

                  {/* location */}
                  <div>
                    <label
                      htmlFor="lostLocationId"
                      className="block text-xs font-bold uppercase tracking-widest text-stone mb-2"
                    >
                      Where were they last seen?
                    </label>

                    <div className="relative">
                      <select
                        id="lostLocationId"
                        value={lostLocationId ?? ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          setLostLocationId(v ? Number(v) : null);
                          setFormError(null);
                        }}
                        className="w-full h-12 pl-5 pr-12 rounded-full bg-bone border border-ink/10 outline-none text-base text-ink appearance-none cursor-pointer focus:border-burnt focus:ring-4 focus:ring-burnt/10 transition-all"
                      >
                        <option value="">Choose a street…</option>
                        {locationsByNeighbourhood.map(
                          ([neighbourhood, locs]) => (
                            <optgroup
                              key={neighbourhood}
                              label={`${neighbourhood} · East London`}
                            >
                              {locs.map((loc) => (
                                <option
                                  key={loc.location_id}
                                  value={loc.location_id}
                                >
                                  {loc.street}
                                </option>
                              ))}
                            </optgroup>
                          ),
                        )}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
                    </div>

                    {lostLocationId && (
                      <p className="mt-2 text-xs text-burnt inline-flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" />
                        {
                          LOCATIONS.find(
                            (l) => l.location_id === lostLocationId,
                          )?.street
                        }
                        ,{" "}
                        {
                          LOCATIONS.find(
                            (l) => l.location_id === lostLocationId,
                          )?.neighbourhood_name
                        }
                      </p>
                    )}
                  </div>

                  {/* error */}
                  <AnimatePresence>
                    {formError && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="flex items-start gap-2 p-3 rounded-2xl bg-burnt-deep/10 text-burnt-deep text-sm"
                      >
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{formError}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* actions */}
                  <div className="flex items-center gap-2 justify-end pt-1">
                    <button
                      type="button"
                      onClick={closeReport}
                      disabled={isPending}
                      className="inline-flex items-center h-11 px-5 rounded-full border border-ink/15 hover:border-ink/30 hover:bg-ink/5 transition-colors text-sm font-medium disabled:opacity-60"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isPending}
                      className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-burnt text-bone font-medium hover:bg-burnt-deep transition-colors disabled:opacity-60"
                    >
                      {isPending ? (
                        <>
                          <span className="w-4 h-4 rounded-full border-2 border-bone/40 border-t-bone animate-spin" />
                          Reporting…
                        </>
                      ) : (
                        <>
                          <Megaphone className="w-4 h-4" />
                          Alert community
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ReportLost;
