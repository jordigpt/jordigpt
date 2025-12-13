import { Link } from "react-router-dom";
import { Terminal, Menu, X, Sparkles, User, ShieldCheck, Zap, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useCart } from "@/context/CartContext";

const ADMIN_EMAIL = "jordithecreative@gmail.com";

const Navbar = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { items, setIsOpen } = useCart();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setIsAdmin(session?.user?.email === ADMIN_EMAIL);
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsAdmin(session?.user?.email === ADMIN_EMAIL);
    });

    return () => subscription.unsubscribe();
  }, []);

  const navLinks = [
    { name: "FAQ", href: "/#faq" },
  ];

  const renderUserActions = () => {
    if (isAdmin) {
      return (
        <Link to="/admin">
          <Button variant="outline" className="border-neon/50 text-neon hover:bg-neon hover:text-black gap-2">
            <ShieldCheck className="w-4 h-4" /> Admin Panel
          </Button>
        </Link>
      );
    }
    if (session) {
      return (
        <Link to="/account">
          <Button variant="outline" className="border-input hover:border-neon/50 hover:text-neon gap-2">
            <User className="w-4 h-4" /> Mis Productos
          </Button>
        </Link>
      );
    }
    return (
      <Link to="/login" className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs font-bold tracking-widest border border-border rounded uppercase transition-all hover:border-neon/50">
        Login
      </Link>
    );
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-neon/10 p-2 rounded border border-neon/20 group-hover:border-neon/50 transition-colors">
            <Terminal className="text-neon w-6 h-6" />
          </div>
          <span className="font-bold text-xl tracking-tighter text-foreground">
            JORDI<span className="text-neon">GPT</span>
          </span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <a 
            href="/#products" 
            className="text-sm font-bold text-foreground hover:text-neon transition-colors flex items-center gap-2"
          >
            <Zap className="w-4 h-4 text-neon" /> RECURSOS IA
          </a>
          <Link 
            to="/gallery" 
            className="text-sm font-bold text-foreground hover:text-neon transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-neon" /> PROMPT GALLERY
          </Link>
          
          {navLinks.map((link) => (
            <a 
              key={link.name}
              href={link.href} 
              className="text-sm font-medium text-muted-foreground hover:text-neon transition-colors"
            >
              {link.name}
            </a>
          ))}
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative hover:text-neon"
            onClick={() => setIsOpen(true)}
          >
            <ShoppingCart className="w-5 h-5" />
            {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-neon text-black text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {items.length}
                </span>
            )}
          </Button>

          <ModeToggle />
          {renderUserActions()}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative hover:text-neon"
            onClick={() => setIsOpen(true)}
          >
            <ShoppingCart className="w-5 h-5" />
            {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-neon text-black text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {items.length}
                </span>
            )}
          </Button>
          <ModeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground hover:text-neon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background border-l border-border w-[300px] p-0">
              {/* ... (Menu Mobile) ... */}
              <div className="flex flex-col h-full p-6">
                <div className="flex items-center gap-2 mb-12">
                   <div className="bg-neon/10 p-2 rounded border border-neon/20">
                    <Terminal className="text-neon w-5 h-5" />
                  </div>
                  <span className="font-bold text-xl tracking-tighter text-foreground">
                    JORDI<span className="text-neon">GPT</span>
                  </span>
                </div>

                <div className="flex flex-col gap-6">
                  {isAdmin && (
                    <SheetClose asChild>
                      <Link to="/admin" className="text-lg font-bold text-foreground hover:text-neon transition-colors flex items-center gap-2">
                         <ShieldCheck className="w-5 h-5 text-neon" /> ADMIN PANEL
                      </Link>
                    </SheetClose>
                  )}
                  {session && !isAdmin && (
                    <SheetClose asChild>
                      <Link to="/account" className="text-lg font-bold text-foreground hover:text-neon transition-colors flex items-center gap-2">
                         <User className="w-5 h-5 text-neon" /> MIS PRODUCTOS
                      </Link>
                    </SheetClose>
                  )}
                  
                  <SheetClose asChild>
                    <a href="/#products" className="text-lg font-bold text-foreground hover:text-neon transition-colors flex items-center gap-2">
                       <Zap className="w-5 h-5 text-neon" /> RECURSOS IA
                    </a>
                  </SheetClose>

                  <SheetClose asChild>
                    <Link to="/gallery" className="text-lg font-bold text-foreground hover:text-neon transition-colors flex items-center gap-2">
                       <Sparkles className="w-5 h-5 text-neon" /> PROMPT GALLERY
                    </Link>
                  </SheetClose>

                  {navLinks.map((link) => (
                    <SheetClose key={link.name} asChild>
                      <a 
                        href={link.href}
                        className="text-lg font-medium text-muted-foreground hover:text-neon transition-colors"
                      >
                        {link.name}
                      </a>
                    </SheetClose>
                  ))}
                  {!session && (
                    <SheetClose asChild>
                      <Link to="/login" className="text-lg font-medium text-muted-foreground hover:text-neon transition-colors">
                        LOGIN
                      </Link>
                    </SheetClose>
                  )}
                </div>

                <div className="mt-auto pt-8 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    © {new Date().getFullYear()} JordiGPT System
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;