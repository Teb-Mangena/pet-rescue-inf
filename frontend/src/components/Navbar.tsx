import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  ArrowUpRight,
  PawPrint,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  User as UserIcon,
  ChevronDown,
  Users,
  Dog,
  ShieldCheck,
  Briefcase,
  Radio,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import type { userRole } from "../types/users";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeIn: Variants = {
  hidden: { opacity: 0, y: -6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.15, ease } },
};

const PUBLIC_LINKS = [
  { label: "Lost Pets", to: "/#lost" },
  { label: "Found Pets", to: "/#found" },
  { label: "Stories", to: "/#stories" },
  { label: "For Shelters", to: "/#shelters" },
];

// ---------- ROLE-SPECIFIC (logged-in users) ----------
const ROLE_LINKS: Record<userRole, { label: string; to: string }[]> = {
  // ----- Community Member -----
  community_member: [
    { label: "Lost Pets", to: "/lost" },
    { label: "Found Pets", to: "/found" },
    { label: "Stories", to: "/stories" },
  ],

  // ----- Pet Owner -----
  pet_owner: [
    { label: "My Pets", to: "/owner/pets" },
    { label: "Lost Reports", to: "/lost" },
    { label: "Found Pets", to: "/found" },
  ],

  // ----- Rescue Operator -----
  rescue_operator: [
    { label: "Tasks", to: "/operator/tasks" },
    { label: "Reports", to: "/operator/reports" },
  ],

  // ----- IT Admin -----
  it_admin: [
    { label: "Staff", to: "/admin/staff" },
    { label: "Reports", to: "/admin/reports" },
  ],

  // ----- Manager -----
  manager: [
    { label: "Operators", to: "/manager/staff" },
    { label: "Tasks", to: "/manager/tasks" },
    { label: "Reports", to: "/manager/reports" },
  ],
};

// ---------- Role → dashboard path + label + icon ----------
const ROLE_META: Record<
  userRole,
  { path: string; label: string; icon: typeof Users }
> = {
  community_member: {
    path: "/",
    label: "Community Member",
    icon: Users,
  },
  pet_owner: {
    path: "/",
    label: "Pet Owner",
    icon: Dog,
  },
  rescue_operator: {
    path: "/",
    label: "Rescue Operator",
    icon: Radio,
  },
  it_admin: {
    path: "/",
    label: "IT Admin",
    icon: ShieldCheck,
  },
  manager: {
    path: "/",
    label: "Manager",
    icon: Briefcase,
  },
};

function initialsOf(first?: string, last?: string) {
  const a = (first ?? "").trim().charAt(0);
  const b = (last ?? "").trim().charAt(0);
  return (a + b).toUpperCase() || "PR";
}

