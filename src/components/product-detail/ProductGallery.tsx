import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Zap, Gift, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  title: string;
  isOutOfStock: boolean;
  isFree: boolean;
  isGumroad: boolean;
}

export const ProductGallery = ({ 
  images, 
  title, 
  isOutOfStock, 
  isFree, 
  isGumroad 
}: ProductGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div className="space-y-4">
      <div className="w-full aspect-video md:aspect-[16/10] rounded-xl overflow-hidden border border-border bg-black/40 relative group">
          {images.length > 0 ? (
              <img 
                  src={images[currentImageIndex]} 
                  alt={title} 
                  className={`w-full h-full object-contain transition-all duration-300 ${isOutOfStock ? 'opacity-70' : ''}`}
              />
          ) : (
              <div className="w-full h-full flex items-center justify-center text-neon/20">
                  <Zap className="w-20 h-20" />
              </div>
          )}
          
          {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
                  <Badge variant="destructive" className="text-xl px-6 py-2 uppercase tracking-widest">
                      AGOTADO / CERRADO
                  </Badge>
              </div>
          )}
          
          {images.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">Sin imagen</span>
              </div>
          )}
      </div>

      {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((img, idx) => (
                  <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={cn(
                          "relative w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-lg overflow-hidden border transition-all",
                          currentImageIndex === idx 
                              ? "border-neon ring-2 ring-neon/20 opacity-100" 
                              : "border-border opacity-60 hover:opacity-100 hover:border-neon/50"
                      )}
                  >
                      <img src={img} className="w-full h-full object-cover" alt={`Thumbnail ${idx + 1}`} />
                  </button>
              ))}
          </div>
      )}
      
      <div className="hidden md:flex justify-between items-center py-6 border-t border-border mt-8">
          <div className="flex items-center gap-3">
              <div className="bg-neon/10 p-2 rounded-full"><ShieldCheck className="w-5 h-5 text-neon" /></div>
              <div className="flex flex-col">
                  <span className="font-bold text-sm">Garantía de Calidad</span>
                  <span className="text-xs text-muted-foreground">Probado en campo</span>
              </div>
          </div>
          <div className="flex items-center gap-3">
              <div className="bg-neon/10 p-2 rounded-full"><Zap className="w-5 h-5 text-neon" /></div>
              <div className="flex flex-col">
                  <span className="font-bold text-sm">Entrega Inmediata</span>
                  <span className="text-xs text-muted-foreground">Todo digital</span>
              </div>
          </div>
          <div className="flex items-center gap-3">
              <div className="bg-neon/10 p-2 rounded-full">
                  {isFree ? <Gift className="w-5 h-5 text-neon" /> : <Lock className="w-5 h-5 text-neon" />}
              </div>
              <div className="flex flex-col">
                  <span className="font-bold text-sm">{isFree ? "Acceso Gratuito" : "Pago Seguro"}</span>
                  <span className="text-xs text-muted-foreground">{isFree ? "Sin tarjeta requerida" : (isGumroad ? "Vía Gumroad" : "Encriptado SSL")}</span>
              </div>
          </div>
      </div>
    </div>
  );
};