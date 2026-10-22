import { motion, type Variants } from "framer-motion";
import { PawPrint } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

// Five paws walking across the screen
const pawVariants: Variants = {
  initial: { opacity: 0, scale: 0.5, y: 8 },
  animate: (i: number) => ({
    opacity: [0, 1, 1, 0.15],
    scale: [0.5, 1.05, 1, 1],
    y: [8, 0, 0, 0],
    transition: {
      duration: 1.6,
      delay: i * 0.18,
      repeat: Infinity,
      ease,
    },
  }),
};

function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-bone text-ink">
      {/* faint grid backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="relative flex flex-col items-center">
        {/* walking paws */}
        <div className="flex items-end gap-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.span
              key={i}
              custom={i}
              variants={pawVariants}
              initial="initial"
              animate="animate"
              className="grid place-items-center"
              style={{
                // alternate up/down like real paw steps
                marginBottom: i % 2 === 0 ? 0 : 10,
              }}
            >
              <PawPrint
                className="w-6 h-6 text-burnt"
                strokeWidth={2.25}
                fill="currentColor"
                fillOpacity={0.15}
              />
            </motion.span>
          ))}
        </div>

        {/* wordmark */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease }}
          className="mt-8 flex items-center gap-2"
        >
          <span className="font-display font-black text-xl tracking-tight">
            Pet Rescue
          </span>
        </motion.div>

        {/* caption */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35, ease }}
          className="mt-2 text-xs text-stone tracking-widest uppercase"
        >
          Fetching…
        </motion.p>
      </div>
    </div>
  );
}

export default PageLoader;
