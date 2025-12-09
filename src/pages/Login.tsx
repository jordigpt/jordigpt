import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Terminal } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) navigate("/admin");
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) navigate("/admin");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

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
              {!session ? (
                <Auth
                  supabaseClient={supabase}
                  appearance={{
                    theme: ThemeSupa,
                    variables: {
                      default: {
                        colors: {
                          brand: 'hsl(var(--primary))',
                          brandAccent: 'hsl(var(--primary))',
                          inputBackground: 'transparent',
                          inputText: 'hsl(var(--foreground))',
                          inputBorder: 'hsl(var(--border))',
                        },
                      },
                    },
                    className: {
                      button: 'bg-neon text-black hover:bg-neon/90 font-bold',
                      input: 'bg-background/50 border-input text-foreground',
                    }
                  }}
                  providers={[]}
                  theme="dark"
                />
              ) : (
                <Alert>
                   <AlertDescription>Ya has iniciado sesión. Redirigiendo...</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;