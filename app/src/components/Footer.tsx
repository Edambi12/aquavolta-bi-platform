import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Facebook, 
  Linkedin, 
  Instagram,
  Zap,
  Droplets,
  Building
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Services Électricité', href: '#electricite', icon: Zap },
    { name: 'Services Fluides', href: '#fluides', icon: Droplets },
    { name: 'Génie Civil', href: '#genie-civil', icon: Building }
  ];

  const locations = [
    {
      country: 'Tunisie',
      address: 'Zone Industrielle, Sousse 4000',
      phone: '+216 73 XXX XXX',
      email: 'contact.tn@aquavolte.com'
    },
    {
      country: 'France',
      address: 'Lyon, Rhône-Alpes',
      phone: '+33 4 XX XX XX XX',
      email: 'contact.fr@aquavolte.com'
    }
  ];

  return (
    <footer className="bg-steel-blue text-white">
      <div className="container mx-auto px-4">
        {/* Main Footer */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">AV</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">AQUAVOLTE</h3>
                  <p className="text-sm text-white/80">Ingénierie d'Excellence</p>
                </div>
              </div>
              <p className="text-white/80 mb-6 leading-relaxed">
                Votre partenaire de confiance pour tous vos projets d'ingénierie 
                en électricité, fluides et génie civil.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                <Button size="sm" variant="ghost" className="text-white hover:text-primary hover:bg-white/10">
                  <Facebook className="w-5 h-5" />
                </Button>
                <Button size="sm" variant="ghost" className="text-white hover:text-primary hover:bg-white/10">
                  <Linkedin className="w-5 h-5" />
                </Button>
                <Button size="sm" variant="ghost" className="text-white hover:text-primary hover:bg-white/10">
                  <Instagram className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Services</h4>
              <div className="space-y-3">
                {quickLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
                  >
                    <link.icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </a>
                ))}
                <a href="#configurateur" className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors">
                  <span className="w-4 h-4 bg-volt-orange rounded text-xs flex items-center justify-center">AI</span>
                  <span>Configurateur IA</span>
                </a>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Contact</h4>
              <div className="space-y-4">
                {locations.map((location, index) => (
                  <div key={index} className="border-l-2 border-primary pl-4">
                    <div className="font-semibold text-white mb-2">{location.country}</div>
                    <div className="space-y-2 text-sm text-white/80">
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{location.address}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>{location.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>{location.email}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="flex items-center space-x-2 text-sm text-white/80 mt-4">
                  <Clock className="w-4 h-4" />
                  <span>Lun-Ven: 8h-18h | Sam: 8h-12h</span>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Newsletter</h4>
              <p className="text-white/80 mb-4 text-sm">
                Restez informé de nos dernières innovations et projets.
              </p>
              <div className="space-y-3">
                <Input
                  type="email"
                  placeholder="Votre email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
                <Button className="w-full bg-gradient-hero hover:opacity-90">
                  S'abonner
                </Button>
              </div>
              
              {/* Currencies */}
              <div className="mt-6 p-3 bg-white/5 rounded-lg">
                <div className="text-sm text-white/80 mb-2">Devises acceptées:</div>
                <div className="flex space-x-3 text-sm font-medium">
                  <span className="px-2 py-1 bg-white/10 rounded">TND</span>
                  <span className="px-2 py-1 bg-white/10 rounded">EUR</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-white/20" />

        {/* Bottom Footer */}
        <div className="py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-white/80">
              © {currentYear} AQUAVOLTE. Tous droits réservés.
            </div>
            <div className="flex space-x-6 text-sm text-white/80">
              <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
              <a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a>
              <a href="#" className="hover:text-white transition-colors">CGV</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;