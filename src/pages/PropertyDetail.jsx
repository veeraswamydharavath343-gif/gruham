import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, MapPin, Bed, Bath, Building, Maximize, Phone, MessageSquare, Heart, Share } from "lucide-react";
import { Image } from "@/components/ui/image";

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const p = await base44.entities.Property.get(id);
        setProperty(p);
      } catch (e) {} finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="flex items-center justify-center py-32"><div className="w-8 h-8 border-4 border-border border-t-clay rounded-full animate-spin" /></div>;
  if (!property) return <div className="text-center py-32 text-secondary-foreground">Property not found.</div>;

  return (
    <div className="max-w-[1100px] mx-auto px-4 lg:px-10 py-4 lg:py-8 pb-28 lg:pb-10">
      <Link to="/search?tab=properties" className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary-foreground mb-4 hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-muted mb-5">
        {property.image_url && <Image src={property.image_url} fittingType="fill" className="w-full h-full" alt={property.title} />}
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={() => setSaved((s) => !s)} className="w-10 h-10 rounded-full bg-white/95 flex items-center justify-center">
            <Heart className={`w-5 h-5 ${saved ? "fill-clay text-clay" : "text-foreground"}`} />
          </button>
          <button className="w-10 h-10 rounded-full bg-white/95 flex items-center justify-center"><Share className="w-5 h-5 text-foreground" /></button>
        </div>
        <span className="absolute top-4 left-4 rounded-full px-3 py-1.5 text-xs font-bold text-white" style={{ backgroundColor: "hsl(var(--module-property))" }}>
          {property.listing_type === "sale" ? "For Sale" : "For Rent"}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h1 className="font-heading font-extrabold text-2xl lg:text-3xl">{property.title}</h1>
          <p className="text-sm text-secondary-foreground flex items-center gap-1 mt-2"><MapPin className="w-4 h-4" /> {property.address || property.location}</p>
          <p className="font-heading font-extrabold text-2xl text-clay mt-4">
            ₹{property.price >= 100000 ? `${(property.price / 100000).toFixed(1)}L` : property.price.toLocaleString()}{property.listing_type === "rent" ? "/month" : ""}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <Spec icon={Bed} label="Bedrooms" value={property.bedrooms} />
            <Spec icon={Bath} label="Bathrooms" value={property.bathrooms} />
            <Spec icon={Building} label="Floors" value={property.floors} />
            <Spec icon={Maximize} label="Area" value={`${property.area} sqft`} />
          </div>

          <div className="mt-6">
            <h3 className="font-heading font-bold text-lg mb-2">Description</h3>
            <p className="text-sm text-secondary-foreground leading-relaxed">{property.description}</p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-border bg-card p-5 sticky top-6">
            <h3 className="font-heading font-bold text-base mb-3">Owner Information</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-clay to-module-materials flex items-center justify-center text-white font-heading font-bold">
                {property.owner_name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-sm">{property.owner_name}</p>
                <p className="text-xs text-secondary-foreground">Property Owner</p>
              </div>
            </div>
            <a href={`tel:${property.owner_phone}`} className="w-full inline-flex items-center justify-center gap-2 rounded-xl text-white py-3 text-sm font-semibold mb-2" style={{ backgroundColor: "hsl(var(--module-property))" }}>
              <Phone className="w-4 h-4" /> Call Owner
            </a>
            <Link to="/messages" className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-semibold hover:bg-muted">
              <MessageSquare className="w-4 h-4" /> Message
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Spec({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <Icon className="w-5 h-5 text-clay mb-2" />
      <p className="font-heading font-bold text-lg">{value}</p>
      <p className="text-xs text-secondary-foreground">{label}</p>
    </div>
  );
}