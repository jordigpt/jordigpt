import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-2xl font-bold tracking-tighter text-foreground mb-4">
          JORDI<span className="text-neon">GPT</span>
        </h3>
        <p className="text-muted-foreground text-sm max-w-md mx-auto mb-8">
          La inteligencia artificial no va a reemplazarte. <br/>
          Alguien usando inteligencia artificial te va a reemplazar.
        </p>
        
        <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm font-medium">
          <Link to="/terminos" className="text-muted-foreground hover:text-neon transition-colors">
            Términos y Condiciones
          </Link>
          <Link to="/privacidad" className="text-muted-foreground hover:text-neon transition-colors">
            Políticas de Privacidad
          </Link>
        </div>

        <div className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} JordiGPT LLC. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;