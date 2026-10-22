import { useMemo, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Radio,
  ShieldCheck,
  ClipboardList,
  CheckCircle2,
  Clock,
  MapPin,
  Search,
  Filter,
  ArrowUpRight,
  MoreHorizontal,
  Play,
  Check,
  Inbox,
  AlertTriangle,
  TrendingUp,
  User as UserIcon,
} from "lucide-react";
import { Link } from "react-router";
import PageLoader from "../components/PageLoader";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease },
  }),
};

const TONE_MAP = {
  burnt: "bg-burnt/10 text-burnt",
  amber: "bg-amber/15 text-amber",
  moss: "bg-moss/10 text-moss",
  stone: "bg-ink/5 text-stone",
} as const;

// ---------- Task status ----------
type TaskStatus = "assigned" | "in_progress" | "completed";

const STATUS_META: Record<
  TaskStatus,
  { label: string; icon: typeof CheckCircle2; tone: string }
> = {
  assigned: {
    label: "Assigned",
    icon: Clock,
    tone: "bg-amber/15 text-amber",
  },
  in_progress: {
    label: "In progress",
    icon: Play,
    tone: "bg-burnt/10 text-burnt",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    tone: "bg-moss/10 text-moss",
  },
};

const PRIORITY_META: Record<
  "low" | "medium" | "high",
  { label: string; tone: string }
> = {
  low: { label: "Low", tone: "bg-ink/5 text-stone" },
  medium: { label: "Medium", tone: "bg-amber/15 text-amber" },
  high: { label: "High", tone: "bg-burnt-deep/10 text-burnt-deep" },
};

// ---------- Mock data (replace with useOperatorActions().tasksQuery) ----------
interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: "low" | "medium" | "high";
  location: string;
  petName: string;
  species: string;
  dueLabel: string;
  reporterName: string;
}

const MOCK_TASKS: Task[] = [
  {
    id: 101,
    title: "Search Beacon Bay area",
    description:
      "Follow up on a sighting reported this morning near the vet clinic.",
    status: "in_progress",
    priority: "high",
    location: "Beacon Bay, East London",
    petName: "Biscuit",
    species: "Golden Retriever",
    dueLabel: "Due today",
    reporterName: "Amara Nkosi",
  },
  {
    id: 102,
    title: "Visit reported found dog",
    description:
      "Community member reported a found dog near the beach parking lot.",
    status: "assigned",
    priority: "medium",
    location: "Gonubie Beach",
    petName: "Unknown",
    species: "Mixed breed",
    dueLabel: "Due tomorrow",
    reporterName: "Thabo Mokoena",
  },
  {
    id: 103,
    title: "Verify microchip at shelter",
    description: "Cross-check with SPCA records for recently found black cat.",
    status: "assigned",
    priority: "low",
    location: "SPCA East London",
    petName: "Mochi",
    species: "Black cat",
    dueLabel: "Due in 2 days",
    reporterName: "Lerato Dlamini",
  },
  {
    id: 104,
    title: "Deliver reunited pet",
    description: "Owner confirmed match. Transport pet to owner's address.",
    status: "completed",
    priority: "medium",
    location: "Nahoon, East London",
    petName: "Rex",
    species: "German Shepherd",
    dueLabel: "Completed",
    reporterName: "Sipho Khumalo",
  },
  {
    id: 105,
    title: "Photograph found kitten",
    description: "Take clear photos for the found pets listing.",
    status: "completed",
    priority: "low",
    location: "Cambridge, East London",
    petName: "Unknown",
    species: "Kitten",
    dueLabel: "Completed",
    reporterName: "Naledi Mahlangu",
  },
];

type StatusFilter = "all" | TaskStatus;

