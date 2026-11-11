import { useState } from 'react';
import { ArrowLeft, Zap, ChevronDown, ChevronUp } from 'lucide-react';
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
import elecInstallation from '@/assets/elec-installation-industrielle.jpg';
import elecMaintenance from '@/assets/elec-maintenance.jpg';
import elecSolaire from '@/assets/elec-solaire.jpg';
import elecDomotique from '@/assets/elec-domotique.jpg';
import elecEclairage from '@/assets/elec-eclairage-led.jpg';
import elecTableaux from '@/assets/elec-tableaux.jpg';

const ElectricitePage = () => {
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
      id: 'installation-industrielle',
      title: 'Installation électrique industrielle (HT/BT)',
      description: 'Conception et installation complète de systèmes électriques haute et basse tension pour l\'industrie',
      priceTND: '2500 TND',
      priceEUR: '750 €',
      image: elecInstallation,
      features: [
        'Tableaux électriques HT/BT',
        'Câblage industriel',
        'Mise à la terre',
        'Protection contre la foudre',
        'Éclairage industriel',
        'Prises de force'
      ]
    },
    {
      id: 'maintenance-systemes',
      title: 'Maintenance de systèmes électriques',
      description: 'Maintenance préventive et curative de vos installations électriques',
      priceTND: '450 TND',
      priceEUR: '135 €',
      image: elecMaintenance,
      features: [
        'Diagnostic électrique',
        'Remplacement de composants',
        'Nettoyage des équipements',
        'Contrôle des protections',
        'Rapport de maintenance',
        'Service d\'urgence 24h/7j'
      ]
    },
    {
      id: 'energies-renouvelables',
      title: 'Énergies renouvelables & panneaux solaires',
      description: 'Installation et maintenance de systèmes photovoltaïques et énergies vertes',
      priceTND: '3200 TND',
      priceEUR: '950 €',
      image: elecSolaire,
      features: [
        'Panneaux photovoltaïques',
        'Onduleurs et batteries',
        'Raccordement au réseau',
        'Monitoring énergétique',
        'Maintenance annuelle',
        'Optimisation énergétique'
      ]
    },
    {
      id: 'domotique',
      title: 'Domotique et bâtiments intelligents',
      description: 'Solutions d\'automatisation et de contrôle intelligent pour bâtiments',
      priceTND: '1800 TND',
      priceEUR: '540 €',
      image: elecDomotique,
      features: [
        'Système de contrôle centralisé',
        'Éclairage intelligent',
        'Gestion climatique',
        'Sécurité automatisée',
        'Interface mobile',
        'Programmation personnalisée'
      ]
    },
    {
      id: 'mise-en-conformite',
      title: 'Mise en conformité électrique',
      description: 'Audit et mise aux normes de vos installations électriques',
      priceTND: '850 TND',
      priceEUR: '255 €',
      image: elecTableaux,
      features: [
        'Audit de conformité',
        'Mise aux normes NF C 15-100',
        'Certification Consuel',
        'Rapport de conformité',
        'Conseils d\'optimisation',
        'Suivi réglementaire'
      ]
    },
    {
      id: 'eclairage-led',
      title: 'Éclairage professionnel LED',
      description: 'Conception et installation d\'éclairage LED haute performance',
      priceTND: '650 TND',
      priceEUR: '195 €',
      image: elecEclairage,
      features: [
        'Étude d\'éclairage',
        'Luminaires LED haute efficacité',
        'Contrôle d\'intensité',
        'Éclairage de sécurité',
        'Économies d\'énergie',
        'Garantie 5 ans'
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
      departement: 'Électricité',
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
              <div className="w-16 h-16 bg-gradient-to-br from-volt-orange to-yellow-400 rounded-2xl flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  Département <span className="text-primary">Électricité</span>
                </h1>
                <p className="text-xl text-muted-foreground mt-2">
                  Solutions électriques complètes pour l'industrie et le bâtiment
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
                    <ChevronUp className="w-4 h-4" />
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
                        placeholder="Ex: 5000 TND ou 1500 €"
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

export default ElectricitePage;