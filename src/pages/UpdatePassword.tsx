import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Lock, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Verificar si hay sesión (el link de recuperación loguea al usuario temporalmente)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast.error("Enlace inválido o expirado.");
        navigate("/login");
      }
    });
  }, [navigate]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: password });

    if (error) {
      toast.error("Error: " + error.message);
    } else {
      toast.success("¡Contraseña actualizada correctamente!");
      navigate("/account");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-neon/20 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto bg-neon/10 p-3 rounded-full w-fit mb-4">
               <Lock className="w-6 h-6 text-neon" />
            </div>
            <CardTitle className="text-2xl">Nueva Contraseña</CardTitle>
            <CardDescription>
              Ingresa tu nueva contraseña para recuperar el acceso a tu cuenta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nueva Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                  className="bg-background/50"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-neon text-black font-bold hover:bg-neon/90"
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                ACTUALIZAR CONTRASEÑA
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UpdatePassword;