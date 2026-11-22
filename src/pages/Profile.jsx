import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { Heart, Bell, Settings, LogOut, Home as HomeIcon, Box, HardHat, Package, ChevronRight, Shield, HelpCircle } from "lucide-react";
import { Image } from "@/components/ui/image";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [saved, setSaved] = useState({ properties: 0, designs: 0, workers: 0, materials: 0 });

  useEffect(() => {
    (async () => {
      try {
        const me = await base44.auth.me();
        setUser(me);
      } catch (e) {}
    })();
  }, []);

  const menuGroups = [
    {
      title: "Saved",
      items: [
        { label: "Saved Properties", to: "/search?tab=properties", icon: HomeIcon, count: saved.properties },
        { label: "Saved 3D Designs", to: "/search?tab=designs", icon: Box, count: saved.designs },
        { label: "Worker Contacts", to: "/services", icon: HardHat, count: saved.workers },
        { label: "Saved Materials", to: "/search?tab=materials", icon: Package, count: saved.materials },
      ],
    },
    {
      title: "Account",
      items: [
        { label: "Notifications", to: "#", icon: Bell },
        { label: "Privacy & Security", to: "#", icon: Shield },
        { label: "Settings", to: "#", icon: Settings },
        { label: "Help & Support", to: "#", icon: HelpCircle },
      ],
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-10 py-4 lg:py-8">
      <h1 className="font-heading font-extrabold text-2xl lg:text-4xl mb-6">Profile</h1>

      {/* Profile card */}
      <div className="rounded-2xl border border-border bg-card p-6 mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-clay to-module-materials flex items-center justify-center text-white font-heading font-extrabold text-2xl shrink-0">
          {user?.full_name?.[0]?.toUpperCase() || "G"}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h2 className="font-heading font-extrabold text-xl">{user?.full_name || "Gruham User"}</h2>
          <p className="text-sm text-secondary-foreground">{user?.email || "user@gruham.app"}</p>
          <div className="flex items-center gap-2 mt-3 justify-center sm:justify-start">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-clay/10 text-clay px-3 py-1 text-xs font-semibold">Customer</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-secondary-foreground">Hyderabad</span>
          </div>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted">
          Edit Profile
        </button>
      </div>

      {/* Menu groups */}
      {menuGroups.map((g) => (
        <div key={g.title} className="mb-6">
          <h3 className="text-xs font-semibold text-secondary-foreground uppercase tracking-wider mb-2 px-1">{g.title}</h3>
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            {g.items.map((item, i) => {
              const Icon = item.icon;
              return (
                <Link key={item.label} to={item.to} className={`flex items-center gap-3 px-4 py-3.5 hover:bg-muted ${i > 0 ? "border-t border-border" : ""}`}>
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center"><Icon className="w-4.5 h-4.5 text-secondary-foreground" /></div>
                  <span className="flex-1 text-sm font-medium">{item.label}</span>
                  {item.count !== undefined && <span className="text-xs text-secondary-foreground">{item.count}</span>}
                  <ChevronRight className="w-4 h-4 text-secondary-foreground" />
                </Link>
              );
            })}
          </div>
        </div>
      ))}

      <button onClick={() => base44.auth.logout()} className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-3.5 text-sm font-semibold text-destructive hover:bg-destructive/5">
        <LogOut className="w-4 h-4" /> Log Out
      </button>
    </div>
  );
}