import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Ahmed Ben Salem',
      company: 'Directeur Technique - SOTUBI',
      text: 'AQUAVOLTA a transformé notre infrastructure électrique. Service exceptionnel et équipe très professionnelle.',
      rating: 5,
      service: 'Électricité'
    },
    {
      name: 'Marie Dubois',
      company: 'Responsable Projet - SARL Martin',
      text: 'Installation de panneaux solaires parfaite. ROI atteint en moins de 3 ans grâce à leur expertise.',
      rating: 5,
      service: 'Énergies Renouvelables'
    },
    {
      name: 'Karim Trabelsi',
      company: 'Gérant - Restaurant Le Jasmin',
      text: 'Système de climatisation installé rapidement et efficacement. Aucun problème depuis 2 ans.',
      rating: 5,
      service: 'Fluides'
    },
    {
      name: 'Sophie Laurent',
      company: 'Directrice - Hôtel Méditerranée',
      text: 'Rénovation complète de notre établissement. Travaux de qualité et respect des délais.',
      rating: 5,
      service: 'Génie Civil'
    },
    {
      name: 'Mohamed Gharbi',
      company: 'PDG - Gharbi Industries',
      text: 'Construction de notre usine avec une expertise remarquable. Partenaire de confiance.',
      rating: 5,
      service: 'Construction Industrielle'
    },
    {
      name: 'Jean-Paul Moreau',
      company: 'Architecte - Cabinet Moreau',
      text: 'Collaboration exceptionnelle sur nos projets. Qualité technique et finitions parfaites.',
      rating: 5,
      service: 'Expertise Technique'
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Ce que disent nos <span className="text-primary">clients</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Plus de 500 projets réalisés avec succès en Tunisie et en Europe. 
            Découvrez les témoignages de nos clients satisfaits.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-float transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Quote className="w-8 h-8 text-primary/20 mr-2" />
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                
                <p className="text-foreground mb-4 italic leading-relaxed">
                  "{testimonial.text}"
                </p>
                
                <div className="border-t pt-4">
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground mb-2">{testimonial.company}</div>
                  <div className="inline-block bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                    {testimonial.service}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16 text-center">
          <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="text-4xl font-bold text-primary mb-2">500+</div>
            <div className="text-muted-foreground">Projets Réalisés</div>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <div className="text-4xl font-bold text-primary mb-2">15+</div>
            <div className="text-muted-foreground">Années d'Expérience</div>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <div className="text-4xl font-bold text-primary mb-2">98%</div>
            <div className="text-muted-foreground">Satisfaction Client</div>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.9s' }}>
            <div className="text-4xl font-bold text-primary mb-2">50+</div>
            <div className="text-muted-foreground">Experts Qualifiés</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;