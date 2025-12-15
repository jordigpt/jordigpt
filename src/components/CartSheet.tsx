import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Trash2, ShoppingCart, Loader2, CreditCard } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AuthModal } from "@/components/AuthModal";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { Separator } from "@/components/ui/separator";

export function CartSheet() {
  const { items, removeItem, isOpen, setIsOpen, total, clearCart } = useCart();
  const [isProcessingMP, setIsProcessingMP] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // --- CHECKOUT MERCADO PAGO ---
  const handleCheckoutMP = async () => {
    if (items.length === 0) return;

    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
        toast.info("Inicia sesión para guardar tus productos");
        setAuthModalOpen(true);
        return;
    }

    try {
      setIsProcessingMP(true);
      toast.info("Conectando con Mercado Pago...");

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
      console.error("Checkout MP error:", error);
      toast.error("Error: " + (error.message || "Intente nuevamente"));
    } finally {
      setIsProcessingMP(false);
    }
  };

  // --- CHECKOUT PAYPAL ---
  const createPayPalOrder = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
          setAuthModalOpen(true);
          throw new Error("Auth required");
      }

      const cartItems = items.map(i => i.id);
      
      const { data, error } = await supabase.functions.invoke('paypal-transaction', {
          body: { action: 'create', cartItems }
      });

      if (error || data.error) {
          toast.error("Error iniciando PayPal");
          throw new Error(error?.message || data.error);
      }
      return data.id;
  };

  const onPayPalApprove = async (data: any) => {
      toast.info("Verificando pago...");
      const cartItems = items.map(i => i.id);

      const { data: result, error } = await supabase.functions.invoke('paypal-transaction', {
          body: { action: 'capture', orderID: data.orderID, cartItems }
      });

      if (error || result.error) {
          toast.error("Error capturando el pago. Contáctanos.");
          console.error(error || result.error);
      } else {
          toast.success("¡Pago exitoso! Bienvenido al arsenal.");
          clearCart();
          setIsOpen(false);
          // Redirigir al éxito
          window.location.href = "/payment/success";
      }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="flex flex-col w-full sm:max-w-md bg-background border-l border-border z-[100]">
          <SheetHeader className="border-b border-border pb-4">
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-neon" />
              Tu Arsenal ({items.length})
            </SheetTitle>
            <SheetDescription>
              Selecciona tu método de pago preferido.
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

          <SheetFooter className="border-t border-border pt-4 flex-col gap-3 sm:flex-col sm:space-x-0">
              <div className="flex justify-between items-center text-lg font-bold mb-2">
                  <span>Total:</span>
                  <span className="text-neon font-mono">${total.toFixed(2)}</span>
              </div>
              
              {/* Opción 1: Mercado Pago */}
              <Button 
                  className="w-full bg-[#009EE3] hover:bg-[#009EE3]/90 text-white font-bold h-12 text-base shadow-sm relative overflow-hidden"
                  onClick={handleCheckoutMP}
                  disabled={items.length === 0 || isProcessingMP}
              >
                   {isProcessingMP ? <Loader2 className="animate-spin mr-2" /> : <CreditCard className="mr-2 w-5 h-5" />}
                   Pagar con Tarjeta / Mercado Pago
                   <span className="absolute right-0 top-0 h-full w-12 bg-white/10 skew-x-12 -translate-x-3"></span>
              </Button>

              <div className="flex items-center gap-2 text-xs text-muted-foreground my-1">
                  <Separator className="flex-1" />
                  <span>O PAGO INTERNACIONAL</span>
                  <Separator className="flex-1" />
              </div>

              {/* Opción 2: PayPal */}
              <div className="w-full relative z-0">
                  {items.length > 0 && (
                    <PayPalButtons 
                        style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
                        disabled={items.length === 0}
                        createOrder={createPayPalOrder}
                        onApprove={onPayPalApprove}
                        onError={(err) => {
                            console.error("PayPal Error", err);
                            toast.error("Hubo un error cargando PayPal.");
                        }}
                    />
                  )}
              </div>
              
              <p className="text-[10px] text-center text-muted-foreground uppercase tracking-wider mt-2">
                  Acceso Inmediato · SSL Seguro
              </p>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
}