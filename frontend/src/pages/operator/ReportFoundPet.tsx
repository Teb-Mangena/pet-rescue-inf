import { useMemo, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Radio,
  ShieldCheck,
  Search,
  MapPin,
  ImageOff,
  PawPrint,
  Heart,
  Check,
  X,
  AlertCircle,
  ChevronDown,
  Inbox,
  ArrowLeft,
  Building2,
  Phone,
  Mail,
} from "lucide-react";
import { Link } from "react-router";
import { useIncidents } from "../../hooks/useIncidents";
import { useProfiles } from "../../hooks/useProfiles";
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

function ReportFoundPet() {
  const { LostPetsQuery, reportPetMutation } = useIncidents();
  const { ROProfileQuery } = useProfiles();

  const { data: lostData, isLoading: loadingLost } = LostPetsQuery;
  const { data: profileData, isLoading: loadingProfile } = ROProfileQuery;

  const { mutate: reportFound, isPending } = reportPetMutation;
  const profile = profileData?.profile;

  const missingPets: MissingPet[] = useMemo(
    () => lostData?.missingPets ?? [],
    [lostData],
  );

  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState<string>("all");

  // ---- modal state ----
  const [reportingPet, setReportingPet] = useState<MissingPet | null>(null);
  const [foundLocationId, setFoundLocationId] = useState<number | null>(null);
  const [foundDescription, setFoundDescription] = useState("");
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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!reportingPet) return;

    if (!foundLocationId) {
      setFormError("Pick where you found the pet.");
      return;
    }
    if (!foundDescription.trim()) {
      setFormError("Add a short description of the situation.");
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

  if (loadingLost || loadingProfile) return <PageLoader />;

  const initials = profile
    ? `${profile.firstname.charAt(0)}${profile.lastname.charAt(0)}`.toUpperCase()
    : "RO";

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

            <div className="flex flex-wrap items-start justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-moss/10 text-moss text-[11px] font-bold uppercase tracking-widest">
                    <Radio className="w-3 h-3" />
                    Rescue Operator
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest text-stone">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </span>
                </div>

                <h1 className="font-display font-black text-3xl sm:text-4xl tracking-[-0.02em]">
                  Report a found pet
                </h1>
                <p className="mt-2 text-stone max-w-xl">
                  Pick the missing pet you've located and log where you found
                  them. The owner will be notified.
                </p>
              </div>

              {profile && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-ink/10 bg-bone">
                  <span className="grid place-items-center w-10 h-10 rounded-xl bg-ink text-bone text-xs font-bold shrink-0">
                    {initials}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate">
                      {profile.firstname} {profile.lastname}
                    </div>
                    <div className="text-xs text-stone truncate inline-flex items-center gap-1.5">
                      <Building2 className="w-3 h-3 shrink-0" />
                      {profile.npo_spca_name ?? "Your organisation"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ BODY GRID ============ */}
      <section className="max-w-[1400px] mx-auto px-6 py-8 grid lg:grid-cols-12 gap-6">
        {/* LEFT — main list */}
        <div className="lg:col-span-9 space-y-6">
          {/* search + filters */}
          <motion.div
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate="show"
            className="rounded-2xl border border-ink/10 bg-bone p-4 space-y-3"
          >
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 h-11 flex-1 min-w-[260px] px-4 rounded-xl bg-bone border border-ink/10 focus-within:border-burnt focus-within:ring-2 focus-within:ring-burnt/15 transition-all">
                <Search className="w-4 h-4 text-stone shrink-0" />
                <input
                  type="text"
                  placeholder="Search by name, species, colour, neighbourhood…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="grow bg-transparent outline-none text-sm text-ink placeholder:text-stone/60"
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

              <span className="text-sm text-stone tabular-nums shrink-0 px-2">
                {filtered.length}/{missingPets.length}
              </span>
            </div>

            {cities.length > 1 && (
              <div className="flex flex-wrap items-center gap-2">
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
              </div>
            )}
          </motion.div>

          {/* list */}
          {missingPets.length === 0 && (
            <motion.div
              variants={fadeUp}
              custom={2}
              initial="hidden"
              animate="show"
              className="py-20 text-center rounded-2xl border border-ink/10 bg-bone"
            >
              <div className="grid place-items-center w-14 h-14 mx-auto rounded-2xl bg-ink/5 text-stone mb-4">
                <Inbox className="w-6 h-6" />
              </div>
              <h2 className="font-display font-black text-xl tracking-tight">
                No missing pets
              </h2>
              <p className="text-sm text-stone mt-1 max-w-sm mx-auto">
                Nothing reported right now. Check back later.
              </p>
            </motion.div>
          )}

          {missingPets.length > 0 && filtered.length === 0 && (
            <motion.div
              variants={fadeUp}
              custom={2}
              initial="hidden"
              animate="show"
              className="py-16 text-center rounded-2xl border border-ink/10 bg-bone"
            >
              <div className="grid place-items-center w-14 h-14 mx-auto rounded-2xl bg-ink/5 text-stone mb-4">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              <AnimatePresence>
                {filtered.map((pet, i) => (
                  <motion.article
                    key={pet.missing_pet_id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{
                      delay: 0.05 + i * 0.035,
                      duration: 0.4,
                      ease,
                    }}
                    className="group rounded-2xl border border-ink/10 bg-bone overflow-hidden hover:border-ink/25 transition-colors flex flex-col"
                  >
                    <div className="aspect-[4/3] bg-ink/5 relative overflow-hidden">
                      {pet.image_url ? (
                        <img
                          src={pet.image_url}
                          alt={pet.pet_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full grid place-items-center text-stone">
                          <ImageOff className="w-7 h-7" />
                        </div>
                      )}
                      <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-burnt text-bone backdrop-blur-sm">
                        <Search className="w-3 h-3" />
                        Lost
                      </span>
                    </div>

                    <div className="p-4 flex-1 flex flex-col">
                      <div className="font-display font-black text-lg tracking-tight leading-tight truncate">
                        {pet.pet_name}
                      </div>
                      <div className="text-xs text-stone mt-0.5">
                        {pet.species_name} · {pet.colour_name}
                      </div>

                      <div className="mt-2 flex items-center gap-1.5 text-xs text-stone">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">
                          {pet.neighbourhood_name}, {pet.city_name}
                        </span>
                      </div>

                      {pet.pet_description && (
                        <p className="mt-2 text-xs text-ink/70 line-clamp-2 leading-relaxed">
                          {pet.pet_description}
                        </p>
                      )}

                      <div className="mt-4 pt-3 border-t border-ink/5 mt-auto">
                        <button
                          type="button"
                          onClick={() => openReport(pet)}
                          className="w-full inline-flex items-center justify-center gap-1.5 h-10 rounded-lg bg-burnt text-bone text-sm font-medium hover:bg-burnt-deep transition-colors"
                        >
                          <Heart className="w-3.5 h-3.5" />
                          Report as found
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* RIGHT — org sidebar */}
        <motion.aside
          variants={fadeUp}
          custom={3}
          initial="hidden"
          animate="show"
          className="lg:col-span-3 space-y-4"
        >
          {/* org card */}
          <div className="rounded-2xl border border-ink/10 bg-ink text-bone p-6 relative overflow-hidden sticky top-24">
            <div
              aria-hidden
              className="absolute -bottom-10 -right-10 opacity-[0.06]"
            >
              <PawPrint className="w-48 h-48" strokeWidth={0.6} />
            </div>

            <div className="relative">
              <div className="inline-flex items-center gap-1.5 text-amber text-[11px] font-bold uppercase tracking-widest mb-4">
                <Building2 className="w-3.5 h-3.5" />
                Your organisation
              </div>

              <div className="font-display font-black text-xl leading-tight tracking-tight">
                {profile?.npo_spca_name ?? "Your organisation"}
              </div>

              {profile?.org_neighbourhood && profile?.org_city && (
                <div className="mt-3 flex items-start gap-2 text-sm text-bone/70">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>
                    {profile.org_neighbourhood}, {profile.org_city}
                  </span>
                </div>
              )}

              <div className="mt-6 pt-5 border-t border-bone/10 space-y-3 text-sm">
                {profile?.org_email && (
                  <div className="flex items-start gap-3">
                    <span className="grid place-items-center w-7 h-7 rounded-lg bg-bone/10 text-bone/70 shrink-0">
                      <Mail className="w-3.5 h-3.5" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[11px] uppercase tracking-widest text-bone/40">
                        Email
                      </div>
                      <div className="text-bone/90 truncate">
                        {profile.org_email}
                      </div>
                    </div>
                  </div>
                )}

                {profile?.org_phone && (
                  <div className="flex items-start gap-3">
                    <span className="grid place-items-center w-7 h-7 rounded-lg bg-bone/10 text-bone/70 shrink-0">
                      <Phone className="w-3.5 h-3.5" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[11px] uppercase tracking-widest text-bone/40">
                        Phone
                      </div>
                      <div className="text-bone/90 truncate">
                        {profile.org_phone}
                      </div>
                    </div>
                  </div>
                )}

                {profile?.org_street && (
                  <div className="flex items-start gap-3">
                    <span className="grid place-items-center w-7 h-7 rounded-lg bg-bone/10 text-bone/70 shrink-0">
                      <MapPin className="w-3.5 h-3.5" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[11px] uppercase tracking-widest text-bone/40">
                        Street
                      </div>
                      <div className="text-bone/90 truncate">
                        {profile.org_street}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-5 border-t border-bone/10 flex items-center justify-between text-xs text-bone/50">
                <span>NPO #{profile?.npo_spca_id ?? "—"}</span>
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber" />
                  Verified
                </span>
              </div>
            </div>
          </div>

          {/* tip card */}
          <div className="rounded-2xl border border-amber/25 bg-amber/10 p-5">
            <div className="flex items-start gap-3">
              <span className="grid place-items-center w-9 h-9 rounded-xl bg-amber/20 text-amber shrink-0">
                <Heart className="w-4 h-4" />
              </span>
              <div>
                <div className="font-display font-black text-base tracking-tight">
                  Before you report
                </div>
                <p className="text-xs text-ink/70 mt-1.5 leading-relaxed">
                  Confirm the pet matches the photo and description. If the
                  owner is present, still log it so we can update the record.
                </p>
              </div>
            </div>
          </div>
        </motion.aside>
      </section>

      {/* ============ REPORT MODAL ============ */}
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
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 mx-auto max-w-lg rounded-2xl border border-ink/10 bg-bone shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
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
                    <span className="grid place-items-center w-12 h-12 rounded-xl bg-bone/10 text-amber shrink-0">
                      <Heart className="w-5 h-5" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-amber text-[11px] font-bold uppercase tracking-widest">
                        Report found
                      </div>
                      <div className="font-display font-black text-2xl tracking-tight truncate">
                        Found {reportingPet.pet_name}?
                      </div>
                    </div>
                  </div>
                </div>

                {/* body */}
                <div className="p-6 space-y-5">
                  {/* pet summary */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-amber/10 border border-amber/20">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-amber/20 shrink-0">
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

                  {/* location */}
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
                        className="w-full h-11 pl-4 pr-10 rounded-xl bg-bone border border-ink/10 outline-none text-sm text-ink appearance-none cursor-pointer focus:border-burnt focus:ring-2 focus:ring-burnt/15 transition-all"
                      >
                        <option value="">Choose a street…</option>
                        {locationsByNeighbourhood.map(
                          ([neighbourhood, locs]) => (
                            <optgroup key={neighbourhood} label={neighbourhood}>
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
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
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
                      What did you find?
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
                      placeholder="e.g. Found safely near the Beacon Bay vet clinic. Calm, wearing a red collar."
                      className="w-full px-4 py-3 rounded-xl bg-bone border border-ink/10 outline-none text-sm text-ink placeholder:text-stone/60 focus:border-burnt focus:ring-2 focus:ring-burnt/15 transition-all resize-none"
                    />
                    <div className="mt-1.5 flex items-center justify-between text-xs text-stone">
                      <span>Shared with the owner to verify.</span>
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
                        className="flex items-start gap-2 p-3 rounded-xl bg-burnt-deep/10 text-burnt-deep text-sm"
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
                      className="inline-flex items-center h-10 px-4 rounded-xl border border-ink/15 hover:border-ink/30 hover:bg-ink/5 transition-colors text-sm font-medium disabled:opacity-60"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isPending}
                      className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-burnt text-bone font-medium hover:bg-burnt-deep transition-colors disabled:opacity-60"
                    >
                      {isPending ? (
                        <>
                          <span className="w-4 h-4 rounded-full border-2 border-bone/40 border-t-bone animate-spin" />
                          Reporting…
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Confirm found
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

export default ReportFoundPet;
