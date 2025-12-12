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
            view="sign_up"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};