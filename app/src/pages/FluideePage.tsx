import { useState } from 'react';
import { ArrowLeft, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useSubmitData } from '@/hooks/useSubmitData';
import { useAuthContext } from '@/contexts/AuthContext';
import fluidPlomberie from '@/assets/fluid-plomberie-cvc.jpg';
import fluidSprinklers from '@/assets/fluid-sprinklers.jpg';
import fluidTraitement from '@/assets/fluid-traitement-eaux.jpg';
import fluidGaz from '@/assets/fluid-gaz.jpg';
import fluidClimatisation from '@/assets/fluid-climatisation.jpg';
import fluidPompage from '@/assets/fluid-pompage.jpg';

const FluideePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();
  const { submitData, isSubmitting } = useSubmitData();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    service: '',
    description: '',
    budget: ''
  });

  const services = [
    {
      id: 'plomberie-industrielle',
      title: 'Plomberie industrielle et CVC',
      description: 'Installation complète de systèmes de plomberie, chauffage, ventilation et climatisation',
      priceTND: '1800 TND',
      priceEUR: '540 €',
      image: fluidPlomberie,
      features: [
        'Réseaux d\'eau chaude/froide',
        'Systèmes de climatisation',
        'Ventilation industrielle',
        'Chauffage central',
        'Régulation automatique',
        'Maintenance préventive'
      ]
    },
    {
      id: 'anti-incendie',
      title: 'Systèmes anti-incendie (sprinklers)',
      description: 'Conception et installation de systèmes de protection incendie automatiques',
      priceTND: '2200 TND',
      priceEUR: '660 €',
      image: fluidSprinklers,
      features: [
        'Détection automatique',
        'Sprinklers et diffuseurs',
        'Centrales d\'alarme',
        'Extincteurs automatiques',
        'Colonnes sèches/humides',
        'Certification conforme'
      ]
    },
    {
      id: 'traitement-eaux',
      title: 'Traitement des eaux et assainissement',
      description: 'Solutions complètes de traitement, filtration et assainissement des eaux',
      priceTND: '2800 TND',
      priceEUR: '840 €',
      image: fluidTraitement,
      features: [
        'Stations d\'épuration',
        'Filtration et décontamination',
        'Traitement chimique',
        'Recyclage des eaux',
        'Fosse septique',
        'Analyses qualité'
      ]
    },
    {
      id: 'reseaux-gaz',
      title: 'Installation de réseaux de gaz',
      description: 'Installation sécurisée de réseaux de gaz naturel et GPL pour industrie et habitat',
      priceTND: '1600 TND',
      priceEUR: '480 €',
      image: fluidGaz,
      features: [
        'Canalisations gaz naturel',
        'Réservoirs GPL',
        'Détecteurs de fuite',
        'Vannes de sécurité',
        'Régulateurs de pression',
        'Certification Qualigaz'
      ]
    },
    {
      id: 'climatisation-ventilation',
      title: 'Climatisation et ventilation',
      description: 'Systèmes de climatisation et ventilation pour confort optimal',
      priceTND: '1200 TND',
      priceEUR: '360 €',
      image: fluidClimatisation,
      features: [
        'Climatisation centralisée',
        'Unités individuelles',
        'Ventilation mécanique',
        'Récupération de chaleur',
        'Filtration d\'air',
        'Contrôle intelligent'
      ]
    },
    {
      id: 'pompage-surpression',
      title: 'Systèmes de pompage et surpression',
      description: 'Installation de systèmes de pompage et surpression pour distribution d\'eau',
      priceTND: '1400 TND',
      priceEUR: '420 €',
      image: fluidPompage,
      features: [
        'Pompes centrifuges',
        'Groupes de surpression',
        'Réservoirs sous pression',
        'Automatisation',
        'Régulation de débit',
        'Maintenance préventive'
      ]
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    const serviceData = services.find(s => s.id === selectedService);
    
    const result = await submitData({
      departement: 'Fluide',
      data: {
        ...formData,
        service: serviceData?.title || '',
        serviceId: selectedService,
      }
    });

    if (result.success) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        service: '',
        description: '',
        budget: ''
      });
      setSelectedService(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-service">
          <div className="container mx-auto px-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="mb-8 text-primary hover:text-primary hover:bg-primary/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Button>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-aqua-blue to-blue-400 rounded-2xl flex items-center justify-center">
                <Droplets className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  Département <span className="text-primary">Fluides</span>
                </h1>
                <p className="text-xl text-muted-foreground mt-2">
                  Expertise en plomberie, CVC et traitement des fluides
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card key={service.id} className="group overflow-hidden hover:shadow-float transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={service.image} 
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="flex items-center space-x-4">
                          <span className="text-lg font-bold">{service.priceTND}</span>
                          <span className="text-sm opacity-90">ou {service.priceEUR}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-foreground mb-3">{service.title}</h3>
                      <p className="text-muted-foreground mb-4 text-sm">{service.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        {service.features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-center text-sm">
                            <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                            {feature}
                          </div>
                        ))}
                        {service.features.length > 3 && (
                          <div className="text-sm text-muted-foreground">
                            +{service.features.length - 3} autres services...
                          </div>
                        )}
                      </div>
                      
                      <Button 
                        className="w-full"
                        onClick={() => setSelectedService(service.id)}
                      >
                        Demander ce service
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Formulaire de demande */}
        {selectedService && (
          <section className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Demander un devis</h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedService(null)}
                  >
                    ✕
                  </Button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nom complet *</Label>
                      <Input 
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input 
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Téléphone *</Label>
                      <Input 
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="budget">Budget estimé</Label>
                      <Input 
                        id="budget"
                        placeholder="Ex: 3000 TND ou 900 €"
                        value={formData.budget}
                        onChange={(e) => setFormData({...formData, budget: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Adresse du projet *</Label>
                    <Input 
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description du projet *</Label>
                    <Textarea 
                      id="description"
                      rows={4}
                      placeholder="Décrivez votre projet en détail..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="flex space-x-4 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setSelectedService(null)}
                      disabled={isSubmitting}
                    >
                      Annuler
                    </Button>
                    <Button type="submit" className="flex-1" disabled={isSubmitting}>
                      {isSubmitting ? 'Envoi en cours...' : 'Envoyer la demande'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default FluideePage;