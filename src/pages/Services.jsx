import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Star, Phone, MapPin, MessageSquare } from "lucide-react";
import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";

const professions = [
  { key: "all", label: "All", icon: "🛠️" },
  { key: "plumber", label: "Plumber", icon: "🔧" },
  { key: "painter", label: "Painter", icon: "🎨" },
  { key: "electrician", label: "Electrician", icon: "⚡" },
  { key: "mason", label: "Mason", icon: "🧱" },
  { key: "carpenter", label: "Carpenter", icon: "🪚" },
  { key: "head_carpenter", label: "Head Carpenter", icon: "🪓" },
  { key: "cleaner", label: "Cleaner", icon: "🧹" },
  { key: "tile_worker", label: "Tile Worker", icon: "🧩" },
  { key: "welder", label: "Welder", icon: "🔥" },
  { key: "construction_worker", label: "Construction", icon: "👷" },
  { key: "interior_designer", label: "Designer", icon: "📐" },
  { key: "architect", label: "Architect", icon: "🏛️" },
];

export default function Services() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const active = params.get("profession") || "all";
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const w = await base44.entities.Worker.list("-rating", 50);
        setWorkers(w);
      } catch (e) {} finally {
        setLoading(false);
      }
    })();
  }, []);

  const counts = useMemo(() => {
    const c = { all: workers.length };
    workers.forEach((w) => { c[w.profession] = (c[w.profession] || 0) + 1; });
    return c;
  }, [workers]);

  const filtered = active === "all" ? workers : workers.filter((w) => w.profession === active);

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-10 py-4 lg:py-8">
      <h1 className="font-heading font-extrabold text-2xl lg:text-4xl mb-1">Services</h1>
      <p className="text-sm text-secondary-foreground mb-5">Find verified construction professionals near you</p>

      {/* Profession grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
        {professions.map((p) => {
          const isActive = active === p.key;
          return (
            <button
              key={p.key}
              onClick={() => setParams(p.key === "all" ? {} : { profession: p.key })}
              className={cn(
                "flex flex-col items-center gap-2 rounded-2xl border p-4 transition-colors",
                isActive ? "border-clay bg-clay/10" : "border-border bg-card hover:bg-muted"
              )}
            >
              <span className="text-2xl">{p.icon}</span>
              <span className={cn("text-xs font-semibold", isActive ? "text-clay" : "text-foreground")}>{p.label}</span>
              <span className="text-[10px] text-secondary-foreground">{counts[p.key] || 0} available</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="font-heading font-extrabold text-lg capitalize">{active === "all" ? "All Professionals" : active.replace("_", " ")}</h2>
        <span className="text-xs text-secondary-foreground">{filtered.length} results</span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-border border-t-clay rounded-full animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((w) => (
            <Link key={w.id} to={`/worker/${w.id}`} className="rounded-2xl border border-border bg-card p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-muted shrink-0">
                  {w.photo_url && <Image src={w.photo_url} fittingType="fill" className="w-full h-full" alt={w.name} />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <h3 className="font-semibold text-sm truncate">{w.name}</h3>
                    {w.verified && <Star className="w-3 h-3 fill-module-workers text-module-workers" />}
                  </div>
                  <p className="text-xs text-secondary-foreground capitalize">{w.profession?.replace("_", " ")}</p>
                  <p className="text-[11px] text-secondary-foreground flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> {w.location}</p>
                </div>
              </div>
              <p className="text-xs text-secondary-foreground mt-3 line-clamp-2">{w.description}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="inline-flex items-center gap-1 text-xs font-semibold"><Star className="w-3.5 h-3.5 fill-clay text-clay" /> {w.rating} • {w.experience} yrs</span>
                <div className="flex gap-2">
                  <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate("/messages"); }} className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-muted"><MessageSquare className="w-4 h-4 text-secondary-foreground" /></button>
                  <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = `tel:${w.phone}`; }} className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-white" style={{ backgroundColor: "hsl(var(--module-workers))" }}>
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}