import { useMemo, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  PawPrint,
  Search,
  ArrowLeft,
  Inbox,
  MapPin,
  X,
  Heart,
  Check,
  AlertCircle,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router";
import { useIncidents } from "../../hooks/useIncidents";
import type { MissingPet } from "../../types/missingPets";
import PageLoader from "../../components/PageLoader";

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

// ---- Locations ----
// Swap this for a real query when you have one:
//   const { data: locations = [] } = useLocations();
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

function MissingPets() {
  const { LostPetsQuery, reportPetMutation } = useIncidents();
  const { data, isLoading } = LostPetsQuery;
  const { mutate: reportFound, isPending } = reportPetMutation;

  const missingPets: MissingPet[] = useMemo(
    () => data?.missingPets ?? [],
    [data],
  );

  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState<string>("all");

  // ---- report modal ----
  const [reportingPet, setReportingPet] = useState<MissingPet | null>(null);
  const [foundLocationId, setFoundLocationId] = useState<number | null>(null);
  const [foundDescription, setFoundDescription] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // group locations by neighbourhood for the dropdown
  const locationsByNeighbourhood = useMemo(() => {
    const map = new Map<string, typeof LOCATIONS>();
    for (const loc of LOCATIONS) {
      const key = loc.neighbourhood_name;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(loc);
    }
    return Array.from(map.entries());
  }, []);

  const cities = useMemo(() => {
    const set = new Set(missingPets.map((p) => p.city_name));
    return Array.from(set).sort();
  }, [missingPets]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return missingPets.filter((p) => {
      const matchesQuery =
        !q ||
        p.pet_name.toLowerCase().includes(q) ||
        p.species_name.toLowerCase().includes(q) ||
        p.colour_name.toLowerCase().includes(q) ||
        p.neighbourhood_name.toLowerCase().includes(q);
      const matchesCity = cityFilter === "all" || p.city_name === cityFilter;
      return matchesQuery && matchesCity;
    });
  }, [missingPets, search, cityFilter]);

  function openReport(pet: MissingPet) {
    setReportingPet(pet);
    setFoundLocationId(null);
    setFoundDescription("");
    setFormError(null);
  }

  function closeReport() {
    if (isPending) return;
    setReportingPet(null);
  }

  function handleSubmitReport(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!reportingPet) return;

    if (!foundLocationId) {
      setFormError("Pick where you found them.");
      return;
    }
    if (!foundDescription.trim()) {
      setFormError("Add a short description so the owner can verify.");
      return;
    }

    reportFound(
      {
        petId: reportingPet.pet_id,
        locationId: foundLocationId,
        description: foundDescription.trim(),
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
      <section className="relative max-w-[1200px] mx-auto px-6 pt-12 pb-8">
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="show"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-burnt/15 text-burnt text-xs font-bold uppercase tracking-widest mb-5">
            <Search className="w-3.5 h-3.5" />
            Lost pets
          </div>

          <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-[-0.03em] leading-[0.95]">
            Let's bring them
            <br />
            <span className="text-burnt">back home.</span>
          </h1>

          <p className="mt-5 text-lg text-stone max-w-md leading-relaxed">
            These pets are missing nearby. Spotted one? Tap "I found this" and
            let the owner know.
          </p>
        </motion.div>
      </section>

      {/* SEARCH + FILTERS */}
      <section className="relative max-w-[1200px] mx-auto px-6 pb-6 space-y-3">
        <motion.div
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="show"
          className="flex flex-wrap items-center gap-3"
        >
          <label className="flex items-center gap-3 h-14 flex-1 min-w-[260px] px-5 rounded-full bg-bone border border-ink/10 focus-within:border-burnt focus-within:ring-4 focus-within:ring-burnt/10 transition-all">
            <Search className="w-5 h-5 text-stone shrink-0" />
            <input
              type="text"
              placeholder="Search by name, species, colour…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="grow bg-transparent outline-none text-base text-ink placeholder:text-stone/60"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="grid place-items-center w-7 h-7 rounded-full text-stone hover:text-ink hover:bg-ink/5 transition-colors shrink-0"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </label>

          {missingPets.length > 0 && (
            <span className="text-sm text-stone tabular-nums shrink-0">
              {filtered.length}/{missingPets.length}
            </span>
          )}
        </motion.div>

        {cities.length > 1 && (
          <motion.div
            variants={fadeUp}
            custom={2}
            initial="hidden"
            animate="show"
            className="flex flex-wrap items-center gap-2"
          >
            <span className="text-[11px] uppercase tracking-widest text-stone">
              City
            </span>
            <button
              type="button"
              onClick={() => setCityFilter("all")}
              className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                cityFilter === "all"
                  ? "bg-ink text-bone"
                  : "bg-ink/5 text-stone hover:bg-ink/10"
              }`}
            >
              All
            </button>
            {cities.map((city) => {
              const active = cityFilter === city;
              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => setCityFilter(city)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                    active
                      ? "bg-ink text-bone"
                      : "bg-ink/5 text-stone hover:bg-ink/10"
                  }`}
                >
                  {city}
                </button>
              );
            })}
          </motion.div>
        )}
      </section>

      {/* GRID */}
      <section className="relative max-w-[1200px] mx-auto px-6 pb-24">
        {missingPets.length === 0 && (
          <motion.div
            variants={fadeUp}
            custom={3}
            initial="hidden"
            animate="show"
            className="rounded-[2rem] border border-dashed border-ink/15 bg-bone/60 py-20 text-center"
          >
            <div className="text-6xl mb-5 animate-bob">🐾</div>
            <h2 className="font-display font-black text-2xl tracking-tight">
              All quiet around here
            </h2>
            <p className="text-stone mt-2 max-w-sm mx-auto">
              No lost pets have been reported nearby. That's good news.
            </p>
          </motion.div>
        )}

        {missingPets.length > 0 && filtered.length === 0 && (
          <motion.div
            variants={fadeUp}
            custom={3}
            initial="hidden"
            animate="show"
            className="rounded-[2rem] border border-dashed border-ink/15 bg-bone/60 py-16 text-center"
          >
            <div className="grid place-items-center w-16 h-16 mx-auto rounded-2xl bg-ink/5 text-stone mb-4">
              <Inbox className="w-6 h-6" />
            </div>
            <h2 className="font-display font-black text-xl tracking-tight">
              No matches
            </h2>
            <p className="text-sm text-stone mt-2">
              Try a different search or clear the filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCityFilter("all");
              }}
              className="mt-4 text-sm font-medium text-burnt hover:text-burnt-deep transition-colors"
            >
              Clear filters
            </button>
          </motion.div>
        )}

        {filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filtered.map((pet, i) => {
                const tilt = TILT[i % TILT.length];

                return (
                  <motion.div
                    key={pet.missing_pet_id}
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
                      <Link to={`/owner/pets/${pet.pet_id}`} className="block">
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

                          <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-burnt/90 text-bone backdrop-blur-md">
                            <Search className="w-3 h-3" />
                            Lost
                          </span>
                        </div>

                        <div className="p-5 pb-4">
                          <div className="font-display font-black text-xl tracking-tight leading-tight truncate">
                            {pet.pet_name}
                          </div>
                          <div className="text-sm text-stone mt-1">
                            {pet.species_name} · {pet.colour_name}
                          </div>

                          <div className="mt-3 flex items-center gap-1.5 text-xs text-stone">
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span className="truncate">
                              {pet.neighbourhood_name}, {pet.city_name}
                            </span>
                          </div>
                        </div>
                      </Link>

                      <div className="px-5 pb-5 pt-0 mt-auto">
                        <button
                          type="button"
                          onClick={() => openReport(pet)}
                          className="group/btn w-full inline-flex items-center justify-center gap-2 h-11 rounded-full bg-moss text-bone text-sm font-medium hover:bg-moss/90 transition-colors"
                        >
                          <Heart className="w-4 h-4" />I found this pet
                          <span className="inline-block group-hover/btn:scale-125 transition-transform">
                            <Sparkles className="w-3.5 h-3.5" />
                          </span>
                        </button>
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
              <form onSubmit={handleSubmitReport}>
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
                    <span className="grid place-items-center w-14 h-14 rounded-2xl bg-bone/10 text-amber shrink-0">
                      <Heart className="w-6 h-6" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-amber text-[11px] font-bold uppercase tracking-widest">
                        Report found
                      </div>
                      <div className="font-display font-black text-2xl tracking-tight truncate">
                        You found {reportingPet.pet_name}?
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-bone/70">
                    Tell us where and how so the owner can verify.
                  </p>
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
                      <div className="text-xs text-stone truncate mt-0.5">
                        Last seen in {reportingPet.neighbourhood_name}
                      </div>
                    </div>
                  </div>

                  {/* location picker */}
                  <div>
                    <label
                      htmlFor="foundLocationId"
                      className="block text-xs font-bold uppercase tracking-widest text-stone mb-2"
                    >
                      Where did you find them?
                    </label>

                    <div className="relative">
                      <select
                        id="foundLocationId"
                        value={foundLocationId ?? ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          setFoundLocationId(v ? Number(v) : null);
                          setFormError(null);
                        }}
                        className="w-full h-12 pl-5 pr-12 rounded-full bg-bone border border-ink/10 outline-none text-base text-ink appearance-none cursor-pointer focus:border-moss focus:ring-4 focus:ring-moss/15 transition-all"
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

                      {/* custom dropdown caret */}
                      <ChevronDown className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
                    </div>

                    {foundLocationId && (
                      <p className="mt-2 text-xs text-moss inline-flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" />
                        {
                          LOCATIONS.find(
                            (l) => l.location_id === foundLocationId,
                          )?.street
                        }
                        ,{" "}
                        {
                          LOCATIONS.find(
                            (l) => l.location_id === foundLocationId,
                          )?.neighbourhood_name
                        }
                      </p>
                    )}
                  </div>

                  {/* description */}
                  <div>
                    <label
                      htmlFor="foundDescription"
                      className="block text-xs font-bold uppercase tracking-widest text-stone mb-2"
                    >
                      Describe what you saw
                    </label>
                    <textarea
                      id="foundDescription"
                      value={foundDescription}
                      onChange={(e) => {
                        setFoundDescription(e.target.value);
                        setFormError(null);
                      }}
                      rows={4}
                      maxLength={300}
                      placeholder="e.g. Sitting under the park bench near the beach entrance. Very friendly, no collar."
                      className="w-full px-5 py-4 rounded-[1.5rem] bg-bone border border-ink/10 outline-none text-base text-ink placeholder:text-stone/60 focus:border-moss focus:ring-4 focus:ring-moss/15 transition-all resize-none"
                    />
                    <div className="mt-1.5 flex items-center justify-between text-xs text-stone">
                      <span>Helps the owner confirm it's really them.</span>
                      <span className="tabular-nums">
                        {foundDescription.length}/300
                      </span>
                    </div>
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
                      className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-moss text-bone font-medium hover:bg-moss/90 transition-colors disabled:opacity-60"
                    >
                      {isPending ? (
                        <>
                          <span className="w-4 h-4 rounded-full border-2 border-bone/40 border-t-bone animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Send report
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

export default MissingPets;
