import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-neon selection:text-black">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-24 max-w-4xl">
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-neon transition-colors text-sm font-medium mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" /> VOLVER AL INICIO
        </Link>

        <h1 className="text-4xl md:text-5xl font-black mb-8 uppercase tracking-tighter">
          Términos y <span className="text-neon">Condiciones</span>
        </h1>
        
        <div className="prose prose-invert max-w-none text-muted-foreground space-y-6">
          <p><strong>Última actualización:</strong> {new Date().toLocaleDateString()}</p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">1. Información de la Empresa y Servicios</h2>
          <p>
            Estos Términos y Condiciones ("Términos") rigen el uso del sitio web JordiGPT y la compra de 
            nuestros servicios de consultoría en Inteligencia Artificial (IA) y productos digitales 
            (cursos, guías, plantillas). Este sitio es operado por una sociedad de responsabilidad limitada 
            (LLC) registrada en los Estados Unidos de América. Al acceder a nuestro sitio o adquirir 
            nuestros servicios, usted acepta estar sujeto a estos Términos.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">2. Productos Digitales y Política de Entrega</h2>
          <p>
            <strong>Entrega Inmediata:</strong> Todos nuestros productos digitales (guías, accesos a comunidades, 
            plantillas) se entregan de forma inmediata y electrónica a través de nuestro portal una vez confirmado 
            el pago. El cliente recibirá las instrucciones de acceso en el correo electrónico proporcionado.
          </p>
          <p>
            <strong>Licencia de Uso:</strong> Al adquirir un producto digital, se le otorga una licencia personal, 
            intransferible y no exclusiva para uso propio. Queda estrictamente prohibida la reventa, distribución 
            o reproducción comercial de nuestros materiales.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">3. Consultoría y Servicios B2B</h2>
          <p>
            Los servicios de consultoría y desarrollo de IA para particulares y empresas (PyMEs) se rigen por 
            propuestas comerciales específicas y contratos de servicio ("Statement of Work"). Los tiempos de 
            entrega, hitos y pagos se definirán en dichos documentos de mutuo acuerdo antes de iniciar el proyecto.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">4. Política de Reembolsos y Cancelaciones (Importante)</h2>
          <p>
            <strong>Productos Digitales:</strong> Dada la naturaleza descargable y de acceso inmediato de nuestros 
            productos digitales e infoproductos, <strong>todas las ventas son finales y no se ofrecen reembolsos</strong> 
            una vez que el contenido ha sido accedido, descargado o visualizado, a menos que se especifique 
            expresamente lo contrario en la página de ventas del producto (por ejemplo, una garantía explícita 
            de X días). Esta política cumple con los estándares para productos digitales.
          </p>
          <p>
            <strong>Servicios de Consultoría:</strong> Las cancelaciones de proyectos de consultoría estarán 
            sujetas a los términos del contrato firmado. Por lo general, los pagos por horas ya trabajadas o 
            hitos ya entregados no son reembolsables.
          </p>
          <p>
            <strong>Disputas de Pagos (Chargebacks):</strong> En caso de iniciar una disputa no justificada a través 
            de su banco o proveedor de tarjeta de crédito (Stripe, PayPal, MercadoPago), nos reservamos el derecho 
            de suspender inmediatamente su acceso a todas las plataformas y materiales, así como de presentar 
            pruebas de acceso y uso del servicio a la entidad financiera.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">5. Precios y Pagos</h2>
          <p>
            Todos los precios están expresados en Dólares Estadounidenses (USD) a menos que se indique lo contrario. 
            Procesamos pagos de forma segura a través de pasarelas de terceros (Stripe, PayPal, Mercado Pago). 
            No almacenamos los datos completos de su tarjeta de crédito. Usted es responsable de proporcionar 
            información de facturación precisa.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">6. Limitación de Responsabilidad (Disclaimer)</h2>
          <p>
            <strong>No garantizamos resultados financieros:</strong> Aunque nuestros sistemas y guías están probados, 
            los resultados dependen de la ejecución, el mercado y el esfuerzo de cada individuo o empresa. JordiGPT LLC 
            no garantiza ganancias, ingresos ni el éxito de su negocio. La información proporcionada es estrictamente 
            educativa e informativa.
          </p>
          <p>
            En ningún caso la empresa, sus directores, empleados o afiliados serán responsables por cualquier 
            daño indirecto, incidental, especial o consecuente que surja del uso de nuestros productos, servicios 
            de IA o este sitio web.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">7. Ley Aplicable y Jurisdicción</h2>
          <p>
            Estos Términos se regirán e interpretarán de acuerdo con las leyes del Estado de registro de la LLC 
            en Estados Unidos, sin dar efecto a sus principios de conflictos de leyes. Cualquier disputa que surja 
            de estos términos será resuelta en los tribunales competentes de dicha jurisdicción.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">8. Contacto</h2>
          <p>
            Si tiene alguna pregunta sobre estos Términos, por favor contáctenos a través de los canales de soporte 
            disponibles en la plataforma o respondiendo a los correos de confirmación de su orden.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;