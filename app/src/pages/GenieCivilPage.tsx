import { useState } from 'react';
import { ArrowLeft, Building } from 'lucide-react';
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
import civilMaconnerie from '@/assets/civil-maconnerie.jpg';
import civilTerrassement from '@/assets/civil-terrassement.jpg';
import civilVRD from '@/assets/civil-vrd.jpg';
import civilRenovation from '@/assets/civil-renovation.jpg';
import civilAmenagement from '@/assets/civil-amenagement.jpg';
import civilBatiment from '@/assets/civil-batiment.jpg';

const GenieCivilPage = () => {
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
      id: 'maconnerie-construction',
      title: 'Maçonnerie et construction de structures',
      description: 'Construction complète de structures en béton armé, maçonnerie traditionnelle et moderne',
      priceTND: '3500 TND',
      priceEUR: '1050 €',
      image: civilMaconnerie,
      features: [
        'Béton armé et précontraint',
        'Maçonnerie traditionnelle',
        'Structures métalliques',
        'Murs porteurs',
        'Dalles et planchers',
        'Finitions de qualité'
      ]
    },
    {
      id: 'terrassement-fondations',
      title: 'Travaux de terrassement et fondations',
      description: 'Préparation de terrain et réalisation de fondations solides pour tous types de constructions',
      priceTND: '2800 TND',
      priceEUR: '840 €',
      image: civilTerrassement,
      features: [
        'Étude géotechnique',
        'Excavation et déblaiement',
        'Fondations superficielles',
        'Fondations profondes',
        'Drainage et étanchéité',
        'Remblaiement et compactage'
      ]
    },
    {
      id: 'vrd',
      title: 'VRD (Voiries et Réseaux Divers)',
      description: 'Aménagement de voiries et installation de tous les réseaux d\'infrastructure',
      priceTND: '4200 TND',
      priceEUR: '1260 €',
      image: civilVRD,
      features: [
        'Voiries et chaussées',
        'Réseaux d\'assainissement',
        'Réseaux électriques',
        'Éclairage public',
        'Réseaux de télécommunications',
        'Espaces verts'
      ]
    },
    {
      id: 'renovation-rehabilitation',
      title: 'Rénovation et réhabilitation',
      description: 'Rénovation complète et réhabilitation de bâtiments anciens avec techniques modernes',
      priceTND: '2600 TND',
      priceEUR: '780 €',
      image: civilRenovation,
      features: [
        'Diagnostic structure',
        'Renforcement structural',
        'Isolation thermique',
        'Réfection des façades',
        'Mise aux normes',
        'Finitions intérieures'
      ]
    },
    {
      id: 'amenagement-industriel',
      title: 'Aménagement industriel',
      description: 'Conception et réalisation d\'aménagements spécialisés pour l\'industrie',
      priceTND: '5500 TND',
      priceEUR: '1650 €',
      image: civilAmenagement,
      features: [
        'Bâtiments industriels',
        'Halls de production',
        'Plateformes logistiques',
        'Aires de stockage',
        'Équipements spécialisés',
        'Conformité industrielle'
      ]
    },
    {
      id: 'batiments-industriels',
      title: 'Construction de bâtiments industriels',
      description: 'Construction clé en main de bâtiments industriels et commerciaux',
      priceTND: '6800 TND',
      priceEUR: '2040 €',
      image: civilBatiment,
      features: [
        'Conception architecturale',
        'Structure métallique/béton',
        'Couverture et étanchéité',
        'Aménagements intérieurs',
        'Conformité aux normes',
        'Livraison clé en main'
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
      departement: 'Génie Civil',
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
              <div className="w-16 h-16 bg-gradient-to-br from-concrete-gray to-slate-400 rounded-2xl flex items-center justify-center">
                <Building className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  Département <span className="text-primary">Génie Civil</span>
                </h1>
                <p className="text-xl text-muted-foreground mt-2">
                  Construction, rénovation et aménagement avec expertise technique
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
                        placeholder="Ex: 10000 TND ou 3000 €"
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

export default GenieCivilPage;