import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal, MapPin, RotateCw, Heart, Phone, Star, Box, Home as HomeIcon, HardHat, Package, ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";

const categoryPills = [
  { label: "Properties", to: "/search?tab=properties", icon: HomeIcon, color: "module-property" },
  { label: "3D", to: "/search?tab=designs", icon: Box, color: "module-design" },
  { label: "Workers", to: "/search?tab=workers", icon: HardHat, color: "module-workers" },
  { label: "Supplies", to: "/search?tab=materials", icon: Package, color: "module-materials" },
];

const professionShortcuts = [
  { label: "Plumber", profession: "plumber", icon: "🔧" },
  { label: "Painter", profession: "painter", icon: "🎨" },
  { label: "Electrician", profession: "electrician", icon: "⚡" },
  { label: "Mason", profession: "mason", icon: "🧱" },
];

const moduleColor = (key) => `hsl(var(--module-${key === "module-property" ? "property" : key === "module-design" ? "design" : key === "module-workers" ? "workers" : "materials"}))`;

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [p, d, w, pr] = await Promise.all([
          base44.entities.Property.list("-created_date", 20),
          base44.entities.Design3D.list("-created_date", 20),
          base44.entities.Worker.list("-rating", 20),
          base44.entities.Product.list("-created_date", 12),
        ]);
        setProperties(p);
        setDesigns(d);
        setWorkers(w);
        setProducts(pr);
      } catch (e) {
        // bubble
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const dedupeById = (items) => {
    const seen = new Set();
    return items.filter((item) => (seen.has(item.id) ? false : seen.add(item.id)));
  };
  const featuredProps = dedupeById(properties.filter((p) => p.featured).concat(properties)).slice(0, 4);
  const featuredDesigns = dedupeById(designs.filter((d) => d.featured).concat(designs));
  const heroDesign = featuredDesigns[0] || designs[0];

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-10 py-4 lg:py-8">
      {/* Desktop top header strip */}
      <div className="hidden lg:flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2 text-sm font-medium">
            <MapPin className="w-4 h-4 text-clay" /> Hyderabad, Telangana
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-clay/10 px-4 py-2 text-sm font-semibold text-clay">
            Customer
          </span>
        </div>
        <Link to="/profile" className="flex items-center gap-3 rounded-full bg-card border border-border pl-2 pr-4 py-1.5 hover:shadow-sm transition-shadow">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-clay to-module-materials" />
          <span className="text-sm font-semibold">My Account</span>
        </Link>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FAF8F2] to-[#F0EBE0] border border-border px-6 py-10 lg:px-14 lg:py-16 mb-6 lg:mb-10">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-clay/10 text-clay px-3 py-1 text-xs font-semibold mb-4">
            <Box className="w-3.5 h-3.5" /> All-in-one construction platform
          </span>
          <h1 className="font-heading font-extrabold tracking-tight text-foreground leading-[1.02]" style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}>
            Construct,<br />Design, Live.
          </h1>
          <p className="mt-4 text-secondary-foreground text-sm lg:text-base max-w-md">
            Discover properties, explore 3D home designs, hire verified construction pros, and source building materials — all in one place.
          </p>
        </div>
        <div className="relative z-10 mt-6 lg:mt-8 flex flex-col sm:flex-row gap-2 max-w-xl">
          <Link to="/search" className="flex-1 flex items-center gap-3 rounded-xl bg-card border border-border px-4 py-3.5 shadow-sm">
            <Search className="w-5 h-5 text-clay" />
            <span className="text-secondary-foreground text-sm">Search properties, designs, workers, materials…</span>
          </Link>
          <Link to="/search" className="inline-flex items-center justify-center gap-2 rounded-xl bg-foreground text-background px-5 py-3.5 text-sm font-semibold">
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </Link>
        </div>
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-clay/10 blur-3xl" />
        <div className="hidden lg:block absolute right-10 top-10 w-40 h-40 rounded-full bg-module-design/10 blur-2xl" />
      </section>

      {/* Mobile category pills */}
      <div className="lg:hidden grid grid-cols-4 gap-2 mb-6">
        {categoryPills.map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.label} to={c.to} className="flex flex-col items-center gap-2">
              <div className="w-full aspect-square rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: moduleColor(c.color) }}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-semibold text-foreground">{c.label}</span>
            </Link>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-4 border-border border-t-clay rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          {/* Region 1: 3D Design Stage */}
          <section className="col-span-12 lg:col-span-7">
            <SectionHeader title="3D House Design" subtitle="Explore interactive home models" to="/search?tab=designs" color="module-design" />
            <Link to={heroDesign ? `/design/${heroDesign.id}` : "/search?tab=designs"} className="block relative rounded-2xl overflow-hidden border border-border bg-card group">
              <div className="relative aspect-[16/9] w-full bg-muted">
                {heroDesign?.thumbnail_url && (
                  <Image src={heroDesign.thumbnail_url} fittingType="fill" className="w-full h-full" alt={heroDesign.title} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-foreground">
                  <RotateCw className="w-3.5 h-3.5 text-module-design" /> 360° Interactive
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div className="text-white">
                    <h3 className="font-heading font-extrabold text-xl lg:text-2xl">{heroDesign?.title || "3D Design"}</h3>
                    <p className="text-white/80 text-sm mt-0.5">{heroDesign?.category?.replace("_", " ")} • {heroDesign?.floors} floors</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-clay px-4 py-2 text-xs font-semibold text-white">
                    Explore Floors <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 p-4 overflow-x-auto no-scrollbar">
                {["Floor Plan", "Living", "Kitchen", "Bedroom", "Bathroom", "Exterior"].map((t) => (
                  <span key={t} className="shrink-0 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-secondary-foreground">{t}</span>
                ))}
              </div>
            </Link>
          </section>

          {/* Region 2: Featured Properties */}
          <section className="col-span-12 lg:col-span-5">
            <SectionHeader title="Featured Properties" subtitle="Curated homes for you" to="/search?tab=properties" color="module-property" />
            <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible no-scrollbar snap-x-mandatory lg:snap-none">
              {featuredProps.map((p) => (
                <Link key={p.id} to={`/property/${p.id}`} className="snap-start shrink-0 w-[280px] lg:w-full rounded-2xl overflow-hidden border border-border bg-card hover:shadow-md transition-shadow">
                  <div className="relative aspect-[4/3] w-full bg-muted">
                    {p.image_url && <Image src={p.image_url} fittingType="fill" className="w-full h-full" alt={p.title} />}
                    <span className="absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-bold text-white" style={{ backgroundColor: "hsl(var(--module-property))" }}>
                      {p.listing_type === "sale" ? "For Sale" : "For Rent"}
                    </span>
                    <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-foreground">
                      ₹{p.price >= 100000 ? `${(p.price / 100000).toFixed(1)}L` : p.price.toLocaleString()}{p.listing_type === "rent" ? "/mo" : ""}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading font-bold text-base line-clamp-1">{p.title}</h3>
                    <p className="text-xs text-secondary-foreground flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> {p.location}</p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-secondary-foreground">
                      <span>{p.bedrooms} BHK</span><span>•</span><span>{p.area} sqft</span><span>•</span><span>{p.floors} fl</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Region 3: Nearby Construction Pros */}
          <section className="col-span-12 lg:col-span-6">
            <SectionHeader title="Nearby Construction Pros" subtitle="Verified workers near you" to="/services" color="module-workers" />
            <div className="grid grid-cols-2 gap-3">
              {workers.slice(0, 4).map((w) => (
                <Link key={w.id} to={`/worker/${w.id}`} className="rounded-2xl border border-border bg-card p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-muted shrink-0">
                      {w.photo_url && <Image src={w.photo_url} fittingType="fill" className="w-full h-full" alt={w.name} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <h3 className="font-semibold text-sm truncate">{w.name}</h3>
                        {w.verified && <Star className="w-3 h-3 fill-module-workers text-module-workers" />}
                      </div>
                      <p className="text-xs text-secondary-foreground capitalize">{w.profession?.replace("_", " ")}</p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-secondary-foreground">
                        <span className="inline-flex items-center gap-0.5"><Star className="w-3 h-3 fill-clay text-clay" /> {w.rating}</span>
                        <span>•</span><span>{w.experience} yrs</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = `tel:${w.phone}`; }} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold" style={{ backgroundColor: "hsl(var(--module-workers) / 0.1)", color: "hsl(var(--module-workers))" }}>
                      <Phone className="w-3.5 h-3.5" /> Call
                    </button>
                    <span className="text-[11px] text-secondary-foreground">{w.availability ? "Available" : "Busy"}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Region 4: Materials & Furniture Marketplace */}
          <section className="col-span-12 lg:col-span-6">
            <SectionHeader title="Materials & Furniture" subtitle="Shop building supplies" to="/search?tab=materials" color="module-materials" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {products.slice(0, 8).map((pr) => (
                <Link key={pr.id} to={`/product/${pr.id}`} className="rounded-2xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative aspect-square w-full bg-muted">
                    {pr.image_url && <Image src={pr.image_url} fittingType="fill" className="w-full h-full" alt={pr.name} />}
                    {pr.delivery && <span className="absolute top-2 right-2 rounded-full bg-module-materials px-2 py-0.5 text-[9px] font-bold text-white">Delivery</span>}
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-xs line-clamp-1">{pr.name}</h3>
                    <p className="text-[10px] text-secondary-foreground line-clamp-1 mt-0.5">{pr.shop_name}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-heading font-bold text-sm">₹{pr.price.toLocaleString()}</span>
                      <span className="text-[10px] text-secondary-foreground">/{pr.unit.replace("per ", "")}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-secondary-foreground"><MapPin className="w-2.5 h-2.5" /> {pr.location}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Mobile on-demand services rail */}
      <section className="lg:hidden mt-8">
        <h2 className="font-heading font-extrabold text-lg mb-3">On-Demand Services</h2>
        <div className="grid grid-cols-4 gap-3">
          {professionShortcuts.map((s) => (
            <Link key={s.profession} to={`/services?profession=${s.profession}`} className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center text-2xl">{s.icon}</div>
              <span className="text-[11px] font-semibold text-center">{s.label}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ title, subtitle, to, color }) {
  return (
    <div className="flex items-end justify-between mb-3 lg:mb-4">
      <div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-5 rounded-full" style={{ backgroundColor: `hsl(var(--module-${color === "module-design" ? "design" : color === "module-property" ? "property" : color === "module-workers" ? "workers" : "materials"}))` }} />
          <h2 className="font-heading font-extrabold text-lg lg:text-2xl">{title}</h2>
        </div>
        <p className="text-xs text-secondary-foreground mt-0.5 ml-3.5">{subtitle}</p>
      </div>
      <Link to={to} className="inline-flex items-center gap-1 text-xs font-semibold text-clay">
        See all <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}