import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Home, Search, LayoutGrid, MessageSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/search", label: "Search", icon: Search },
  { to: "/services", label: "Services", icon: LayoutGrid },
  { to: "/messages", label: "Messages", icon: MessageSquare },
  { to: "/profile", label: "Profile", icon: User },
];

export default function AppLayout() {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar rail */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-20 flex-col items-center justify-between border-r border-border bg-card py-6 z-40">
        <div className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 rounded-xl bg-clay flex items-center justify-center text-white font-heading font-extrabold text-lg">G</div>
          <span className="font-heading font-extrabold text-[11px] tracking-tight">Gruham</span>
        </div>
        <nav className="flex flex-col items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "relative flex flex-col items-center justify-center w-14 h-14 rounded-xl gap-1 transition-colors",
                    isActive ? "text-clay bg-clay/10" : "text-secondary-foreground hover:bg-muted"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && <span className="absolute left-0 top-3 bottom-3 w-1 rounded-full bg-clay" />}
                    <Icon className="w-5 h-5" />
                    <span className="text-[9px] font-medium">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-clay to-module-materials" />
      </aside>

      {/* Mobile top header */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-clay flex items-center justify-center text-white font-heading font-extrabold text-sm">G</div>
          <span className="font-heading font-extrabold text-lg tracking-tight">Gruham</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium text-secondary-foreground">
            Hyderabad
          </span>
        </div>
      </header>

      {/* Page content */}
      <main className="lg:pl-20 pb-20 lg:pb-0">
        <Outlet />
      </main>

      {/* Mobile bottom navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/90 backdrop-blur-md border-t border-border">
        <div className="flex items-stretch justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.end ? location.pathname === item.to : location.pathname.startsWith(item.to);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className="relative flex flex-1 flex-col items-center justify-center gap-1"
              >
                <span className={cn("flex flex-col items-center justify-center gap-0.5", isActive ? "text-clay" : "text-secondary-foreground")}>
                  {isActive && <span className="absolute top-0 h-1 w-8 rounded-b-full bg-clay" />}
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}