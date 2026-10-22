import { useRef, useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  PawPrint,
  ArrowLeft,
  Camera,
  Upload,
  X,
  Check,
  Sparkles,
  Heart,
  AlertCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { usePetOwnerActions } from "../../hooks/usePetOwnerActions";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease },
  }),
};

const SPECIES = [
  { id: 1, name: "Dog", emoji: "🐶" },
  { id: 2, name: "Cat", emoji: "🐱" },
  { id: 3, name: "Bird", emoji: "🐦" },
  { id: 4, name: "Rabbit", emoji: "🐰" },
  { id: 5, name: "Hamster", emoji: "🐹" },
];

const COLOURS = [
  { id: 1, name: "Black", hex: "#1A1A1A" },
  { id: 2, name: "White", hex: "#F5F1EA" },
  { id: 3, name: "Brown", hex: "#A63A1C" },
  { id: 4, name: "Golden", hex: "#E8A33D" },
  { id: 5, name: "Grey", hex: "#8A8178" },
  { id: 6, name: "Spotted", hex: "#4A5D3A" },
];

function RegisterPet() {
  const { registerPetMutation } = usePetOwnerActions();
  const { mutate, isPending } = registerPetMutation;
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [petName, setPetName] = useState("");
  const [speciesId, setSpeciesId] = useState<number | null>(null);
  const [colourId, setColourId] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFile(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    setError(null);
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  function clearImage() {
    setImage(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!petName.trim()) return setError("Give your pet a name.");
    if (!speciesId) return setError("Pick a species.");
    if (!colourId) return setError("Pick a colour.");
    if (!image) return setError("Add a photo of your pet.");

    mutate(
      {
        pet_name: petName.trim(),
        speciesId,
        colorId: colourId,
        description: description.trim(),
        image,
      },
      {
        onSuccess: () => navigate("/owner/pets"),
      },
    );
  }

  return (
    <div className="relative min-h-screen bg-bone text-ink overflow-hidden">
      {/* decorative paws */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <PawPrint className="absolute top-28 right-10 w-12 h-12 text-amber/15 rotate-[25deg]" />
        <PawPrint className="absolute bottom-32 left-12 w-10 h-10 text-burnt/10 rotate-[-30deg]" />
        <PawPrint className="absolute top-1/2 left-1/3 w-8 h-8 text-moss/10 rotate-[15deg]" />
      </div>

      {/* ============ HEADER ============ */}
      <section className="relative max-w-[900px] mx-auto px-6 pt-12 pb-8">
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="show"
        >
          <Link
            to="/owner/pets"
            className="inline-flex items-center gap-1.5 text-sm text-stone hover:text-ink transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to my pets
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-burnt/10 text-burnt text-xs font-bold uppercase tracking-widest mb-5">
            <Heart className="w-3.5 h-3.5" />
            New pet
          </div>

          <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-[-0.03em] leading-[0.95]">
            Meet your
            <br />
            <span className="text-burnt">new friend.</span>
          </h1>

          <p className="mt-5 text-lg text-stone max-w-md leading-relaxed">
            A few details and a photo is all we need.
          </p>
        </motion.div>
      </section>

      {/* ============ FORM ============ */}
      <section className="relative max-w-[900px] mx-auto px-6 pb-24">
        <motion.form
          onSubmit={handleSubmit}
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="show"
          className="rounded-[2rem] border border-ink/10 bg-bone p-6 sm:p-10 shadow-sm"
        >
          {/* IMAGE PICKER */}
          <div>
            <Label>Photo</Label>

            <div className="mt-3">
              {!preview ? (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="group w-full aspect-[16/9] sm:aspect-[21/9] rounded-[1.5rem] border-2 border-dashed border-ink/15 hover:border-burnt bg-amber/5 hover:bg-amber/10 transition-colors grid place-items-center"
                >
                  <div className="text-center px-6">
                    <div className="grid place-items-center w-14 h-14 mx-auto rounded-full bg-burnt/10 text-burnt mb-4 group-hover:scale-110 transition-transform">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div className="font-display font-black text-lg tracking-tight">
                      Snap or upload a photo
                    </div>
                    <div className="text-sm text-stone mt-1">
                      JPG, PNG — clear and well lit works best
                    </div>
                  </div>
                </button>
              ) : (
                <div className="relative rounded-[1.5rem] overflow-hidden border border-ink/10">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full aspect-[16/9] sm:aspect-[21/9] object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-ink/70 to-transparent flex items-end justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-bone/90 text-ink backdrop-blur-md">
                      <Check className="w-3 h-3" />
                      Ready
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-bone/90 text-ink text-xs font-medium hover:bg-bone transition-colors backdrop-blur-md"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={clearImage}
                        className="grid place-items-center w-9 h-9 rounded-full bg-bone/90 text-burnt-deep hover:bg-bone transition-colors backdrop-blur-md"
                        aria-label="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>

          {/* NAME */}
          <div className="mt-8">
            <Label>Name</Label>
            <input
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder="e.g. George"
              maxLength={40}
              className="mt-3 w-full h-14 px-5 rounded-full bg-bone border border-ink/10 outline-none text-base text-ink placeholder:text-stone/60 focus:border-burnt focus:ring-4 focus:ring-burnt/10 transition-all"
            />
          </div>

          {/* SPECIES */}
          <div className="mt-8">
            <Label>Species</Label>
            <div className="mt-3 flex flex-wrap gap-2">
              {SPECIES.map((s) => {
                const active = speciesId === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSpeciesId(s.id)}
                    className={`inline-flex items-center gap-2 h-12 px-5 rounded-full border text-sm font-medium transition-all ${
                      active
                        ? "border-burnt bg-burnt/5 ring-2 ring-burnt/15"
                        : "border-ink/10 bg-bone hover:border-ink/25"
                    }`}
                  >
                    <span className="text-base leading-none">{s.emoji}</span>
                    {s.name}
                    {active && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="grid place-items-center w-4 h-4 rounded-full bg-burnt text-bone"
                      >
                        <Check className="w-2.5 h-2.5" strokeWidth={3} />
                      </motion.span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* COLOUR */}
          <div className="mt-8">
            <Label>Colour</Label>
            <div className="mt-3 flex flex-wrap gap-3">
              {COLOURS.map((c) => {
                const active = colourId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setColourId(c.id)}
                    title={c.name}
                    aria-label={c.name}
                    className={`group relative grid place-items-center w-12 h-12 rounded-full border-2 transition-all ${
                      active
                        ? "border-burnt scale-110"
                        : "border-ink/10 hover:border-ink/30"
                    }`}
                  >
                    <span
                      className="w-8 h-8 rounded-full border border-ink/10"
                      style={{ backgroundColor: c.hex }}
                    />
                    {active && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 grid place-items-center w-5 h-5 rounded-full bg-burnt text-bone shadow"
                      >
                        <Check className="w-3 h-3" strokeWidth={3} />
                      </motion.span>
                    )}
                  </button>
                );
              })}
            </div>
            {colourId && (
              <div className="mt-3 text-sm text-stone">
                {COLOURS.find((c) => c.id === colourId)?.name}
              </div>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="mt-8">
            <Label>Description</Label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A friendly and playful brown dog…"
              rows={4}
              maxLength={300}
              className="mt-3 w-full px-5 py-4 rounded-[1.5rem] bg-bone border border-ink/10 outline-none text-base text-ink placeholder:text-stone/60 focus:border-burnt focus:ring-4 focus:ring-burnt/10 transition-all resize-none"
            />
            <div className="mt-2 text-right text-xs text-stone tabular-nums">
              {description.length}/300
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex items-start gap-2 p-3 rounded-2xl bg-burnt-deep/10 text-burnt-deep text-sm"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* SUBMIT */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 h-14 px-8 rounded-full bg-burnt text-bone font-medium hover:bg-burnt-deep transition-colors disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              {isPending ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-bone/40 border-t-bone animate-spin" />
                  Adding…
                </>
              ) : (
                <>
                  <PawPrint className="w-4 h-4" />
                  Add pet
                  <span className="inline-block group-hover:rotate-90 transition-transform">
                    <Sparkles className="w-3.5 h-3.5" />
                  </span>
                </>
              )}
            </button>

            <Link
              to="/owner/pets"
              className="inline-flex items-center h-14 px-6 rounded-full text-sm font-medium text-stone hover:text-ink hover:bg-ink/5 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </motion.form>
      </section>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs font-bold uppercase tracking-widest text-stone">
      {children}
    </div>
  );
}

export default RegisterPet;
