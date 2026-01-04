import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Terminal } from "lucide-react";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AuthModal = ({ open, onOpenChange }: AuthModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader className="text-center">
          <div className="inline-flex bg-neon/10 p-3 rounded-full mb-4 border border-neon/20 w-fit mx-auto">
            <Terminal className="w-8 h-8 text-neon" />
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight">ACCESO REQUERIDO</DialogTitle>
          <DialogDescription>
            Para acceder a este recurso, por favor inicia sesión o crea una cuenta.
          </DialogDescription>
        </DialogHeader>
        <div className="p-4">
          <Auth
            supabaseClient={supabase}
            // CRÍTICO: Esto asegura que el link del email redirija a tu app correctamente
            redirectTo={window.location.origin} 
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#d4e83a', // Neon color
                    brandAccent: '#c3d635',
                    brandButtonText: 'black',
                    inputBackground: 'rgba(255,255,255,0.05)',
                    inputText: 'white',
                    inputBorder: 'rgba(255,255,255,0.2)',
                    inputLabelText: 'rgba(255,255,255,0.7)',
                  },
                },
              },
              style: {
                button: {
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    fontSize: '0.875rem',
                    padding: '12px 24px',
                    backgroundColor: '#d4e83a',
                    color: 'black',
                    border: 'none',
                },
                anchor: {
                    color: '#d4e83a',
                    fontSize: '0.875rem',
                },
                label: {
                    color: '#9ca3af',
                    fontSize: '0.875rem',
                },
                input: {
                    color: 'white',
                }
              },
              className: {
                button: 'w-full !bg-neon !text-black hover:!bg-neon/90 font-bold shadow-[0_0_15px_rgba(212,232,58,0.2)]',
                input: '!bg-background/50 !border-border text-foreground focus:!border-neon',
              }
            }}
            providers={[]}
            theme="dark"
            view="sign_in" // Por defecto en login
            showLinks={true} // Asegura que se muestren los links de "Olvide pass" y "Registrarse"
            localization={{
                variables: {
                  sign_in: {
                    email_label: 'Correo Electrónico',
                    password_label: 'Contraseña',
                    button_label: 'INICIAR SESIÓN',
                    link_text: '¿Ya tienes cuenta? Inicia sesión',
                  },
                  sign_up: {
                    email_label: 'Correo Electrónico',
                    password_label: 'Contraseña',
                    button_label: 'CREAR CUENTA',
                    link_text: '¿No tienes cuenta? Regístrate',
                  },
                  forgotten_password: {
                    link_text: '¿Olvidaste tu contraseña?',
                    button_label: 'ENVIAR INSTRUCCIONES',
                    loading_button_label: 'ENVIANDO...',
                    email_label: 'Ingresa tu Correo Electrónico',
                    confirmation_text: 'Revisa tu correo con el enlace de recuperación',
                  }
                }
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};