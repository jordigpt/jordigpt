import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, AlertCircle, ArrowRight, Home } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const PaymentResult = () => {
  const location = useLocation();
  const [status, setStatus] = useState<'success' | 'failure' | 'pending'>('pending');

  useEffect(() => {
    if (location.pathname.includes("success")) {
      setStatus('success');
    } else if (location.pathname.includes("failure")) {
      setStatus('failure');
    } else {
      setStatus('pending'); // Default to pending/unknown
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4 pt-32 pb-20">
        <Card className="w-full max-w-md border-border shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted/20">
              {status === 'success' && <CheckCircle2 className="h-12 w-12 text-neon" />}
              {status === 'failure' && <XCircle className="h-12 w-12 text-destructive" />}
              {status === 'pending' && <AlertCircle className="h-12 w-12 text-yellow-500" />}
            </div>
            <CardTitle className="text-2xl font-bold uppercase tracking-tight">
              {status === 'success' && "¡Pago Exitoso!"}
              {status === 'failure' && "Pago Fallido"}
              {status === 'pending' && "Procesando Pago..."}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="text-center text-muted-foreground">
            {status === 'success' && (
              <p>
                Tu acceso ha sido confirmado. <br/>
                Revisa tu correo electrónico para las instrucciones de acceso al material.
              </p>
            )}
            {status === 'failure' && (
              <p>
                Hubo un problema al procesar tu tarjeta.<br/>
                Por favor, intenta nuevamente o utiliza otro medio de pago.
              </p>
            )}
            {status === 'pending' && (
              <p>
                Tu pago está siendo revisado.<br/>
                Te notificaremos en cuanto se confirme la transacción.
              </p>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-6">
            {status === 'success' ? (
               <Link to="/" className="w-full">
                 <Button className="w-full bg-neon text-black hover:bg-neon/90 font-bold">
                   Volver al Arsenal <Home className="ml-2 h-4 w-4" />
                 </Button>
               </Link>
            ) : (
               <div className="flex flex-col gap-3 w-full">
                 <Link to="/" className="w-full">
                    <Button variant="default" className="w-full">
                        Intentar nuevamente <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                 </Link>
                 <Link to="/" className="w-full">
                    <Button variant="outline" className="w-full border-border text-muted-foreground">
                        Cancelar
                    </Button>
                 </Link>
               </div>
            )}
          </CardFooter>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentResult;