import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Users, MapPin, Trophy } from 'lucide-react';

const TrustSection = () => {
  const stats = [
    { 
      icon: Users, 
      value: '500+', 
      label: 'Clients Satisfaits',
      description: 'Particuliers et entreprises'
    },
    { 
      icon: Trophy, 
      value: '850+', 
      label: 'Projets Réalisés',
      description: 'En Tunisie et en Europe'
    },
    { 
      icon: Star, 
      value: '4.9/5', 
      label: 'Note Moyenne',
      description: 'Basée sur les avis clients'
    },
    { 
      icon: MapPin, 
      value: '15+', 
      label: 'Villes Couvertes',
      description: 'Tunisie, France, Belgique'
    }
  ];

  const testimonials = [
    {
      name: 'Ahmed Ben Salem',
      role: 'Directeur Technique, IndusTech',
      content: 'AQUAVOLTE a transformé notre usine avec une installation électrique impeccable. Rapidité et professionnalisme au rendez-vous.',
      rating: 5,
      project: 'Installation électrique industrielle'
    },
    {
      name: 'Marie Dubois',
      role: 'Architecte, Lyon',
      content: 'Excellent travail sur notre projet de rénovation. L\'équipe a respecté tous les délais et la qualité est irréprochable.',
      rating: 5,
      project: 'Rénovation complète'
    },
    {
      name: 'Sofiane Trabelsi',
      role: 'Promoteur Immobilier',
      content: 'Partenaire de confiance pour tous nos projets. Le configurateur IA nous fait gagner un temps précieux.',
      rating: 5,
      project: 'Projets multiples'
    }
  ];

  const certifications = [
    'ISO 9001:2015',
    'Certification Électrique TN',
    'Agrément Génie Civil',
    'Partenaire Schneider Electric'
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Stats Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Ils nous font <span className="text-primary">confiance</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Des années d'expertise au service de vos projets les plus ambitieux
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center shadow-card hover:shadow-float transition-all animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-hero rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="font-semibold text-foreground mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mb-16 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <h3 className="text-2xl font-bold text-center text-foreground mb-8">
            Témoignages Clients
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-volt-orange fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                  <div className="border-t pt-4">
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    <Badge variant="secondary" className="mt-2">
                      {testimonial.project}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <h3 className="text-xl font-semibold text-foreground mb-6">
            Certifications & Agréments
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {certifications.map((cert, index) => (
              <Badge key={index} variant="outline" className="px-4 py-2 text-sm">
                {cert}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;