import { useMemo, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  PawPrint,
  Heart,
  Search,
  ArrowLeft,
  ImageOff,
  Inbox,
  MapPin,
  X,
  User,
} from "lucide-react";
import { Link } from "react-router";
import { useIncidents } from "../../hooks/useIncidents";
import type { FoundPet } from "../../types/foundPets";
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

function FoundPets() {
  const { FoundPetsQuery } = useIncidents();
  const { data, isLoading } = FoundPetsQuery;

  const foundPets: FoundPet[] = useMemo(() => data?.foundPets ?? [], [data]);

  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState<string>("all");

  // unique city list for filter chips
  const cities = useMemo(() => {
    const set = new Set(foundPets.map((p) => p.city_name));
    return Array.from(set).sort();
  }, [foundPets]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return foundPets.filter((p) => {
      const matchesQuery =
        !q ||
        p.pet_name.toLowerCase().includes(q) ||
        p.species_name.toLowerCase().includes(q) ||
        p.colour_name.toLowerCase().includes(q) ||
        p.neighbourhood_name.toLowerCase().includes(q);
      const matchesCity = cityFilter === "all" || p.city_name === cityFilter;
      return matchesQuery && matchesCity;
    });
  }, [foundPets, search, cityFilter]);

  if (isLoading) return <PageLoader />;

  return (
    <div className="relative min-h-screen bg-bone text-ink overflow-hidden">
      {/* decorative paws */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <PawPrint className="absolute top-32 right-12 w-12 h-12 text-moss/15 rotate-[25deg]" />
        <PawPrint className="absolute top-48 left-16 w-8 h-8 text-amber/15 rotate-[-20deg]" />
        <PawPrint className="absolute bottom-40 right-1/4 w-10 h-10 text-moss/10 rotate-[15deg]" />
      </div>

      {/* ============ HEADER ============ */}
      <section className="relative max-w-[1200px] mx-auto px-6 pt-12 pb-8">
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="show"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-moss/15 text-moss text-xs font-bold uppercase tracking-widest mb-5">
            <Heart className="w-3.5 h-3.5" />
            Found pets
          </div>

          <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-[-0.03em] leading-[0.95]">
            Someone's
            <br />
            <span className="text-moss">missing them.</span>
          </h1>

          <p className="mt-5 text-lg text-stone max-w-md leading-relaxed">
            These pets were found nearby. Take a look — you might know their
            owner.
          </p>
        </motion.div>
      </section>

      {/* ============ SEARCH + FILTERS ============ */}
      <section className="relative max-w-[1200px] mx-auto px-6 pb-6 space-y-3">
        <motion.div
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="show"
          className="flex flex-wrap items-center gap-3"
        >
          <label className="flex items-center gap-3 h-14 flex-1 min-w-[260px] px-5 rounded-full bg-bone border border-ink/10 focus-within:border-moss focus-within:ring-4 focus-within:ring-moss/10 transition-all">
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

          {foundPets.length > 0 && (
            <span className="text-sm text-stone tabular-nums shrink-0">
              {filtered.length}/{foundPets.length}
            </span>
          )}
        </motion.div>

        {/* city chips */}
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

      {/* ============ GRID ============ */}
      <section className="relative max-w-[1200px] mx-auto px-6 pb-24">
        {/* no data at all */}
        {foundPets.length === 0 && (
          <motion.div
            variants={fadeUp}
            custom={3}
            initial="hidden"
            animate="show"
            className="rounded-[2rem] border border-dashed border-ink/15 bg-bone/60 py-20 text-center"
          >
            <div className="text-6xl mb-5 animate-bob">🌟</div>
            <h2 className="font-display font-black text-2xl tracking-tight">
              Nothing found yet
            </h2>
            <p className="text-stone mt-2 max-w-sm mx-auto">
              No found pets have been reported nearby. Check back soon.
            </p>
          </motion.div>
        )}

        {/* filtered to nothing */}
        {foundPets.length > 0 && filtered.length === 0 && (
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
              className="mt-4 text-sm font-medium text-moss hover:text-moss/80 transition-colors"
            >
              Clear filters
            </button>
          </motion.div>
        )}

        {/* grid */}
        {filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filtered.map((pet, i) => {
                const tilt = TILT[i % TILT.length];
                const reporterInitials =
                  `${pet.reporter?.firstname?.charAt(0) || ""}${pet.reporter?.lastname?.charAt(0) || ""}`.toUpperCase() ||
                  "?";

                return (
                  <motion.div
                    key={pet.found_pet_id}
                    layout
                    initial={{ opacity: 0, y: 20, rotate: tilt * 2 }}
                    animate={{ opacity: 1, y: 0, rotate: tilt }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      delay: 0.05 + i * 0.04,
                      duration: 0.5,
                      ease,
                    }}
                    whileHover={{
                      rotate: 0,
                      y: -6,
                      transition: { duration: 0.25, ease },
                    }}
                    className="group flex flex-col h-full rounded-[2rem] border border-ink/10 bg-bone overflow-hidden shadow-sm hover:shadow-xl hover:shadow-ink/5 transition-shadow"
                  >
                    <Link
                      to={`/owner/found/${pet.found_pet_id}`}
                      className="block flex-1"
                    >
                      {/* image */}
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

                        <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-bone/90 text-moss backdrop-blur-md">
                          <Heart className="w-3 h-3" />
                          Found
                        </span>
                      </div>

                      {/* body */}
                      <div className="p-5 pb-0">
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

                        {pet.description && (
                          <p className="mt-3 text-xs text-ink/70 line-clamp-2 leading-relaxed">
                            {pet.description}
                          </p>
                        )}
                      </div>
                    </Link>

                    {/* Footer with Finder info */}
                    <div className="p-5 pt-4 mt-auto">
                      <div className="pt-4 border-t border-ink/5 flex items-center gap-2.5">
                        <span className="grid place-items-center w-8 h-8 rounded-full bg-moss/10 text-moss text-[10px] font-bold shrink-0">
                          {reporterInitials}
                        </span>
                        <div className="min-w-0">
                          <div className="text-[10px] uppercase tracking-widest text-stone font-bold">
                            Found by
                          </div>
                          <div className="text-sm font-medium text-ink truncate flex items-center gap-1">
                            {pet.reporter?.firstname} {pet.reporter?.lastname}
                          </div>
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
    </div>
  );
}

export default FoundPets;
