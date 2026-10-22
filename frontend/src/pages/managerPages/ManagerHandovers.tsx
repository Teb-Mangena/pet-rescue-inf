import { useMemo } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  ArrowLeft,
  ClipboardList,
  Check,
  X,
  CheckCircle2,
  Clock,
  ImageOff,
  PawPrint,
  Mail,
  User,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { Link } from "react-router";
import PageLoader from "../../components/PageLoader";
import { useManagerActions } from "../../hooks/useManagerActions";
import type { HandoverData } from "../../hooks/useManagerActions";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease },
  }),
};

const STATUS_META = {
  pending: { label: "Pending", tone: "bg-amber/15 text-amber", icon: Clock },
  accepted: {
    label: "Accepted",
    tone: "bg-moss/10 text-moss",
    icon: CheckCircle2,
  },
  completed: { label: "Completed", tone: "bg-moss text-bone", icon: Check },
  rejected: {
    label: "Rejected",
    tone: "bg-burnt-deep/10 text-burnt-deep",
    icon: X,
  },
  cancelled: {
    label: "Cancelled",
    tone: "bg-ink/5 text-stone",
    icon: AlertTriangle,
  },
} as const;

function ManagerHandovers() {
  const { handoversQuery, updateHandoverStatusMutation } = useManagerActions();
  const { data, isLoading } = handoversQuery;
  const { mutate: updateStatus, isPending: isUpdating } =
    updateHandoverStatusMutation;

  const handovers = useMemo(() => data?.handovers ?? [], [data]);

  if (isLoading) return <PageLoader />;

  const handleAction = (
    id: number,
    status: "accepted" | "rejected" | "completed",
  ) => {
    updateStatus({ id, status });
  };

  return (
    <div className="min-h-screen bg-bone text-ink">
      {/* ============ HEADER ============ */}
      <section className="border-b border-ink/10 bg-bone/60 backdrop-blur-sm">
        <div className="max-w-[1200px] mx-auto px-6 py-8">
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
                  <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber/15 text-amber text-[11px] font-bold uppercase tracking-widest">
                    <ClipboardList className="w-3 h-3" />
                    Manager
                  </span>
                </div>

                <h1 className="font-display font-black text-3xl sm:text-4xl tracking-[-0.02em]">
                  Incoming Handovers
                </h1>
                <p className="mt-2 text-stone max-w-xl">
                  Review pets found by community members and officially accept
                  them into your organization.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ LIST ============ */}
      <section className="max-w-[1200px] mx-auto px-6 py-10 space-y-6">
        {handovers.length === 0 ? (
          <motion.div
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate="show"
            className="py-20 text-center rounded-2xl border border-ink/10 bg-bone"
          >
            <div className="grid place-items-center w-14 h-14 mx-auto rounded-2xl bg-ink/5 text-stone mb-4">
              <ClipboardList className="w-6 h-6" />
            </div>
            <h2 className="font-display font-black text-xl tracking-tight">
              No incoming handovers
            </h2>
            <p className="text-sm text-stone mt-1 max-w-sm mx-auto">
              When a community member finds a missing pet and hands them over to
              your organization, it will appear here.
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            <AnimatePresence>
              {handovers.map((handover, i) => {
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
                    className="rounded-2xl border border-ink/10 bg-bone overflow-hidden hover:border-ink/20 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* PET IMAGE */}
                      <div className="md:w-64 relative bg-ink/5 aspect-square md:aspect-auto shrink-0 border-b md:border-b-0 md:border-r border-ink/10">
                        {handover.pet_image_url ? (
                          <img
                            src={handover.pet_image_url}
                            alt={handover.pet_name}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 grid place-items-center text-stone">
                            <ImageOff className="w-8 h-8" />
                          </div>
                        )}
                        <span
                          className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md ${statusMeta.tone}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {statusMeta.label}
                        </span>
                      </div>

                      {/* CONTENT */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                          <div>
                            <h3 className="font-display font-black text-2xl tracking-tight leading-tight">
                              {handover.pet_name}
                            </h3>
                            <div className="text-sm text-stone mt-1">
                              {handover.species_name} · {handover.colour_name}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-stone">
                              Date Found
                            </div>
                            <div className="text-sm font-medium">
                              {new Date(
                                handover.handover_date,
                              ).toLocaleDateString("en-ZA", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-ink/5 border border-ink/5 mb-6">
                          <div className="text-[10px] font-bold uppercase tracking-widest text-stone mb-1">
                            Reason for handover
                          </div>
                          <p className="text-sm text-ink/80 italic">
                            "{handover.reason || "No reason provided."}"
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-ink/5 pt-4">
                          {/* MEMBER INFO */}
                          <div className="flex items-center gap-3">
                            <span className="grid place-items-center w-9 h-9 rounded-full bg-amber/15 text-amber font-display font-black text-xs">
                              {handover.member_firstname.charAt(0)}
                              {handover.member_lastname.charAt(0)}
                            </span>
                            <div className="min-w-0">
                              <div className="text-sm font-semibold truncate flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-stone" />
                                {handover.member_firstname}{" "}
                                {handover.member_lastname}
                              </div>
                              <div className="text-xs text-stone truncate flex items-center gap-1.5 mt-0.5">
                                <Mail className="w-3 h-3" />
                                {handover.member_email}
                              </div>
                            </div>
                          </div>

                          {/* ACTIONS */}
                          <div className="flex items-center gap-2">
                            {handover.status === "pending" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleAction(
                                      handover.handover_id,
                                      "rejected",
                                    )
                                  }
                                  disabled={isUpdating}
                                  className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg text-sm font-medium bg-burnt-deep/10 text-burnt-deep hover:bg-burnt-deep hover:text-bone transition-colors disabled:opacity-50"
                                >
                                  <X className="w-4 h-4" />
                                  Reject
                                </button>
                                <button
                                  onClick={() =>
                                    handleAction(
                                      handover.handover_id,
                                      "accepted",
                                    )
                                  }
                                  disabled={isUpdating}
                                  className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg text-sm font-medium bg-moss text-bone hover:bg-moss/90 transition-colors disabled:opacity-50"
                                >
                                  <Check className="w-4 h-4" />
                                  Accept
                                </button>
                              </>
                            )}

                            {handover.status === "accepted" && (
                              <button
                                onClick={() =>
                                  handleAction(
                                    handover.handover_id,
                                    "completed",
                                  )
                                }
                                disabled={isUpdating}
                                className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg text-sm font-medium bg-ink text-bone hover:bg-ink/80 transition-colors disabled:opacity-50"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                Mark as Completed
                              </button>
                            )}

                            {(handover.status === "completed" ||
                              handover.status === "rejected") && (
                              <span className="text-sm font-medium text-stone inline-flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4" />
                                Processed
                              </span>
                            )}
                          </div>
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
    </div>
  );
}

export default ManagerHandovers;
