import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Privacy = () => {
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
          Políticas de <span className="text-neon">Privacidad</span>
        </h1>
        
        <div className="prose prose-invert max-w-none text-muted-foreground space-y-6">
          <p><strong>Última actualización:</strong> {new Date().toLocaleDateString()}</p>

          <p>
            En JordiGPT, operado por una LLC registrada en Estados Unidos, respetamos su privacidad y 
            estamos comprometidos a proteger los datos personales que nos proporciona. Esta Política de 
            Privacidad explica cómo recopilamos, usamos, divulgamos y salvaguardamos su información al 
            visitar nuestro sitio web y utilizar nuestros servicios de consultoría y productos digitales.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">1. Información que Recopilamos</h2>
          <p>Podemos recopilar información sobre usted de varias maneras, incluyendo:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Datos Personales:</strong> Nombre, dirección de correo electrónico e información de contacto que nos proporciona voluntariamente al registrarse, suscribirse a nuestro boletín o adquirir un producto.</li>
            <li><strong>Datos Financieros:</strong> Datos relacionados con su método de pago (por ejemplo, número de tarjeta de crédito, marca, fecha de vencimiento). Estos datos son recopilados y procesados directamente por nuestras pasarelas de pago seguras (como Stripe, PayPal o MercadoPago). No almacenamos su información financiera en nuestros servidores.</li>
            <li><strong>Datos de Uso y Analíticas:</strong> Información recopilada automáticamente sobre su interacción con nuestro sitio (dirección IP, tipo de navegador, sistema operativo, tiempos de acceso y páginas visitadas). Utilizamos herramientas como <strong>PostHog</strong> para analizar el comportamiento y mejorar nuestra plataforma.</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">2. Uso de su Información</h2>
          <p>Utilizamos la información recopilada para:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Procesar sus transacciones y entregar los productos o servicios adquiridos.</li>
            <li>Crear y gestionar su cuenta en nuestra plataforma ("Su Arsenal").</li>
            <li>Proporcionar soporte técnico y atención al cliente.</li>
            <li>Enviarle correos electrónicos administrativos (confirmaciones de pedido, actualizaciones de servicio).</li>
            <li>Enviarle comunicaciones de marketing y ofertas (puede darse de baja en cualquier momento).</li>
            <li>Mejorar nuestra plataforma, diagnosticar problemas y analizar tendencias.</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">3. Divulgación de su Información</h2>
          <p>
            No vendemos, alquilamos ni comercializamos su información personal a terceros. Solo compartiremos 
            su información en las siguientes situaciones:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Proveedores de Servicios:</strong> Podemos compartir su información con terceros que prestan servicios para nosotros (procesamiento de pagos, envío de emails a través de Resend, alojamiento de datos en Supabase, analíticas).</li>
            <li><strong>Obligaciones Legales:</strong> Si nos es requerido por ley, orden judicial, o para proteger los derechos y la propiedad de la empresa.</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">4. Tecnologías de Rastreo (Cookies)</h2>
          <p>
            Podemos usar cookies, balizas web, píxeles de seguimiento (como PostHog) y otras tecnologías de 
            rastreo en el sitio para ayudar a personalizar y mejorar su experiencia. Al usar el sitio, usted 
            acepta el uso de estas tecnologías. Puede configurar su navegador para rechazar las cookies, aunque 
            esto puede afectar ciertas funcionalidades de la plataforma.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">5. Seguridad de los Datos</h2>
          <p>
            Utilizamos medidas de seguridad administrativas, técnicas y físicas (incluyendo encriptación SSL) 
            para ayudar a proteger su información personal. Si bien hemos tomado medidas razonables para asegurar 
            los datos que nos proporciona, tenga en cuenta que a pesar de nuestros esfuerzos, ninguna medida 
            de seguridad es perfecta o impenetrable, y ningún método de transmisión de datos puede ser garantizado 
            contra cualquier interceptación.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">6. Derechos del Usuario (CCPA / GDPR / Otros)</h2>
          <p>
            Dependiendo de su ubicación, usted tiene derecho a acceder, corregir, actualizar o solicitar la 
            eliminación de su información personal. Para ejercer estos derechos, por favor contáctenos. 
            Procesaremos su solicitud de acuerdo con las leyes locales aplicables y los requisitos regulatorios 
            de los Estados Unidos.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">7. Contacto</h2>
          <p>
            Si tiene preguntas o comentarios acerca de esta Política de Privacidad o el manejo de sus datos, 
            puede responder directamente a cualquier correo electrónico de confirmación que haya recibido de 
            nuestro sistema.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;