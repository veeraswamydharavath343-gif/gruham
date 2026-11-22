import { useEffect, useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Search as SearchIcon, MapPin, Star, Phone, Box, Home as HomeIcon, HardHat, Package, SlidersHorizontal, X } from "lucide-react";
import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";

const tabs = [
  { key: "properties", label: "Properties", icon: HomeIcon, color: "module-property" },
  { key: "designs", label: "3D Designs", icon: Box, color: "module-design" },
  { key: "workers", label: "Workers", icon: HardHat, color: "module-workers" },
  { key: "materials", label: "Materials", icon: Package, color: "module-materials" },
];

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const activeTab = params.get("tab") || "properties";
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [listingType, setListingType] = useState("all");
  const [data, setData] = useState({ properties: [], designs: [], workers: [], materials: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [p, d, w, pr] = await Promise.all([
          base44.entities.Property.list("-created_date", 50),
          base44.entities.Design3D.list("-created_date", 50),
          base44.entities.Worker.list("-rating", 50),
          base44.entities.Product.list("-created_date", 50),
        ]);
        setData({ properties: p, designs: d, workers: w, materials: pr });
      } catch (e) {} finally {
        setLoading(false);
      }
    })();
  }, []);

  const setTab = (key) => setParams({ tab: key });

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (activeTab === "properties") {
      return data.properties.filter((p) =>
        (!q || p.title?.toLowerCase().includes(q) || p.location?.toLowerCase().includes(q)) &&
        (listingType === "all" || p.listing_type === listingType)
      );
    }
    if (activeTab === "designs") {
      return data.designs.filter((d) => !q || d.title?.toLowerCase().includes(q) || d.category?.toLowerCase().includes(q));
    }
    if (activeTab === "workers") {
      return data.workers.filter((w) => !q || w.name?.toLowerCase().includes(q) || w.profession?.toLowerCase().includes(q) || w.location?.toLowerCase().includes(q));
    }
    return data.materials.filter((p) => !q || p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q) || p.shop_name?.toLowerCase().includes(q));
  }, [activeTab, query, listingType, data]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-10 py-4 lg:py-8">
      <h1 className="font-heading font-extrabold text-2xl lg:text-4xl mb-4">Search</h1>

      {/* Search bar */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 flex items-center gap-3 rounded-xl bg-card border border-border px-4 py-3">
          <SearchIcon className="w-5 h-5 text-secondary-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across all modules…"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-secondary-foreground"
          />
          {query && <button onClick={() => setQuery("")}><X className="w-4 h-4 text-secondary-foreground" /></button>}
        </div>
        <button onClick={() => setShowFilters((s) => !s)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-foreground text-background px-4 py-3 text-sm font-semibold">
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Tab toggles */}
      <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold whitespace-nowrap border transition-colors",
                active ? "text-white border-transparent" : "bg-card border-border text-secondary-foreground hover:bg-muted"
              )}
              style={active ? { backgroundColor: `hsl(var(--${t.color === "module-property" ? "module-property" : t.color === "module-design" ? "module-design" : t.color === "module-workers" ? "module-workers" : "module-materials"}))` } : {}}
            >
              <Icon className="w-4 h-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Filters */}
      {showFilters && activeTab === "properties" && (
        <div className="flex gap-2 mb-4">
          {["all", "rent", "sale"].map((t) => (
            <button key={t} onClick={() => setListingType(t)} className={cn("rounded-full px-4 py-2 text-xs font-semibold capitalize border", listingType === t ? "bg-clay text-white border-transparent" : "bg-card border-border text-secondary-foreground")}>
              {t === "all" ? "All" : t}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-24"><div className="w-8 h-8 border-4 border-border border-t-clay rounded-full animate-spin" /></div>
      ) : results.length === 0 ? (
        <div className="text-center py-20 text-secondary-foreground">
          <p className="text-sm">No results found. Try a different search.</p>
        </div>
      ) : activeTab === "properties" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((p) => (
            <Link key={p.id} to={`/property/${p.id}`} className="rounded-2xl overflow-hidden border border-border bg-card hover:shadow-md transition-shadow">
              <div className="relative aspect-[4/3] w-full bg-muted">
                {p.image_url && <Image src={p.image_url} fittingType="fill" className="w-full h-full" alt={p.title} />}
                <span className="absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-bold text-white" style={{ backgroundColor: "hsl(var(--module-property))" }}>
                  {p.listing_type === "sale" ? "For Sale" : "For Rent"}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-heading font-bold text-base line-clamp-1">{p.title}</h3>
                <p className="text-xs text-secondary-foreground flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> {p.location}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-heading font-bold text-lg">₹{p.price >= 100000 ? `${(p.price / 100000).toFixed(1)}L` : p.price.toLocaleString()}{p.listing_type === "rent" ? "/mo" : ""}</span>
                  <span className="text-xs text-secondary-foreground">{p.bedrooms} BHK • {p.area} sqft</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : activeTab === "designs" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((d) => (
            <Link key={d.id} to={`/design/${d.id}`} className="rounded-2xl overflow-hidden border border-border bg-card hover:shadow-md transition-shadow">
              <div className="relative aspect-video w-full bg-muted">
                {d.thumbnail_url && <Image src={d.thumbnail_url} fittingType="fill" className="w-full h-full" alt={d.title} />}
                <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-module-design">3D</span>
              </div>
              <div className="p-4">
                <h3 className="font-heading font-bold text-base line-clamp-1">{d.title}</h3>
                <p className="text-xs text-secondary-foreground capitalize mt-1">{d.category?.replace("_", " ")}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-secondary-foreground">
                  <span>{d.bedrooms} Bed</span><span>{d.bathrooms} Bath</span><span>{d.floors} Floors</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : activeTab === "workers" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((w) => (
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
              <div className="flex items-center justify-between mt-3">
                <span className="inline-flex items-center gap-1 text-xs font-semibold"><Star className="w-3.5 h-3.5 fill-clay text-clay" /> {w.rating}</span>
                <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = `tel:${w.phone}`; }} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white" style={{ backgroundColor: "hsl(var(--module-workers))" }}>
                  <Phone className="w-3.5 h-3.5" /> Call
                </button>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map((pr) => (
            <Link key={pr.id} to={`/product/${pr.id}`} className="rounded-2xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative aspect-square w-full bg-muted">
                {pr.image_url && <Image src={pr.image_url} fittingType="fill" className="w-full h-full" alt={pr.name} />}
                {pr.delivery && <span className="absolute top-2 right-2 rounded-full bg-module-materials px-2 py-0.5 text-[9px] font-bold text-white">Delivery</span>}
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm line-clamp-1">{pr.name}</h3>
                <p className="text-[11px] text-secondary-foreground line-clamp-1 mt-0.5">{pr.shop_name}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-heading font-bold text-base">₹{pr.price.toLocaleString()}</span>
                  <span className="text-[10px] text-secondary-foreground">/{pr.unit.replace("per ", "")}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}