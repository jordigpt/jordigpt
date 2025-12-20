import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Trash2, ShoppingCart, Loader2, CreditCard } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AuthModal } from "@/components/AuthModal";
// import { PayPalButtons } from "@paypal/react-paypal-js";
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

  /* --- CHECKOUT PAYPAL (DESHABILITADO TEMPORALMENTE) ---
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
    }

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
  */

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="flex flex-col w-full sm:max-w-md bg-background border-l border-border z-[100] p-0">
          <SheetHeader className="p-6 border-b border-border bg-card/50">
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-neon" />
              Tu Arsenal ({items.length})
            </SheetTitle>
            <SheetDescription>
              Revisa tus items y selecciona el método de pago.
            </SheetDescription>
          </SheetHeader>

          {/* Usamos un contenedor flex-1 con overflow-y-auto para que TODO scrollee junto */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {/* 1. LISTA DE ITEMS */}
            <section>
                {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground opacity-60 border-2 border-dashed border-border rounded-lg">
                    <ShoppingCart className="w-10 h-10 mb-2" />
                    <p>Tu carrito está vacío.</p>
                </div>
                ) : (
                <div className="space-y-4">
                    {items.map((item) => (
                    <div key={item.id} className="flex gap-4 items-start bg-card p-3 rounded-lg border border-border shadow-sm">
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
            </section>

            {/* 2. RESUMEN Y PAGOS (Solo visible si hay items) */}
            {items.length > 0 && (
                <section className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
                    {/* Total */}
                    <div className="bg-muted/10 p-4 rounded-lg border border-border">
                        <div className="flex justify-between items-center text-lg font-bold">
                            <span>Total a Pagar:</span>
                            <span className="text-neon font-mono text-2xl">${total.toFixed(2)}</span>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Opciones de Pago</h3>
                        
                        {/* Opción 1: Mercado Pago */}
                        <Button 
                            className="w-full bg-[#009EE3] hover:bg-[#009EE3]/90 text-white font-bold h-12 text-base shadow-sm relative overflow-hidden group"
                            onClick={handleCheckoutMP}
                            disabled={isProcessingMP}
                        >
                            {isProcessingMP ? <Loader2 className="animate-spin mr-2" /> : <CreditCard className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />}
                            Pagar con Tarjeta (Mercado Pago)
                            <span className="absolute right-0 top-0 h-full w-12 bg-white/10 skew-x-12 -translate-x-3"></span>
                        </Button>

                        {/* PAYPAL DESHABILITADO
                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">O Internacional</span>
                            </div>
                        </div>

                        
                        <div className="w-full relative z-0 min-h-[150px] bg-white p-4 rounded-lg shadow-sm">
                            <PayPalButtons 
                                style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
                                createOrder={createPayPalOrder}
                                onApprove={onPayPalApprove}
                                onError={(err) => {
                                    console.error("PayPal Error", err);
                                    toast.error("Hubo un error cargando PayPal.");
                                }}
                            />
                        </div>
                        */}

                        <p className="text-[10px] text-center text-muted-foreground uppercase tracking-wider">
                            Transacciones seguras encriptadas SSL · Acceso Inmediato
                        </p>
                    </div>
                </section>
            )}

            {/* Espacio extra al final para que el scroll no quede pegado */}
            <div className="h-8"></div>
          </div>
        </SheetContent>
      </Sheet>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
}