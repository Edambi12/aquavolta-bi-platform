import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  services: string[];
  priceTND?: string;
  priceEUR?: string;
  gradient: string;
  image?: string;
  delay?: number;
  department: string;
  testimonials?: Array<{
    name: string;
    company: string;
    text: string;
    rating: number;
  }>;
}

const ServiceCard = ({ 
  title, 
  description, 
  icon: Icon, 
  services, 
  priceTND,
  priceEUR,
  gradient,
  image,
  department,
  testimonials,
  delay = 0 
}: ServiceCardProps) => {
  const navigate = useNavigate();
  return (
    <Card 
      className="group relative overflow-hidden border-0 shadow-card hover:shadow-float transition-all duration-300 hover:-translate-y-2 animate-fade-in"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
      
      <CardContent className="relative p-0 overflow-hidden">
        {/* Image */}
        {image && (
          <div className="relative h-48 overflow-hidden">
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        )}

        <div className="p-6">
          {/* Content */}
          <h3 className="text-2xl font-bold text-foreground mb-3">{title}</h3>
          <p className="text-muted-foreground mb-4 leading-relaxed">{description}</p>

          {/* Prices */}
          <div className="flex items-center space-x-4 mb-4">
            {priceTND && (
              <div className="text-sm text-muted-foreground">
                À partir de <span className="text-lg font-bold text-primary">{priceTND}</span>
              </div>
            )}
            {priceEUR && (
              <div className="text-sm text-muted-foreground">
                ou <span className="text-lg font-bold text-primary">{priceEUR}</span>
              </div>
            )}
          </div>

          {/* Services List - Show first 6 only */}
          <div className="space-y-2 mb-6">
            {services.slice(0, 6).map((service, index) => (
              <div key={index} className="flex items-center text-sm text-foreground">
                <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0" />
                {service}
              </div>
            ))}
            {services.length > 6 && (
              <div className="text-sm text-muted-foreground italic">
                +{services.length - 6} autres services...
              </div>
            )}
          </div>

          {/* Testimonial */}
          {testimonials && testimonials[0] && (
            <div className="bg-muted/50 rounded-lg p-4 mb-4">
              <div className="flex items-center mb-2">
                {[...Array(testimonials[0].rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-sm text-foreground mb-2 italic">"{testimonials[0].text}"</p>
              <div className="text-xs text-muted-foreground">
                <strong>{testimonials[0].name}</strong> - {testimonials[0].company}
              </div>
            </div>
          )}

          {/* CTA */}
          <Button 
            variant="ghost" 
            className="w-full text-primary hover:text-primary hover:bg-primary/10 group/btn"
            onClick={() => navigate(`/${department}`)}
          >
            Voir tous les services
            <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Hover Effect Line */}
        <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-hero transition-all duration-300 group-hover:w-full" />
      </CardContent>
    </Card>
  );
};

export default ServiceCard;