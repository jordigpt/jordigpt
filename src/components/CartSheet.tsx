import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Trash2, ShoppingCart, Loader2, ArrowRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function CartSheet() {
  const { items, removeItem, isOpen, setIsOpen, total } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) return;

    try {
      setIsProcessing(true);
      toast.info("Preparando checkout...");

      // IDs de productos a comprar
      const cartItems = items.map(i => i.id);

      const { data, error } = await supabase.functions.invoke('create-checkout', {
          body: { cartItems }
      });

      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);

      if (data?.url) {
          window.location.href = data.url;
      } else {
          throw new Error("No se recibió URL de pago");
      }

    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error("Error al iniciar pago: " + (error.message || "Intente nuevamente"));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-md bg-background border-l border-border">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-neon" />
            Tu Arsenal ({items.length})
          </SheetTitle>
          <SheetDescription>
            Revisa tus herramientas antes de confirmar el acceso.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground opacity-60">
              <ShoppingCart className="w-10 h-10 mb-2" />
              <p>Tu carrito está vacío.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-start bg-card/50 p-3 rounded-lg border border-border">
                  <div className="w-16 h-16 bg-muted rounded overflow-hidden shrink-0">
                    {item.image_url && <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm truncate pr-2">{item.title}</h4>
                    <p className="text-neon font-mono text-sm">{item.price === 0 ? "GRATIS" : `$${item.price}`}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <SheetFooter className="border-t border-border pt-4 flex-col gap-4 sm:flex-col sm:space-x-0">
            <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span className="text-neon font-mono">${total.toFixed(2)}</span>
            </div>
            <Button 
                className="w-full bg-neon text-black hover:bg-neon/90 font-bold h-12 text-base"
                onClick={handleCheckout}
                disabled={items.length === 0 || isProcessing}
            >
                {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <ShoppingCart className="mr-2 w-5 h-5" />}
                {isProcessing ? "PROCESANDO..." : "COMPRAR AHORA"}
            </Button>
            <p className="text-[10px] text-center text-muted-foreground uppercase tracking-wider">
                Pago Único · Acceso Inmediato
            </p>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}