import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product } from "@/data/products";
import { Check, Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export function CheckoutModal({ isOpen, onClose, product }: CheckoutModalProps) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "success">("form");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulating API processing time
    setTimeout(() => {
      setLoading(false);
      
      if (product.price > 0) {
        // If paid, we would redirect to payment gateway here
        toast.success("Redirigiendo a MercadoPago seguro...");
        // For demo purposes, we show success immediately, but in real life redirect happens
        setStep("success");
      } else {
        // If free, we just collected the lead
        setStep("success");
        toast.success("¡Acceso enviado a tu correo!");
      }
    }, 1500);
  };

  const handleClose = () => {
    onClose();
    // Reset state after transition finishes
    setTimeout(() => {
      setStep("form");
      setEmail("");
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        {step === "form" ? (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {product.price === 0 ? "Desbloquear Acceso" : "Checkout Seguro"}
                {product.price > 0 && <Lock className="w-4 h-4 text-neon" />}
              </DialogTitle>
              <DialogDescription>
                {product.price === 0 
                  ? "Ingresa tu email para recibir los accesos inmediatamente." 
                  : "Estás a un paso. Completa tus datos para proceder al pago."}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-6 py-6">
              <div className="flex items-center gap-4 bg-muted/50 p-3 rounded-lg border border-border">
                <div className="h-12 w-12 bg-background border border-border rounded flex items-center justify-center font-bold text-neon">
                    {product.title.substring(0, 2)}
                </div>
                <div>
                    <p className="font-bold text-sm text-foreground">{product.title}</p>
                    <p className="text-xs text-muted-foreground">{product.price === 0 ? "GRATIS" : `$${product.price} USD`}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                        id="email" 
                        type="email" 
                        placeholder="tu@email.com" 
                        className="pl-9 bg-background border-input focus:border-neon focus-visible:ring-neon/20"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <p className="text-[10px] text-muted-foreground">
                    *Tus datos están protegidos. No hacemos spam.
                </p>
              </div>
            </div>

            <DialogFooter className="flex-col sm:justify-between gap-2">
              <Button type="submit" className="w-full bg-neon text-black hover:bg-neon/90 font-bold" disabled={loading}>
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Procesando...
                    </>
                ) : (
                    <>
                        {product.price === 0 ? "ENVIARME EL ACCESO" : "IR A PAGAR"}
                    </>
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="py-6 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 bg-neon/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-neon/20">
                <Check className="w-8 h-8 text-neon" />
            </div>
            <DialogTitle className="text-center text-2xl">¡Todo listo!</DialogTitle>
            <DialogDescription className="text-center max-w-[280px] mx-auto">
                {product.price === 0 
                    ? "Hemos enviado el link de acceso a tu correo. Revisa (incluso en Spam) en los próximos 2 minutos."
                    : "Serás redirigido a la pasarela de pago en unos segundos..."}
            </DialogDescription>
            <div className="pt-4">
                <Button variant="outline" onClick={handleClose} className="w-full">
                    Entendido
                </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}