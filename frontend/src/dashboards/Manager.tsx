import { useMemo, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Briefcase,
  ShieldCheck,
  Users,
  Radio,
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  Search,
  UserPlus,
  Filter,
  Inbox,
  MoreHorizontal,
  TrendingUp,
  Play,
  User as UserIcon,
  MapPin,
  ArrowRightLeft,
} from "lucide-react";
import { Link } from "react-router";
import PageLoader from "../components/PageLoader";
import { useManagerActions } from "../hooks/useManagerActions";

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
type TaskStatus = "unassigned" | "assigned" | "in_progress" | "completed";

const STATUS_META: Record<
  TaskStatus,
  { label: string; icon: typeof CheckCircle2; tone: string }
> = {
  unassigned: {
    label: "Unassigned",
    icon: AlertTriangle,
    tone: "bg-burnt-deep/10 text-burnt-deep",
  },
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

type TaskPriority = "low" | "medium" | "high";

const PRIORITY_META: Record<TaskPriority, { label: string; tone: string }> = {
  low: { label: "Low", tone: "bg-ink/5 text-stone" },
  medium: { label: "Medium", tone: "bg-amber/15 text-amber" },
  high: { label: "High", tone: "bg-burnt-deep/10 text-burnt-deep" },
};

// ---------- Types ----------
interface Task {
  id: number;
  title: string;
  location: string;
  petName: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeName: string | null;
  assigneeId: number | null;
  dueLabel: string;
}

interface StaffMember {
  person_id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  npo_spca_id: number;
}

const MOCK_TASKS: Task[] = [
  {
    id: 201,
    title: "Search Beacon Bay area",
    location: "Beacon Bay, East London",
    petName: "Biscuit",
    status: "in_progress",
    priority: "high",
    assigneeName: "Kelly Gerry",
    assigneeId: 9,
    dueLabel: "Due today",
  },
  {
    id: 202,
    title: "Visit reported found dog",
    location: "Gonubie Beach",
    petName: "Unknown",
    status: "unassigned",
    priority: "medium",
    assigneeName: null,
    assigneeId: null,
    dueLabel: "Due tomorrow",
  },
  {
    id: 203,
    title: "Verify microchip at shelter",
    location: "SPCA East London",
    petName: "Mochi",
    status: "assigned",
    priority: "low",
    assigneeName: "Hope Nolo",
    assigneeId: 10,
    dueLabel: "Due in 2 days",
  },
];

type StatusFilter = "all" | TaskStatus;

function initials(first?: string, last?: string) {
  const a = (first ?? "").trim().charAt(0);
  const b = (last ?? "").trim().charAt(0);
  return (a + b).toUpperCase() || "PR";
}

function Manager() {
  const { staffQuery, handoversQuery } = useManagerActions();
  const { data: staff = [], isLoading: isLoadingStaff } = staffQuery;
  const { data: handoversData } = handoversQuery;

  // Calculate pending handovers
  const pendingHandovers = useMemo(() => {
    return (
      handoversData?.handovers.filter((h) => h.status === "pending").length ?? 0
    );
  }, [handoversData]);

  const tasks = MOCK_TASKS;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  // --- task counts ---
  const taskCounts = useMemo(
    () => ({
      all: tasks.length,
      unassigned: tasks.filter((t) => t.status === "unassigned").length,
      assigned: tasks.filter((t) => t.status === "assigned").length,
      in_progress: tasks.filter((t) => t.status === "in_progress").length,
      completed: tasks.filter((t) => t.status === "completed").length,
    }),
    [tasks],
  );

  const operators = useMemo(() => {
    return (staff as StaffMember[]).map((op) => {
      const activeTasks = tasks.filter(
        (t) =>
          t.assigneeId === op.person_id &&
          (t.status === "assigned" || t.status === "in_progress"),
      ).length;
      const completedTasks = tasks.filter(
        (t) => t.assigneeId === op.person_id && t.status === "completed",
      ).length;
      return { ...op, activeTasks, completedTasks };
    });
  }, [staff, tasks]);

  const filteredTasks = useMemo(() => {
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
      label: "Rescue operators",
      value: operators.length,
      delta: "In your organisation",
      icon: Radio,
      tone: "moss" as const,
    },
    {
      label: "Active tasks",
      value: taskCounts.assigned + taskCounts.in_progress,
      delta: "Assigned or in progress",
      icon: ClipboardList,
      tone: "amber" as const,
    },
    {
      label: "Unassigned",
      value: taskCounts.unassigned,
      delta: "Need an operator",
      icon: AlertTriangle,
      tone: "burnt" as const,
    },
    {
      label: "Completed",
      value: taskCounts.completed,
      delta: "This cycle",
      icon: CheckCircle2,
      tone: "stone" as const,
    },
  ];

  if (isLoadingStaff) return <PageLoader />;

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
            className="flex flex-wrap items-start justify-between gap-6"
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber/15 text-amber text-[11px] font-bold uppercase tracking-widest">
                  <Briefcase className="w-3 h-3" />
                  Manager
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest text-stone">
                  <ShieldCheck className="w-3 h-3" />
                  Verified
                </span>
              </div>

              <h1 className="font-display font-black text-3xl sm:text-4xl tracking-[-0.02em]">
                Operations overview
              </h1>
              <p className="mt-2 text-stone max-w-xl">
                Assign tasks, monitor your rescue operators, and manage incoming
                handovers.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/manager/handovers"
                className="inline-flex items-center gap-2 h-11 px-4 rounded-xl border border-ink/15 hover:border-ink/30 hover:bg-ink/5 transition-colors text-sm font-medium"
              >
                <ArrowRightLeft className="w-4 h-4" />
                Handovers
                {pendingHandovers > 0 && (
                  <span className="grid place-items-center min-w-[20px] h-5 px-1 rounded-full bg-burnt text-bone text-[10px] font-bold">
                    {pendingHandovers}
                  </span>
                )}
              </Link>
              <Link
                to="/manager/staff"
                className="inline-flex items-center gap-2 h-11 px-4 rounded-xl border border-ink/15 hover:border-ink/30 hover:bg-ink/5 transition-colors text-sm font-medium"
              >
                <Users className="w-4 h-4" />
                View operators
              </Link>
              <Link
                to="/manager/tasks/new"
                className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-burnt text-bone font-medium hover:bg-burnt-deep transition-colors group"
              >
                <UserPlus className="w-4 h-4" />
                Assign task
                <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="max-w-[1400px] mx-auto px-6 py-10">
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

      {/* ============ MAIN GRID ============ */}
      <section className="max-w-[1400px] mx-auto px-6 pb-20 grid lg:grid-cols-12 gap-6">
        {/* LEFT — task board */}
        <motion.div
          variants={fadeUp}
          custom={5}
          initial="hidden"
          animate="show"
          className="lg:col-span-8 rounded-2xl border border-ink/10 bg-bone overflow-hidden"
        >
          {/* toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-ink/10">
            <div className="flex items-center gap-3">
              <h2 className="font-display font-black text-xl tracking-tight">
                Task board
              </h2>
              <span className="text-xs text-stone px-2 py-0.5 rounded-full bg-ink/5 tabular-nums">
                {filteredTasks.length}
              </span>
            </div>

            <label className="flex items-center gap-2 h-9 px-3 rounded-lg bg-bone border border-ink/10 focus-within:border-burnt focus-within:ring-2 focus-within:ring-burnt/15 transition-all">
              <Search className="w-4 h-4 text-stone shrink-0" />
              <input
                type="text"
                placeholder="Search tasks…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-40 sm:w-52 bg-transparent outline-none text-sm text-ink placeholder:text-stone/60"
              />
            </label>
          </div>

          {/* status chips */}
          <div className="flex flex-wrap items-center gap-2 px-5 py-3 border-b border-ink/10 bg-bone/40">
            <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-widest text-stone">
              <Filter className="w-3 h-3" />
              Status
            </span>
            {(
              [
                ["all", "All", taskCounts.all],
                ["unassigned", "Unassigned", taskCounts.unassigned],
                ["assigned", "Assigned", taskCounts.assigned],
                ["in_progress", "In progress", taskCounts.in_progress],
                ["completed", "Completed", taskCounts.completed],
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

          {/* rows */}
          <div className="divide-y divide-ink/5">
            {filteredTasks.length === 0 && (
              <div className="p-16 text-center">
                <div className="grid place-items-center w-12 h-12 mx-auto rounded-2xl bg-ink/5 text-stone mb-3">
                  <Inbox className="w-5 h-5" />
                </div>
                <div className="font-medium">
                  {search || statusFilter !== "all"
                    ? "No tasks match"
                    : "No tasks yet"}
                </div>
                <div className="text-sm text-stone mt-1 max-w-xs mx-auto">
                  {search || statusFilter !== "all"
                    ? "Try a different search or clear the filters."
                    : "Create your first task to get started."}
                </div>
              </div>
            )}

            <AnimatePresence>
              {filteredTasks.map((t, i) => {
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
                    className="p-5 hover:bg-bone/60 transition-colors group"
                  >
                    <div className="flex flex-wrap items-start gap-4">
                      <span
                        className={`grid place-items-center w-11 h-11 rounded-xl shrink-0 ${statusMeta.tone}`}
                      >
                        <StatusIcon className="w-5 h-5" />
                      </span>

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

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-stone">
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            {t.location}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <ClipboardList className="w-3.5 h-3.5" />
                            {t.petName}
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

                        {/* assignee row */}
                        <div className="mt-3 flex items-center gap-2">
                          {t.assigneeName ? (
                            <>
                              <span className="grid place-items-center w-7 h-7 rounded-full bg-moss/10 text-moss text-[10px] font-bold">
                                {initials(
                                  t.assigneeName.split(" ")[0],
                                  t.assigneeName.split(" ")[1],
                                )}
                              </span>
                              <span className="text-xs text-stone">
                                Assigned to{" "}
                                <span className="text-ink font-medium">
                                  {t.assigneeName}
                                </span>
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="grid place-items-center w-7 h-7 rounded-full bg-burnt-deep/10 text-burnt-deep">
                                <UserIcon className="w-3.5 h-3.5" />
                              </span>
                              <span className="text-xs text-burnt-deep font-medium">
                                Not yet assigned
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        {t.status === "unassigned" && (
                          <Link
                            to={`/manager/tasks/${t.id}/assign`}
                            className="hidden sm:inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium bg-burnt text-bone hover:bg-burnt-deep transition-colors"
                          >
                            <UserPlus className="w-3 h-3" />
                            Assign
                          </Link>
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

          {filteredTasks.length > 0 && (
            <div className="px-5 py-3 border-t border-ink/10 flex items-center justify-between text-xs text-stone">
              <span>
                Showing{" "}
                <span className="text-ink font-medium">
                  {filteredTasks.length}
                </span>{" "}
                of <span className="text-ink font-medium">{tasks.length}</span>{" "}
                {tasks.length === 1 ? "task" : "tasks"}
              </span>
              <Link
                to="/manager/tasks"
                className="inline-flex items-center gap-1 text-burnt font-medium hover:text-burnt-deep"
              >
                View all
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </motion.div>

        {/* RIGHT — operators roster & handovers */}
        <motion.aside
          variants={fadeUp}
          custom={6}
          initial="hidden"
          animate="show"
          className="lg:col-span-4 space-y-6"
        >
          {/* incoming handovers card (NEW) */}
          <div className="rounded-2xl border border-ink/10 bg-ink text-bone overflow-hidden relative">
            <div
              aria-hidden
              className="absolute -bottom-8 -right-8 opacity-[0.05]"
            >
              <ArrowRightLeft className="w-40 h-40" strokeWidth={0.6} />
            </div>

            <div className="relative p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ArrowRightLeft className="w-4 h-4 text-amber" />
                  <h2 className="font-display font-black text-lg tracking-tight">
                    Incoming Handovers
                  </h2>
                </div>
                {pendingHandovers > 0 && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber bg-amber/15 px-2 py-0.5 rounded-full">
                    Action needed
                  </span>
                )}
              </div>

              <div className="flex items-end gap-3 mb-4">
                <div className="font-display font-black text-4xl tabular-nums">
                  {pendingHandovers}
                </div>
                <div className="text-sm text-bone/60 pb-1.5">
                  pending {pendingHandovers === 1 ? "request" : "requests"}
                </div>
              </div>

              <Link
                to="/manager/handovers"
                className="w-full inline-flex items-center justify-center gap-2 h-10 rounded-xl bg-bone text-ink text-sm font-medium hover:bg-bone/90 transition-colors"
              >
                Review handovers
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* operators card */}
          <div className="rounded-2xl border border-ink/10 bg-bone overflow-hidden">
            <div className="p-5 border-b border-ink/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-moss" />
                <h2 className="font-display font-black text-lg tracking-tight">
                  Operators
                </h2>
                <span className="text-xs text-stone px-2 py-0.5 rounded-full bg-ink/5 tabular-nums">
                  {operators.length}
                </span>
              </div>
              <Link
                to="/manager/staff"
                className="text-xs font-medium text-burnt hover:text-burnt-deep"
              >
                View all
              </Link>
            </div>

            <div className="divide-y divide-ink/5 max-h-[300px] overflow-y-auto">
              {operators.length === 0 && (
                <div className="p-8 text-center text-sm text-stone">
                  No operators registered yet.
                </div>
              )}

              {operators.map((op) => (
                <div
                  key={op.person_id}
                  className="p-4 flex items-center gap-3 hover:bg-bone/60 transition-colors"
                >
                  <span className="grid place-items-center w-10 h-10 rounded-full bg-ink text-bone text-xs font-bold shrink-0">
                    {initials(op.firstname, op.lastname)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">
                      {op.firstname} {op.lastname}
                    </div>
                    <div className="text-xs text-stone truncate">
                      {op.email}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-semibold tabular-nums">
                      {op.activeTasks}
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-stone">
                      Active
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* needs attention card */}
          <div className="rounded-2xl border border-burnt-deep/20 bg-burnt-deep/5 p-5">
            <div className="flex items-start gap-3">
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-burnt-deep/15 text-burnt-deep shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </span>
              <div>
                <div className="font-display font-black text-lg tracking-tight text-burnt-deep">
                  Needs attention
                </div>
                <p className="text-sm text-burnt-deep/80 mt-1">
                  {taskCounts.unassigned > 0
                    ? `${taskCounts.unassigned} ${
                        taskCounts.unassigned === 1 ? "task is" : "tasks are"
                      } still unassigned.`
                    : "All tasks are assigned."}
                </p>
                {taskCounts.unassigned > 0 && (
                  <button
                    type="button"
                    onClick={() => setStatusFilter("unassigned")}
                    className="mt-3 inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium bg-burnt-deep text-bone hover:bg-burnt-deep/90 transition-colors"
                  >
                    Review now
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.aside>
      </section>
    </div>
  );
}

export default Manager;
