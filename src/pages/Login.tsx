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
      if (session) navigate("/account");
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // IMPORTANTE: Si es recuperación de contraseña, NO redirigir a account,
      // el AuthListener global en App.tsx se encargará de mandar a /update-password.
      if (event === "PASSWORD_RECOVERY") return;
      
      setSession(session);
      if (session) navigate("/account");
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
               <p className="text-muted-foreground text-sm mt-2">Introduce tus credenciales</p>
            </div>

            {/* Form */}
            <div className="p-8">
              {!session ? (
                <Auth
                  supabaseClient={supabase}
                  // IMPORTANTE: Esto le dice a Supabase a dónde volver después del email
                  redirectTo={window.location.origin} 
                  appearance={{
                    theme: ThemeSupa,
                    variables: {
                      default: {
                        colors: {
                          brand: '#d4e83a', // Neon color
                          brandAccent: '#c3d635', // Hover neon
                          brandButtonText: 'black', // Black text ensuring contrast
                          inputBackground: 'rgba(255,255,255,0.05)',
                          inputText: 'white',
                          inputBorder: 'rgba(255,255,255,0.2)',
                          inputLabelText: 'rgba(255,255,255,0.7)',
                        },
                        fontSizes: {
                          baseInputSize: '16px',
                        },
                        radii: {
                          borderRadiusButton: '8px',
                          inputBorderRadius: '8px',
                        },
                      },
                    },
                    style: {
                        button: {
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            fontSize: '0.875rem',
                            padding: '12px 24px',
                        },
                        anchor: {
                            color: '#d4e83a',
                            fontSize: '0.875rem',
                        },
                        label: {
                            color: '#9ca3af', // Gray-400
                            marginBottom: '4px',
                            fontSize: '0.875rem',
                        }
                    },
                    className: {
                        container: 'w-full',
                        button: 'w-full !bg-neon !text-black hover:!bg-neon/90 transition-all shadow-[0_0_15px_rgba(212,232,58,0.2)]',
                        input: '!bg-background/50 !border-border text-foreground focus:!border-neon transition-colors',
                    }
                  }}
                  providers={[]}
                  theme="dark"
                  localization={{
                    variables: {
                      sign_in: {
                        email_label: 'Correo Electrónico',
                        password_label: 'Contraseña',
                        button_label: 'INICIAR SESIÓN',
                        loading_button_label: 'ACCEDIENDO...',
                        link_text: '¿Ya tienes cuenta? Inicia sesión',
                      },
                      sign_up: {
                        email_label: 'Correo Electrónico',
                        password_label: 'Contraseña',
                        button_label: 'CREAR CUENTA',
                        loading_button_label: 'CREANDO...',
                        link_text: '¿No tienes cuenta? Regístrate',
                      },
                      forgotten_password: {
                        link_text: '¿Olvidaste tu contraseña?',
                        button_label: 'RECUPERAR CONTRASEÑA',
                        loading_button_label: 'ENVIANDO...',
                        email_label: 'Correo Electrónico',
                      }
                    }
                  }}
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