function RescueOperator() {
  // NOTE: swap these two lines with your hook when ready:
  //   const { tasksQuery } = useOperatorActions();
  //   const { data: tasks = [], isLoading } = tasksQuery;
  const tasks = MOCK_TASKS;
  const isLoading = false;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  // --- counts ---
  const counts = useMemo(() => {
    return {
      all: tasks.length,
      assigned: tasks.filter((t) => t.status === "assigned").length,
      in_progress: tasks.filter((t) => t.status === "in_progress").length,
      completed: tasks.filter((t) => t.status === "completed").length,
    };
  }, [tasks]);

  // --- filtered ---
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tasks.filter((t) => {
      const matchesQuery =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.petName.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || t.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [tasks, search, statusFilter]);

  const stats = [
    {
      label: "Assigned to me",
      value: counts.all,
      delta: "Total tasks",
      icon: ClipboardList,
      tone: "burnt" as const,
    },
    {
      label: "In progress",
      value: counts.in_progress,
      delta: "Currently active",
      icon: Play,
      tone: "amber" as const,
    },
    {
      label: "Completed",
      value: counts.completed,
      delta: "All-time",
      icon: CheckCircle2,
      tone: "moss" as const,
    },
    {
      label: "Awaiting action",
      value: counts.assigned,
      delta: "Not started",
      icon: Clock,
      tone: "stone" as const,
    },
  ];

  if (isLoading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-bone text-ink">
      {/* ============ HEADER ============ */}
      <section className="border-b border-ink/10 bg-bone/60 backdrop-blur-sm">
        <div className="max-w-350 mx-auto px-6 py-8">
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            animate="show"
            className="flex flex-wrap items-start justify-between gap-6"
          >
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
                Your tasks today
              </h1>
              <p className="mt-2 text-stone max-w-xl">
                Complete tasks, update statuses, and report found pets as you
                work through the field.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/operator/report-found"
                className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-burnt text-bone font-medium hover:bg-burnt-deep transition-colors group"
              >
                <MapPin className="w-4 h-4" />
                Report found pet
                <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="max-w-350 mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                variants={fadeUp}
                custom={1 + i}
                initial="hidden"
                animate="show"
                className="p-5 rounded-2xl border border-ink/10 bg-bone hover:border-ink/20 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <span
                    className={`grid place-items-center w-10 h-10 rounded-xl ${TONE_MAP[s.tone]}`}
                  >
                    <Icon className="w-5 h-5" />
                  </span>
                  <TrendingUp className="w-4 h-4 text-stone" />
                </div>
                <div className="mt-4">
                  <div className="font-display font-black text-3xl tracking-tight text-ink tabular-nums">
                    {s.value}
                  </div>
                  <div className="mt-1 text-sm font-medium text-ink">
                    {s.label}
                  </div>
                  <div className="text-xs text-stone mt-1.5">{s.delta}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ============ TASKS ============ */}
      <section className="max-w-350 mx-auto px-6 pb-20">
        <motion.div
          variants={fadeUp}
          custom={5}
          initial="hidden"
          animate="show"
          className="rounded-2xl border border-ink/10 bg-bone overflow-hidden"
        >
          {/* toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-ink/10">
            <div className="flex items-center gap-3">
              <h2 className="font-display font-black text-xl tracking-tight">
                Task board
              </h2>
              <span className="text-xs text-stone px-2 py-0.5 rounded-full bg-ink/5 tabular-nums">
                {filtered.length}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-2 h-9 px-3 rounded-lg bg-bone border border-ink/10 focus-within:border-burnt focus-within:ring-2 focus-within:ring-burnt/15 transition-all">
                <Search className="w-4 h-4 text-stone shrink-0" />
                <input
                  type="text"
                  placeholder="Search task, pet, or location…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-52 sm:w-64 bg-transparent outline-none text-sm text-ink placeholder:text-stone/60"
                />
              </label>
            </div>
          </div>

          {/* status chips */}
          <div className="flex flex-wrap items-center gap-2 px-5 py-3 border-b border-ink/10 bg-bone/40">
            <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-widest text-stone">
              <Filter className="w-3 h-3" />
              Status
            </span>
            {(
              [
                ["all", "All", counts.all],
                ["assigned", "Assigned", counts.assigned],
                ["in_progress", "In progress", counts.in_progress],
                ["completed", "Completed", counts.completed],
              ] as const
            ).map(([value, label, count]) => {
              const active = statusFilter === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setStatusFilter(value)}
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                    active
                      ? "bg-ink text-bone"
                      : "bg-ink/5 text-stone hover:bg-ink/10"
                  }`}
                >
                  {label}
                  <span
                    className={`tabular-nums ${
                      active ? "text-bone/70" : "text-stone"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* task list */}
          <div className="divide-y divide-ink/5">
            {filtered.length === 0 && (
              <div className="p-16 text-center">
                <div className="grid place-items-center w-12 h-12 mx-auto rounded-2xl bg-ink/5 text-stone mb-3">
                  <Inbox className="w-5 h-5" />
                </div>
                <div className="font-medium">
                  {search || statusFilter !== "all"
                    ? "No tasks match"
                    : "No tasks assigned"}
                </div>
                <div className="text-sm text-stone mt-1 max-w-xs mx-auto">
                  {search || statusFilter !== "all"
                    ? "Try a different search or clear the filters."
                    : "You're all caught up. Check back later."}
                </div>
              </div>
            )}

            <AnimatePresence>
              {filtered.map((t, i) => {
                const statusMeta = STATUS_META[t.status];
                const StatusIcon = statusMeta.icon;
                const priorityMeta = PRIORITY_META[t.priority];

                return (
                  <motion.article
                    key={t.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      delay: 0.05 + i * 0.035,
                      duration: 0.3,
                      ease,
                    }}
                    className="p-5 sm:p-6 hover:bg-bone/60 transition-colors group"
                  >
                    <div className="flex flex-wrap items-start gap-4">
                      {/* left marker */}
                      <span
                        className={`grid place-items-center w-11 h-11 rounded-xl shrink-0 ${statusMeta.tone}`}
                      >
                        <StatusIcon className="w-5 h-5" />
                      </span>

                      {/* main */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${statusMeta.tone}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {statusMeta.label}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${priorityMeta.tone}`}
                          >
                            <AlertTriangle className="w-3 h-3" />
                            {priorityMeta.label}
                          </span>
                          <span className="text-[11px] text-stone">
                            #{t.id}
                          </span>
                        </div>

                        <h3 className="font-display font-black text-lg tracking-tight leading-snug">
                          {t.title}
                        </h3>
                        <p className="text-sm text-stone mt-1 max-w-2xl">
                          {t.description}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-stone">
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            {t.location}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <ClipboardList className="w-3.5 h-3.5" />
                            {t.petName} · {t.species}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <UserIcon className="w-3.5 h-3.5" />
                            Reported by {t.reporterName}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1.5 ${
                              t.status === "completed"
                                ? "text-moss"
                                : "text-ink"
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            {t.dueLabel}
                          </span>
                        </div>
                      </div>

                      {/* actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        {t.status === "assigned" && (
                          <button
                            type="button"
                            className="hidden sm:inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium bg-burnt/10 text-burnt hover:bg-burnt hover:text-bone transition-colors"
                          >
                            <Play className="w-3 h-3" />
                            Start
                          </button>
                        )}

                        {t.status === "in_progress" && (
                          <button
                            type="button"
                            className="hidden sm:inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium bg-moss/10 text-moss hover:bg-moss hover:text-bone transition-colors"
                          >
                            <Check className="w-3 h-3" />
                            Complete
                          </button>
                        )}

                        {t.status === "completed" && (
                          <span className="hidden sm:inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium bg-moss/10 text-moss">
                            <CheckCircle2 className="w-3 h-3" />
                            Done
                          </span>
                        )}

                        <button
                          type="button"
                          className="grid place-items-center w-8 h-8 rounded-lg text-stone hover:text-ink hover:bg-ink/5 transition-colors"
                          aria-label="Task actions"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>

          {/* footer */}
          {filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-ink/10 flex items-center justify-between text-xs text-stone">
              <span>
                Showing{" "}
                <span className="text-ink font-medium">{filtered.length}</span>{" "}
                of <span className="text-ink font-medium">{tasks.length}</span>{" "}
                {tasks.length === 1 ? "task" : "tasks"}
              </span>
              <span className="hidden sm:inline">
                Scoped to your organisation
              </span>
            </div>
          )}
        </motion.div>
      </section>
    </div>
  );
}

export default RescueOperator;
