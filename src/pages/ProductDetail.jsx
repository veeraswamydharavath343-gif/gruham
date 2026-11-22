import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, MapPin, Phone, MessageSquare, Truck, Package, Store } from "lucide-react";
import { Image } from "@/components/ui/image";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setProduct(await base44.entities.Product.get(id));
      } catch (e) {} finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="flex items-center justify-center py-32"><div className="w-8 h-8 border-4 border-border border-t-clay rounded-full animate-spin" /></div>;
  if (!product) return <div className="text-center py-32 text-secondary-foreground">Product not found.</div>;

  const total = product.price * qty;

  return (
    <div className="max-w-[1100px] mx-auto px-4 lg:px-10 py-4 lg:py-8 pb-28 lg:pb-10">
      <Link to="/search?tab=materials" className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary-foreground mb-4 hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-muted">
          {product.image_url && <Image src={product.image_url} fittingType="fill" className="w-full h-full" alt={product.name} />}
          {product.delivery && <span className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-module-materials px-3 py-1.5 text-xs font-bold text-white"><Truck className="w-3.5 h-3.5" /> Delivery available</span>}
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-semibold capitalize text-secondary-foreground">{product.category?.replace("_", " ")}</span>
          <h1 className="font-heading font-extrabold text-2xl lg:text-3xl mt-3">{product.name}</h1>
          <p className="text-sm text-secondary-foreground flex items-center gap-1 mt-2"><Store className="w-4 h-4" /> {product.shop_name}</p>
          <p className="font-heading font-extrabold text-3xl text-clay mt-4">₹{product.price.toLocaleString()}<span className="text-base font-medium text-secondary-foreground"> /{product.unit.replace("per ", "")}</span></p>

          <div className="flex items-center gap-4 mt-4 text-sm text-secondary-foreground">
            <span className="inline-flex items-center gap-1.5"><Package className="w-4 h-4" /> {product.stock} in stock</span>
            <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {product.location}</span>
          </div>

          <p className="text-sm text-secondary-foreground leading-relaxed mt-4">{product.description}</p>

          {/* Quantity */}
          <div className="flex items-center gap-3 mt-6">
            <span className="text-sm font-semibold">Quantity</span>
            <div className="flex items-center rounded-xl border border-border overflow-hidden">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-10 text-lg font-semibold hover:bg-muted">−</button>
              <span className="w-12 text-center font-semibold">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="w-10 h-10 text-lg font-semibold hover:bg-muted">+</button>
            </div>
            <span className="text-sm text-secondary-foreground">Total: <span className="font-heading font-bold text-foreground">₹{total.toLocaleString()}</span></span>
          </div>

          <div className="flex gap-2 mt-6">
            <Link to="/messages" className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-clay text-white py-3 text-sm font-semibold">
              <MessageSquare className="w-4 h-4" /> Enquire Now
            </Link>
            <a href="tel:+919876543210" className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-semibold hover:bg-muted">
              <Phone className="w-4 h-4" /> Call Shop
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}