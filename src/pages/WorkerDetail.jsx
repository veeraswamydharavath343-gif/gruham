import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, MapPin, Star, Phone, MessageSquare, Shield, Clock } from "lucide-react";
import { Image } from "@/components/ui/image";

export default function WorkerDetail() {
  const { id } = useParams();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setWorker(await base44.entities.Worker.get(id));
      } catch (e) {} finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="flex items-center justify-center py-32"><div className="w-8 h-8 border-4 border-border border-t-clay rounded-full animate-spin" /></div>;
  if (!worker) return <div className="text-center py-32 text-secondary-foreground">Worker not found.</div>;

  const services = worker.services?.split(",").map((s) => s.trim()).filter(Boolean) || [];

  return (
    <div className="max-w-[1100px] mx-auto px-4 lg:px-10 py-4 lg:py-8 pb-28 lg:pb-10">
      <Link to="/services" className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary-foreground mb-4 hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      <div className="rounded-2xl border border-border bg-card p-6 mb-5 flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-muted shrink-0">
          {worker.photo_url && <Image src={worker.photo_url} fittingType="fill" className="w-full h-full" alt={worker.name} />}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <h1 className="font-heading font-extrabold text-2xl">{worker.name}</h1>
            {worker.verified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-module-workers/10 px-2.5 py-0.5 text-xs font-semibold" style={{ color: "hsl(var(--module-workers))" }}>
                <Shield className="w-3 h-3" /> Verified
              </span>
            )}
          </div>
          <p className="text-sm text-secondary-foreground capitalize mt-1">{worker.profession?.replace("_", " ")}</p>
          <div className="flex items-center gap-4 mt-3 justify-center sm:justify-start text-sm">
            <span className="inline-flex items-center gap-1"><Star className="w-4 h-4 fill-clay text-clay" /> {worker.rating}</span>
            <span className="inline-flex items-center gap-1 text-secondary-foreground"><Clock className="w-4 h-4" /> {worker.experience} yrs exp</span>
            <span className="inline-flex items-center gap-1 text-secondary-foreground"><MapPin className="w-4 h-4" /> {worker.location}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h3 className="font-heading font-bold text-lg mb-2">About</h3>
            <p className="text-sm text-secondary-foreground leading-relaxed">{worker.description}</p>
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg mb-2">Services Offered</h3>
            <div className="flex flex-wrap gap-2">
              {services.map((s) => <span key={s} className="rounded-full bg-muted px-3 py-1.5 text-sm font-medium text-foreground">{s}</span>)}
            </div>
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg mb-2">Working Area</h3>
            <p className="text-sm text-secondary-foreground">{worker.working_area}</p>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-border bg-card p-5 sticky top-6">
            <h3 className="font-heading font-bold text-base mb-3">Contact</h3>
            <div className="flex items-center justify-between mb-4 text-sm">
              <span className="text-secondary-foreground">Availability</span>
              <span className={`font-semibold ${worker.availability ? "text-module-workers" : "text-destructive"}`}>{worker.availability ? "Available now" : "Currently busy"}</span>
            </div>
            <a href={`tel:${worker.phone}`} className="w-full inline-flex items-center justify-center gap-2 rounded-xl text-white py-3 text-sm font-semibold mb-2" style={{ backgroundColor: "hsl(var(--module-workers))" }}>
              <Phone className="w-4 h-4" /> Call {worker.phone}
            </a>
            <Link to="/messages" className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-semibold hover:bg-muted">
              <MessageSquare className="w-4 h-4" /> Send Message
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}