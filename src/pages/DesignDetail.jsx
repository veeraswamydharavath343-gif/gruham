import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, RotateCw, Box, Layers, Bed, Bath, Heart, Share } from "lucide-react";
import { Image } from "@/components/ui/image";

export default function DesignDetail() {
  const { id } = useParams();
  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [room, setRoom] = useState("Floor Plan");

  useEffect(() => {
    (async () => {
      try {
        setDesign(await base44.entities.Design3D.get(id));
      } catch (e) {} finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="flex items-center justify-center py-32"><div className="w-8 h-8 border-4 border-border border-t-clay rounded-full animate-spin" /></div>;
  if (!design) return <div className="text-center py-32 text-secondary-foreground">Design not found.</div>;

  const rooms = ["Floor Plan", "Living", "Kitchen", "Bedroom", "Bathroom", "Exterior"];

  return (
    <div className="max-w-[1100px] mx-auto px-4 lg:px-10 py-4 lg:py-8 pb-28 lg:pb-10">
      <Link to="/search?tab=designs" className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary-foreground mb-4 hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      {/* 3D stage */}
      <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-muted mb-4">
        {design.thumbnail_url && <Image src={design.thumbnail_url} fittingType="fill" className="w-full h-full" alt={design.title} />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-foreground">
          <RotateCw className="w-3.5 h-3.5 text-module-design" /> 360° View
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={() => setSaved((s) => !s)} className="w-10 h-10 rounded-full bg-white/95 flex items-center justify-center">
            <Heart className={`w-5 h-5 ${saved ? "fill-clay text-clay" : "text-foreground"}`} />
          </button>
          <button className="w-10 h-10 rounded-full bg-white/95 flex items-center justify-center"><Share className="w-5 h-5 text-foreground" /></button>
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div className="text-white">
            <h1 className="font-heading font-extrabold text-xl lg:text-2xl">{design.title}</h1>
            <p className="text-white/80 text-sm capitalize mt-0.5">{design.category?.replace("_", " ")}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-module-design px-4 py-2 text-xs font-semibold text-white">
            <Box className="w-3.5 h-3.5" /> Walkthrough
          </span>
        </div>
      </div>

      {/* Room / floor selector */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-5">
        {rooms.map((r) => (
          <button key={r} onClick={() => setRoom(r)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold border transition-colors ${room === r ? "bg-module-design text-white border-transparent" : "bg-card border-border text-secondary-foreground hover:bg-muted"}`}>
            {r}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h3 className="font-heading font-bold text-lg mb-2">About this design</h3>
          <p className="text-sm text-secondary-foreground leading-relaxed">{design.description}</p>
        </div>
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-heading font-bold text-base mb-3">Specifications</h3>
            <div className="space-y-3 text-sm">
              <SpecRow icon={Bed} label="Bedrooms" value={design.bedrooms} />
              <SpecRow icon={Bath} label="Bathrooms" value={design.bathrooms} />
              <SpecRow icon={Layers} label="Floors" value={design.floors} />
            </div>
            <button className="w-full mt-4 inline-flex items-center justify-center gap-2 rounded-xl text-white py-3 text-sm font-semibold" style={{ backgroundColor: "hsl(var(--module-design))" }}>
              <Box className="w-4 h-4" /> Request Full Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SpecRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="inline-flex items-center gap-2 text-secondary-foreground"><Icon className="w-4 h-4" /> {label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}