function Navbar() {
  const { user, logout, isLoggingOut } = useAuthStore();
  const navigate = useNavigate();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu on outside click / Escape
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setUserMenuOpen(false);
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  // Lock body scroll while mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  async function handleLogout() {
    try {
      await logout();
      setUserMenuOpen(false);
      setMobileOpen(false);
      navigate("/");
    } catch {
      // store handles its own error state
    }
  }

  const roleMeta = user ? ROLE_META[user.role] : null;
  const RoleIcon = roleMeta?.icon;

  // Which nav links to show in the center? Public or role-specific
  const navLinks = user ? ROLE_LINKS[user.role] : PUBLIC_LINKS;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-bone/80 border-b border-ink/10">
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <span className="grid place-items-center w-8 h-8 rounded-lg bg-ink text-bone group-hover:bg-burnt transition-colors">
            <PawPrint className="w-4 h-4" />
          </span>
          <span className="font-display font-black text-lg tracking-tight">
            Pet Rescue
          </span>
        </Link>

        {/* center nav — public OR role-specific */}
        <nav className="hidden md:flex items-center gap-1 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="px-3 py-2 rounded-lg hover:bg-ink/5 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* right actions */}
        <div className="flex items-center gap-2">
          {!user ? (
            /* ---------- Logged out ---------- */
            <>
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center h-9 px-3.5 rounded-lg text-sm font-medium text-ink hover:bg-ink/5 transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="hidden sm:inline-flex items-center h-9 px-3.5 rounded-lg text-sm font-medium border border-ink/15 hover:border-ink/30 hover:bg-ink/5 transition-colors"
              >
                Sign up
              </Link>
              <a
                href="#app"
                className="hidden sm:inline-flex h-9 px-3.5 rounded-lg bg-ink text-bone hover:bg-burnt transition-colors text-sm font-medium items-center gap-1.5"
              >
                Get the app
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </>
          ) : (
            /* ---------- Logged in ---------- */
            <div ref={userMenuRef} className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setUserMenuOpen((s) => !s)}
                className="inline-flex items-center gap-2 h-9 pl-1 pr-2.5 rounded-full border border-ink/10 hover:border-ink/25 hover:bg-ink/5 transition-colors"
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
              >
                {/* avatar */}
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt=""
                    className="w-7 h-7 rounded-full object-cover"
                  />
                ) : (
                  <span className="grid place-items-center w-7 h-7 rounded-full bg-ink text-bone text-xs font-bold">
                    {initialsOf(user.firstname, user.lastname)}
                  </span>
                )}
                <span className="text-sm font-medium max-w-[10rem] truncate">
                  {user.firstname}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-stone transition-transform ${
                    userMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    variants={fadeIn}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    role="menu"
                    className="absolute right-0 mt-2 w-72 rounded-2xl bg-bone border border-ink/10 shadow-2xl shadow-ink/10 overflow-hidden"
                  >
                    {/* caret */}
                    <span
                      aria-hidden
                      className="absolute -top-1.5 right-6 w-3 h-3 bg-bone border-l border-t border-ink/10 rotate-45"
                    />

                    {/* header */}
                    <div className="relative p-3 flex items-center gap-3 border-b border-ink/10">
                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="grid place-items-center w-10 h-10 rounded-full bg-ink text-bone text-sm font-bold">
                          {initialsOf(user.firstname, user.lastname)}
                        </span>
                      )}
                      <div className="min-w-0">
                        <div className="text-sm font-semibold truncate">
                          {user.firstname} {user.lastname}
                        </div>
                        <div className="text-xs text-stone truncate">
                          {user.email}
                        </div>
                      </div>
                    </div>

                    {/* role badge */}
                    {roleMeta && RoleIcon && (
                      <div className="relative px-3 pt-3">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-burnt/10 text-burnt text-[11px] font-semibold">
                          <RoleIcon className="w-3 h-3" />
                          {roleMeta.label}
                        </div>
                      </div>
                    )}

                    {/* menu */}
                    <div className="relative p-2">
                      {roleMeta && (
                        <Link
                          to={roleMeta.path}
                          onClick={() => setUserMenuOpen(false)}
                          role="menuitem"
                          className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-ink/5 transition-colors"
                        >
                          <span className="grid place-items-center w-9 h-9 rounded-lg bg-ink/5 text-ink shrink-0 group-hover:bg-ink group-hover:text-bone transition-colors">
                            <LayoutDashboard className="w-4 h-4" />
                          </span>
                          <span className="text-sm font-medium">
                            My dashboard
                          </span>
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        role="menuitem"
                        className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-ink/5 transition-colors"
                      >
                        <span className="grid place-items-center w-9 h-9 rounded-lg bg-ink/5 text-ink shrink-0 group-hover:bg-ink group-hover:text-bone transition-colors">
                          <UserIcon className="w-4 h-4" />
                        </span>
                        <span className="text-sm font-medium">
                          Profile & settings
                        </span>
                      </Link>
                    </div>

                    {/* sign out */}
                    <div className="relative p-2 border-t border-ink/10">
                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        role="menuitem"
                        className="group w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-burnt/10 transition-colors text-left disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <span className="grid place-items-center w-9 h-9 rounded-lg bg-burnt/10 text-burnt shrink-0 group-hover:bg-burnt group-hover:text-bone transition-colors">
                          {isLoggingOut ? (
                            <span className="w-4 h-4 rounded-full border-2 border-burnt/40 border-t-burnt animate-spin" />
                          ) : (
                            <LogOut className="w-4 h-4" />
                          )}
                        </span>
                        <span className="text-sm font-medium text-burnt">
                          {isLoggingOut ? "Signing out…" : "Sign out"}
                        </span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="md:hidden grid place-items-center w-9 h-9 rounded-lg hover:bg-ink/5 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ============ MOBILE MENU ============ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 top-16 bg-ink/30 backdrop-blur-sm md:hidden"
            />

            <motion.div
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.25, ease }}
              className="fixed left-0 right-0 top-16 md:hidden bg-bone border-b border-ink/10 shadow-2xl max-h-[calc(100vh-4rem)] overflow-y-auto"
            >
              <div className="p-4">
                {/* close */}
                <div className="flex justify-end -mt-1 -mr-1 mb-2">
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="grid place-items-center w-8 h-8 rounded-lg hover:bg-ink/5"
                    aria-label="Close menu"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* nav links — public OR role-specific */}
                <nav className="flex flex-col">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className="px-3 py-3 rounded-xl text-base font-medium hover:bg-ink/5 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <div className="my-4 h-px bg-ink/10" />

                {!user ? (
                  /* ---------- Mobile — logged out ---------- */
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center h-11 w-full rounded-xl border border-ink/15 text-sm font-medium hover:bg-ink/5 transition-colors"
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center h-11 w-full rounded-xl bg-ink text-bone text-sm font-medium hover:bg-burnt transition-colors"
                    >
                      Sign up
                    </Link>
                    <a
                      href="#app"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-1.5 h-11 w-full rounded-xl bg-burnt text-bone text-sm font-medium hover:bg-burnt-deep transition-colors"
                    >
                      Get the app
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ) : (
                  /* ---------- Mobile — logged in ---------- */
                  <div>
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-ink/5">
                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="grid place-items-center w-10 h-10 rounded-full bg-ink text-bone text-sm font-bold">
                          {initialsOf(user.firstname, user.lastname)}
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold truncate">
                          {user.firstname} {user.lastname}
                        </div>
                        <div className="text-xs text-stone truncate">
                          {user.email}
                        </div>
                      </div>
                    </div>

                    {roleMeta && RoleIcon && (
                      <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-burnt/10 text-burnt text-[11px] font-semibold">
                        <RoleIcon className="w-3 h-3" />
                        {roleMeta.label}
                      </div>
                    )}

                    <div className="mt-4 space-y-1">
                      {roleMeta && (
                        <Link
                          to={roleMeta.path}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-ink/5 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            My dashboard
                          </span>
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-ink/5 transition-colors"
                      >
                        <UserIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          Profile & settings
                        </span>
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-burnt/10 text-burnt transition-colors text-left disabled:opacity-60"
                      >
                        {isLoggingOut ? (
                          <span className="w-4 h-4 rounded-full border-2 border-burnt/40 border-t-burnt animate-spin" />
                        ) : (
                          <LogOut className="w-4 h-4" />
                        )}
                        <span className="text-sm font-medium">
                          {isLoggingOut ? "Signing out…" : "Sign out"}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
