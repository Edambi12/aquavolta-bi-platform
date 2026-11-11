import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Clock, Award } from 'lucide-react';
import heroImage from '@/assets/hero-aquavolte.jpg';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="AQUAVOLTE Engineering Excellence"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-overlay" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-20">
        <div className="max-w-4xl">
          {/* Main Heading */}
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              L'Ingénierie
              <span className="block bg-gradient-to-r from-volt-orange to-fresh-mint bg-clip-text text-transparent">
                d'Excellence
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl">
              Services d'ingénierie de haute qualité en électricité, fluides et génie civil. 
              Rapidité, fiabilité et professionnalisme pour vos projets en Tunisie et en Europe.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-hero">
              Demander un Devis
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-foreground">
              Découvrir nos Services
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center space-x-3 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <div className="font-semibold">Qualité Garantie</div>
                <div className="text-white/80">Certification professionnelle</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <div className="font-semibold">Rapidité d'Exécution</div>
                <div className="text-white/80">Délais respectés</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="font-semibold">Excellence Technique</div>
                <div className="text-white/80">Équipe qualifiée</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-20 w-20 h-20 bg-volt-orange/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-40 left-10 w-16 h-16 bg-primary/20 rounded-full animate-float" style={{ animationDelay: '2s' }} />
    </section>
  );
};

export default Hero;