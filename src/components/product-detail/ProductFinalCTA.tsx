import { Button } from "@/components/ui/button";
import { Product } from "@/types/admin";

interface ProductFinalCTAProps {
  product: Product;
  userHasProduct: boolean;
  isOutOfStock: boolean;
  isGumroad: boolean;
  onAction: () => void;
}

export const ProductFinalCTA = ({
  product,
  userHasProduct,
  isOutOfStock,
  isGumroad,
  onAction
}: ProductFinalCTAProps) => {
  return (
    <section className="py-24 container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto bg-card border border-border rounded-2xl p-12 shadow-2xl relative overflow-hidden">
               <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
               <div className="relative z-10">
                   <h2 className="text-3xl font-black mb-4 uppercase">¿Listo para empezar?</h2>
                   <p className="text-muted-foreground mb-8">
                       El acceso es inmediato. No dejes que la competencia te gane de mano.
                   </p>
                   <Button 
                    onClick={onAction}
                    disabled={isOutOfStock}
                    className={`font-bold text-lg px-8 py-6 rounded-lg transition-all ${
                        isOutOfStock 
                            ? "bg-muted text-muted-foreground cursor-not-allowed" 
                            : "bg-neon text-black hover:bg-neon/90 shadow-[0_0_20px_rgba(212,232,58,0.4)] hover:shadow-[0_0_40px_rgba(212,232,58,0.6)]"
                    }`}
                   >
                       {userHasProduct ? "ACCEDER AHORA" : isOutOfStock ? "NO DISPONIBLE" : (product.is_free ? "DESCARGAR GRATIS" : (isGumroad ? "IR AL CHECKOUT" : "COMPRAR AHORA"))}
                   </Button>
               </div>
          </div>
      </section>
  );
};