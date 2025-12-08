import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { ArrowLeft, Terminal, Lock, User } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulación de login
    setTimeout(() => {
      setIsLoading(false);
      alert("Acceso concedido (Simulación)");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon/10 rounded-full blur-[100px] -z-10"></div>

        <div className="w-full max-w-md relative z-10">
          <div className="bg-card border border-border shadow-2xl overflow-hidden rounded-lg">
            {/* Header */}
            <div className="bg-muted/50 p-6 border-b border-border text-center relative overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
               <div className="inline-flex bg-neon/10 p-3 rounded-full mb-4 border border-neon/20">
                 <Terminal className="w-8 h-8 text-neon" />
               </div>
               <h1 className="text-2xl font-bold tracking-tight">ACCESO AL SISTEMA</h1>
               <p className="text-muted-foreground text-sm mt-2">Introduce tus credenciales de operador</p>
            </div>

            {/* Form */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Identificador (Email)</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="operador@jordigpt.com" className="pl-10 bg-background/50 border-input focus:border-neon/50 transition-colors" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Clave de Acceso</Label>
                    <a href="#" className="text-xs text-neon hover:underline">¿Olvidaste la clave?</a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="password" type="password" placeholder="••••••••" className="pl-10 bg-background/50 border-input focus:border-neon/50 transition-colors" required />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-neon text-black hover:bg-neon/90 font-bold h-12 relative overflow-hidden group" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></span>
                      VERIFICANDO...
                    </span>
                  ) : (
                    <>
                      <span className="relative z-10">INICIAR SESIÓN</span>
                      <div className="absolute inset-0 h-full w-full bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out"></div>
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                ¿No tienes acceso?{" "}
                <Link to="/" className="text-foreground font-medium hover:text-neon transition-colors">
                  Adquiere una licencia
                </Link>
              </div>
            </div>
            
            {/* Footer decoration */}
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-neon/50 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;