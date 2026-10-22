import { useMemo, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  PawPrint,
  Plus,
  Search,
  Heart,
  ImageOff,
  Trash2,
  Megaphone,
  Eye,
  Inbox,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router";
import { usePetOwnerActions } from "../../hooks/usePetOwnerActions";
import type { Pet } from "../../types/pets";
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

// Rotations give the grid a hand-placed feel
const TILT = [-1.5, 1, -1, 1.5, -0.8, 1.2];

function MyPets() {
  const { myPetsQuery, deleteMyPetMutation } = usePetOwnerActions();
  const { data, isLoading } = myPetsQuery;
  const { mutate: deletePet, isPending: isDeleting } = deleteMyPetMutation;

  const pets: Pet[] = useMemo(() => data?.pets ?? [], [data]);

  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<Pet | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return pets;
    return pets.filter(
      (p) =>
        p.pet_name.toLowerCase().includes(q) ||
        p.species_name.toLowerCase().includes(q) ||
        p.colour_name.toLowerCase().includes(q),
    );
  }, [pets, search]);

  function handleDelete() {
    if (!confirmDelete) return;
    deletePet(confirmDelete.pet_id, {
      onSuccess: () => setConfirmDelete(null),
    });
  }

  if (isLoading) return <PageLoader />;

  return (
    <div className="relative min-h-screen bg-bone text-ink overflow-hidden">
      {/* decorative paws */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <PawPrint className="absolute top-24 left-8 w-12 h-12 text-amber/15 rotate-[-20deg]" />
        <PawPrint className="absolute top-40 right-16 w-8 h-8 text-burnt/10 rotate-[30deg]" />
        <PawPrint className="absolute bottom-24 left-1/4 w-10 h-10 text-moss/10 rotate-[15deg]" />
        <PawPrint className="absolute bottom-40 right-1/3 w-7 h-7 text-amber/15 rotate-[-40deg]" />
      </div>

      {/* ============ HEADER ============ */}
      <section className="relative max-w-[1200px] mx-auto px-6 pt-12 pb-8">
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="show"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber/15 text-amber text-xs font-bold uppercase tracking-widest mb-5">
            <PawPrint className="w-3.5 h-3.5" />
            My pets
          </div>

          <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-[-0.03em] leading-[0.95]">
            Your furry
            <br />
            <span className="text-burnt">family.</span>
          </h1>

          <p className="mt-5 text-lg text-stone max-w-md leading-relaxed">
            Every pet you've registered, all in one place. Tap one to see their
            details.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/owner/pets/new"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-burnt text-bone font-medium hover:bg-burnt-deep transition-colors group"
            >
              <Plus className="w-4 h-4" />
              Add a pet
              <span className="inline-block group-hover:rotate-90 transition-transform">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 h-12 px-5 rounded-full text-sm font-medium text-stone hover:text-ink hover:bg-ink/5 transition-colors"
            >
              Back home
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ============ SEARCH ============ */}
      <section className="relative max-w-[1200px] mx-auto px-6 pb-6">
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
            placeholder="Find a pet…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="grow bg-transparent outline-none text-base text-ink placeholder:text-stone/60"
          />
          {pets.length > 0 && (
            <span className="text-xs text-stone shrink-0 tabular-nums">
              {filtered.length}/{pets.length}
            </span>
          )}
        </motion.label>
      </section>

      {/* ============ PET GRID ============ */}
      <section className="relative max-w-[1200px] mx-auto px-6 pb-24">
        {/* empty — no pets at all */}
        {pets.length === 0 && (
          <motion.div
            variants={fadeUp}
            custom={2}
            initial="hidden"
            animate="show"
            className="py-20 text-center"
          >
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 rounded-full bg-amber/15 grid place-items-center animate-bob">
                <PawPrint className="w-10 h-10 text-amber" />
              </div>
              <PawPrint className="absolute -top-3 -right-6 w-6 h-6 text-burnt/40 rotate-[30deg]" />
              <PawPrint className="absolute -bottom-2 -left-5 w-5 h-5 text-moss/40 rotate-[-25deg]" />
            </div>

            <h2 className="font-display font-black text-2xl tracking-tight">
              No pets yet
            </h2>
            <p className="text-stone mt-2 max-w-sm mx-auto">
              Register your first pet and we'll keep them safe and sound right
              here.
            </p>
            <Link
              to="/owner/pets/new"
              className="inline-flex items-center gap-2 mt-6 h-11 px-6 rounded-full bg-burnt text-bone font-medium hover:bg-burnt-deep transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add your first pet
            </Link>
          </motion.div>
        )}

        {/* empty — filtered out */}
        {pets.length > 0 && filtered.length === 0 && (
          <motion.div
            variants={fadeUp}
            custom={2}
            initial="hidden"
            animate="show"
            className="py-16 text-center"
          >
            <div className="grid place-items-center w-16 h-16 mx-auto rounded-2xl bg-ink/5 text-stone mb-4">
              <Inbox className="w-6 h-6" />
            </div>
            <h2 className="font-display font-black text-xl tracking-tight">
              No pets match "{search}"
            </h2>
            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-4 text-sm font-medium text-burnt hover:text-burnt-deep transition-colors"
            >
              Clear search
            </button>
          </motion.div>
        )}

        {/* grid */}
        {filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filtered.map((pet, i) => {
                const tilt = TILT[i % TILT.length];
                const isMissing = pet.pet_status === "missing";

                return (
                  <motion.article
                    key={pet.pet_id}
                    layout
                    initial={{ opacity: 0, y: 20, rotate: tilt * 2 }}
                    animate={{ opacity: 1, y: 0, rotate: tilt }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      delay: 0.05 + i * 0.06,
                      duration: 0.5,
                      ease,
                    }}
                    whileHover={{
                      rotate: 0,
                      y: -6,
                      transition: { duration: 0.25, ease },
                    }}
                    className="group relative"
                  >
                    {/* card */}
                    <div className="rounded-[2rem] border border-ink/10 bg-bone overflow-hidden shadow-sm hover:shadow-xl hover:shadow-ink/5 transition-shadow">
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

                        {/* status pill */}
                        <span
                          className={`absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest backdrop-blur-md ${
                            isMissing
                              ? "bg-burnt/90 text-bone"
                              : "bg-bone/90 text-moss"
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
                              Safe
                            </>
                          )}
                        </span>
                      </div>

                      {/* body */}
                      <div className="p-6">
                        <div className="font-display font-black text-2xl tracking-tight leading-tight">
                          {pet.pet_name}
                        </div>
                        <div className="text-sm text-stone mt-1">
                          {pet.species_name} · {pet.colour_name}
                        </div>

                        {pet.pet_description && (
                          <p className="mt-3 text-sm text-ink/70 line-clamp-2 leading-relaxed">
                            {pet.pet_description}
                          </p>
                        )}

                        {/* actions */}
                        <div className="mt-6 flex items-center gap-2">
                          <Link
                            to={`/pets/${pet.pet_id}`}
                            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-full bg-ink text-bone text-sm font-medium hover:bg-burnt transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </Link>

                          {!isMissing && (
                            <Link
                              to={`/owner/report-lost?petId=${pet.pet_id}`}
                              className="grid place-items-center w-10 h-10 rounded-full bg-amber/15 text-amber hover:bg-amber hover:text-ink transition-colors"
                              title="Report lost"
                              aria-label="Report lost"
                            >
                              <Megaphone className="w-4 h-4" />
                            </Link>
                          )}

                          <div className="flex-1" />

                          <button
                            type="button"
                            onClick={() => setConfirmDelete(pet)}
                            className="grid place-items-center w-10 h-10 rounded-full text-stone hover:text-burnt-deep hover:bg-burnt-deep/10 transition-colors"
                            title="Delete pet"
                            aria-label="Delete pet"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* ============ DELETE MODAL ============ */}
      <AnimatePresence>
        {confirmDelete && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => !isDeleting && setConfirmDelete(null)}
              className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.25, ease }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 mx-auto max-w-md rounded-[2rem] border border-ink/10 bg-bone shadow-2xl overflow-hidden"
            >
              <div className="p-7 text-center">
                <div className="grid place-items-center w-16 h-16 mx-auto rounded-full bg-burnt-deep/10 text-burnt-deep mb-5">
                  <Trash2 className="w-7 h-7" />
                </div>

                <h3 className="font-display font-black text-2xl tracking-tight">
                  Say goodbye to {confirmDelete.pet_name}?
                </h3>
                <p className="text-sm text-stone mt-3 leading-relaxed">
                  This will remove {confirmDelete.pet_name} from your registry
                  and cancel any active lost reports. You can't undo this.
                </p>

                <div className="mt-7 flex items-center gap-2 justify-center">
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(null)}
                    disabled={isDeleting}
                    className="inline-flex items-center h-11 px-5 rounded-full border border-ink/15 hover:border-ink/30 hover:bg-ink/5 transition-colors text-sm font-medium disabled:opacity-60"
                  >
                    Keep them
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-burnt-deep text-bone font-medium hover:bg-burnt-deep/90 transition-colors disabled:opacity-60"
                  >
                    {isDeleting ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-bone/40 border-t-bone animate-spin" />
                        Removing…
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MyPets;
