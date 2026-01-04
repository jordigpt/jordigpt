import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { CartProvider } from "@/context/CartContext";
// import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { CartSheet } from "@/components/CartSheet";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import PaymentResult from "./pages/PaymentResult";
import PromptGallery from "./pages/PromptGallery";
import Account from "./pages/Account";
import PurchasedProduct from "./pages/PurchasedProduct";
import NotFound from "./pages/NotFound";
import UpdatePassword from "./pages/UpdatePassword";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

// Componente wrapper para manejar redirecciones de autenticación
const AuthListener = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        navigate("/update-password");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
            <CartProvider>
                <Toaster />
                <Sonner />
                <CartSheet />
                <BrowserRouter>
                    <AuthListener />
                    <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/gallery" element={<PromptGallery />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/update-password" element={<UpdatePassword />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/account" element={<Account />} />
                        <Route path="/my-products/:productId" element={<PurchasedProduct />} />
                        
                        <Route path="/payment/success" element={<PaymentResult />} />
                        <Route path="/payment/failure" element={<PaymentResult />} />
                        <Route path="/payment/pending" element={<PaymentResult />} />

                        <Route path="/:slug" element={<ProductDetail />} />
                        <Route path="/product/:id" element={<ProductDetail />} />

                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </BrowserRouter>
            </CartProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;