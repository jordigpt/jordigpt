import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Star, Users, Loader2, Download, Ban, ArrowRight, ShoppingCart } from "lucide-react";
import { Product } from "@/types/admin";

interface ProductInfoProps {
  product: Product;
  userHasProduct: boolean;
  isOutOfStock: boolean;
  isProcessing: boolean;
  onAction: () => void;
  isGumroad: boolean;
}

export const ProductInfo = ({
  product,
  userHasProduct,
  isOutOfStock,
  isProcessing,
  onAction,
  isGumroad
}: ProductInfoProps) => {
  return (
    <div className="flex flex-col">
      <div className="mb-8">
         <div className="flex items-center gap-3 mb-4 flex-wrap">
            {product.is_free ? (
              <Badge className="bg-neon text-black hover:bg-neon border-none text-xs px-3 py-1 font-bold">REGALO EXCLUSIVO</Badge>
            ) : (
              <Badge variant="outline" className="text-neon border-neon/50 text-xs px-3 py-1 bg-neon/5 font-bold uppercase tracking-wider">Sistema Premium</Badge>
            )}
            {product.is_featured && <span className="flex items-center text-xs text-amber-400 font-bold"><Star className="w-3 h-3 mr-1 fill-current"/> TOP SELLER</span>}
            
            {product.downloads_count && product.downloads_count > 10 && (
                <span className="flex items-center text-xs text-foreground font-medium bg-muted px-2 py-0.5 rounded-full border border-border">
                    <Users className="w-3 h-3 mr-1.5" /> +{product.downloads_count} estudiantes
                </span>
            )}
            
            {isOutOfStock && <Badge variant="destructive" className="uppercase">Ventas Cerradas</Badge>}
         </div>
         
         <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6 leading-[0.9] tracking-tighter uppercase">
           {product.title}
         </h1>
         
         <div className="prose prose-invert max-w-none mb-8">
           <p className="text-lg text-muted-foreground leading-relaxed border-l-2 border-neon pl-4">
             {product.short_description}
           </p>
         </div>

         <div className="bg-card border border-border rounded-xl p-6 shadow-2xl relative overflow-hidden group" id="hero-action">
             <div className="flex items-baseline gap-2 mb-2">
                 <span className={`text-4xl font-black text-white tracking-tight ${isOutOfStock ? 'opacity-50' : ''}`}>
                     {product.price_display || (product.price === 0 ? "GRATIS" : `$${product.price}`)}
                 </span>
                 {product.original_price_display && !product.is_free && (
                     <span className="text-lg text-muted-foreground line-through decoration-destructive/50">
                         {product.original_price_display}
                     </span>
                 )}
             </div>
             
             <p className="text-xs text-muted-foreground mb-6 uppercase tracking-wider font-medium">
                 {product.price_microcopy || "Pago único · Acceso de por vida"}
             </p>

             <Button 
              onClick={onAction}
              disabled={isProcessing || isOutOfStock}
              className={`w-full font-bold text-lg h-14 rounded-lg transition-all uppercase tracking-wide disabled:opacity-70 ${
                  userHasProduct 
                  ? "bg-secondary text-secondary-foreground hover:bg-secondary/90" 
                  : isOutOfStock
                      ? "bg-muted text-muted-foreground cursor-not-allowed border border-border"
                      : "bg-neon text-black hover:bg-neon/90 hover:scale-[1.01] shadow-[0_0_20px_rgba(212,232,58,0.3)] hover:shadow-[0_0_30px_rgba(212,232,58,0.5)]"
              }`}
            >
              {isProcessing ? <Loader2 className="animate-spin mr-2" /> : null}
              {isProcessing ? "Procesando..." : (
                  userHasProduct 
                      ? <span className="flex items-center"><Download className="mr-2 w-5 h-5"/> ACCEDER AHORA</span> 
                      : isOutOfStock 
                          ? <span className="flex items-center"><Ban className="mr-2 w-5 h-5"/> NO DISPONIBLE</span>
                          : (
                              product.is_free 
                              ? "DESCARGAR GRATIS"
                              : (isGumroad 
                                  ? <span className="flex items-center">IR AL CHECKOUT <ArrowRight className="ml-2 w-5 h-5"/></span>
                                  : <span className="flex items-center"><ShoppingCart className="mr-2 w-5 h-5"/> AGREGAR AL CARRITO</span>
                                )
                          )
              )} 
            </Button>
            {isOutOfStock && <p className="text-xs text-red-400 mt-2 text-center font-bold">Actualmente no aceptamos nuevos miembros para este producto.</p>}
         </div>
      </div>

      <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Lo que incluye:</h3>
          <ul className="space-y-3">
              {product.features?.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="text-neon w-5 h-5 shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-foreground/90">{feature}</span>
              </li>
              ))}
          </ul>
      </div>
    </div>
  );
};