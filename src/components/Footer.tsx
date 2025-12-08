const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/10 py-12">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-2xl font-bold tracking-tighter text-white mb-4">
          JORDI<span className="text-neon">GPT</span>
        </h3>
        <p className="text-gray-500 text-sm max-w-md mx-auto mb-8">
          La inteligencia artificial no va a reemplazarte. <br/>
          Alguien usando inteligencia artificial te va a reemplazar.
        </p>
        <div className="text-xs text-gray-600">
          © {new Date().getFullYear()} JordiGPT. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;