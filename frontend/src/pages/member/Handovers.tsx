import { useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import {
  ArrowLeft,
  PawPrint,
  Building2,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRightLeft,
  Plus,
} from "lucide-react";
import { Link } from "react-router";
import PageLoader from "../../components/PageLoader";
import { useHandovers } from "../../hooks/useHandovers";
import type { Handover } from "../../hooks/useHandovers";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease },
  }),
};

// Map statuses to colors and icons
const STATUS_META: Record<
  Handover["status"],
  { label: string; tone: string; icon: any }
> = {
  pending: {
    label: "Pending Review",
    tone: "bg-amber/15 text-amber",
    icon: Clock,
  },
  accepted: {
    label: "Accepted",
    tone: "bg-moss/10 text-moss",
    icon: CheckCircle2,
  },
  completed: {
    label: "Completed",
    tone: "bg-moss text-bone",
    icon: CheckCircle2,
  },
  rejected: {
    label: "Rejected",
    tone: "bg-burnt-deep/10 text-burnt-deep",
    icon: XCircle,
  },
  cancelled: {
    label: "Cancelled",
    tone: "bg-ink/5 text-stone",
    icon: AlertCircle,
  },
};

function MyHandovers() {
  const { myHandoversQuery } = useHandovers();
  const { data, isLoading } = myHandoversQuery;

  const handovers: Handover[] = useMemo(() => data?.handovers ?? [], [data]);

  if (isLoading) return <PageLoader />;

  return (
    <div className="relative min-h-screen bg-bone text-ink overflow-hidden">
      {/* decorative paws */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <PawPrint className="absolute top-32 right-12 w-12 h-12 text-amber/15 rotate-[25deg]" />
        <PawPrint className="absolute top-48 left-16 w-8 h-8 text-burnt/10 rotate-[-20deg]" />
        <PawPrint className="absolute bottom-40 right-1/4 w-10 h-10 text-moss/10 rotate-[15deg]" />
      </div>

      {/* HEADER */}
      <section className="relative max-w-[1000px] mx-auto px-6 pt-12 pb-8">
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="show"
        >
          {/* <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-stone hover:text-ink transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to dashboard
          </Link> */}

          <div className="flex flex-wrap items-end justify-between gap-6 mb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ink text-bone text-xs font-bold uppercase tracking-widest mb-5">
                <ArrowRightLeft className="w-3.5 h-3.5" />
                My Handovers
              </div>

              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-[-0.03em] leading-[0.95]">
                Safe hands,
                <br />
                <span className="text-moss">happy tails.</span>
              </h1>
            </div>

            {/* ADDED: Create Button */}
            <Link
              to="/community/handovers/new"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-moss text-bone font-medium hover:bg-moss/90 transition-colors shrink-0 mb-1"
            >
              <Plus className="w-4 h-4" />
              New handover
            </Link>
          </div>

          <p className="mt-5 text-lg text-stone max-w-md leading-relaxed">
            Track the pets you've found and handed over to local rescue
            organizations.
          </p>
        </motion.div>
      </section>

      {/* LIST */}
      <section className="relative max-w-[1000px] mx-auto px-6 pb-24 space-y-4">
        {handovers.length === 0 ? (
          <motion.div
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate="show"
            className="py-20 text-center rounded-[2rem] border border-dashed border-ink/15 bg-bone/60"
          >
            <div className="text-6xl mb-5 animate-bob">🤝</div>
            <h2 className="font-display font-black text-2xl tracking-tight">
              No handovers yet
            </h2>
            <p className="text-stone mt-2 max-w-sm mx-auto">
              When you find a pet and hand them over to a shelter, you'll be
              able to track the process right here.
            </p>
          </motion.div>
        ) : (
          handovers.map((handover, i) => {
            const statusMeta =
              STATUS_META[handover.status] || STATUS_META.pending;
            const StatusIcon = statusMeta.icon;

            return (
              <motion.article
                key={handover.handover_id}
                variants={fadeUp}
                custom={1 + i}
                initial="hidden"
                animate="show"
                className="rounded-[2rem] border border-ink/10 bg-bone overflow-hidden shadow-sm"
              >
                <div className="flex flex-col md:flex-row">
                  {/* PET INFO (Left) */}
                  <div className="md:w-1/3 relative bg-ink/5 aspect-square md:aspect-auto">
                    {handover.pet_image_url ? (
                      <img
                        src={handover.pet_image_url}
                        alt="Pet"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center text-stone">
                        <PawPrint className="w-12 h-12" />
                      </div>
                    )}
                    <span
                      className={`absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest backdrop-blur-md ${statusMeta.tone}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {statusMeta.label}
                    </span>
                  </div>

                  {/* DETAILS (Right) */}
                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4">
                      <div className="flex items-center gap-1.5 text-sm text-stone">
                        <Calendar className="w-4 h-4" />
                        {new Date(handover.handover_date).toLocaleDateString(
                          "en-ZA",
                          { day: "numeric", month: "short", year: "numeric" },
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-stone">
                        <PawPrint className="w-4 h-4" />
                        {handover.species_name} · {handover.colour_name}
                      </div>
                    </div>

                    <h3 className="font-display font-black text-2xl tracking-tight">
                      Handed to {handover.npo_spca_name}
                    </h3>

                    <div className="mt-4 p-4 rounded-2xl bg-ink/5 border border-ink/5">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-stone mb-1">
                        Reason
                      </div>
                      <p className="text-sm text-ink/80 italic">
                        "{handover.reason || "No reason provided."}"
                      </p>
                    </div>

                    {/* ORG CONTACT */}
                    <div className="mt-6 grid sm:grid-cols-2 gap-4">
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-stone shrink-0 mt-0.5" />
                        <div className="text-sm text-ink leading-tight">
                          {handover.organization_street}
                          <br />
                          <span className="text-stone text-xs">
                            {handover.organization_neighbourhood},{" "}
                            {handover.organization_city}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-ink">
                          <Mail className="w-4 h-4 text-stone shrink-0" />
                          <span className="truncate">
                            {handover.organization_email}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-ink">
                          <Phone className="w-4 h-4 text-stone shrink-0" />
                          <span>{handover.organization_phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })
        )}
      </section>
    </div>
  );
}

export default MyHandovers;
