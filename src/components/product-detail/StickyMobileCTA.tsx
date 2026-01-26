import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, ShoppingCart } from "lucide-react";
import { Product } from "@/types/admin";

interface StickyMobileCTAProps {
  product: Product;
  isVisible: boolean;
  userHasProduct: boolean;
  isProcessing: boolean;
  isOutOfStock: boolean;
  isGumroad: boolean;
  onAction: () => void;
}

export const StickyMobileCTA = ({
  product,
  isVisible,
  userHasProduct,
  isProcessing,
  isOutOfStock,
  isGumroad,
  onAction
}: StickyMobileCTAProps) => {
  return (
    <div 
        className={`fixed bottom-0 left-0 w-full bg-background/80 backdrop-blur-xl border-t border-neon/20 p-4 md:hidden z-50 transition-transform duration-300 ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
      >
          <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase truncate max-w-[120px]">{product.title}</span>
                  <span className="text-xl font-mono text-neon font-black">{product.price === 0 ? "GRATIS" : `$${product.price}`}</span>
              </div>
              <Button 
                onClick={onAction} 
                disabled={isProcessing || isOutOfStock}
                size="sm" 
                className={`font-bold rounded-md px-6 shadow-[0_0_15px_rgba(212,232,58,0.4)] disabled:opacity-70 ${userHasProduct ? "bg-secondary text-secondary-foreground" : isOutOfStock ? "bg-muted text-muted-foreground" : "bg-neon text-black hover:bg-neon/90"}`}
              >
                 {isProcessing ? <Loader2 className="animate-spin" /> : (userHasProduct ? "ACCEDER" : isOutOfStock ? "AGOTADO" : (product.is_free ? "GRATIS" : (isGumroad ? <ArrowRight className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />)))}
              </Button>
          </div>
      </div>
  );
};