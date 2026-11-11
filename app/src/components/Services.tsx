import { Zap, Droplets, Building, Wrench, Shield, Lightbulb } from 'lucide-react';
import ServiceCard from './ServiceCard';
import electriciteImage from '@/assets/electricite-service.jpg';
import fluidesImage from '@/assets/fluides-service.jpg';
import genieCivilImage from '@/assets/genie-civil-service.jpg';

const Services = () => {
  const services = [
    {
      id: 'electricite',
      title: 'Électricité',
      description: 'Solutions électriques complètes pour l\'industrie et le bâtiment, de l\'installation à la maintenance.',
      icon: Zap,
      gradient: 'from-volt-orange to-yellow-400',
      priceTND: '850 TND',
      priceEUR: '250 €',
      image: electriciteImage,
      services: [
        'Installation électrique industrielle (HT/BT)',
        'Maintenance de systèmes électriques',
        'Énergies renouvelables & panneaux solaires',
        'Domotique et bâtiments intelligents',
        'Mise en conformité électrique',
        'Éclairage professionnel LED',
        'Automatisation industrielle',
        'Systèmes de sécurité électrique',
        'Câblage informatique et télécommunications',
        'Études électriques et schémas techniques'
      ],
      testimonials: [
        {
          name: 'Ahmed Ben Salem',
          company: 'Directeur Technique - SOTUBI',
          text: 'Service exceptionnel ! L\'équipe AQUAVOLTA a réalisé notre installation électrique industrielle en respectant parfaitement les délais.',
          rating: 5
        },
        {
          name: 'Marie Dubois',
          company: 'Responsable Projet - SARL Martin',
          text: 'Professionnalisme et expertise remarquables. Nos panneaux solaires fonctionnent parfaitement depuis 2 ans.',
          rating: 5
        }
      ]
    },
    {
      id: 'fluides',
      title: 'Fluides',
      description: 'Expertise en plomberie, CVC et traitement des fluides pour tous types de projets.',
      icon: Droplets,
      gradient: 'from-aqua-blue to-blue-400',
      priceTND: '650 TND',
      priceEUR: '190 €',
      image: fluidesImage,
      services: [
        'Plomberie industrielle et CVC',
        'Systèmes anti-incendie (sprinklers)',
        'Traitement des eaux et assainissement',
        'Installation de réseaux de gaz',
        'Climatisation et ventilation',
        'Maintenance préventive des installations',
        'Systèmes de pompage et surpression',
        'Réseaux d\'eau chaude sanitaire',
        'Installations frigorifiques',
        'Diagnostic et audit énergétique'
      ],
      testimonials: [
        {
          name: 'Karim Trabelsi',
          company: 'Gérant - Restaurant Le Jasmin',
          text: 'Installation de climatisation impeccable ! Équipe très professionnelle et service après-vente excellent.',
          rating: 5
        },
        {
          name: 'Sophie Laurent',
          company: 'Directrice - Hôtel Méditerranée',
          text: 'Système de plomberie et CVC installé rapidement et efficacement. Aucun problème depuis 18 mois.',
          rating: 5
        }
      ]
    },
    {
      id: 'genie-civil',
      title: 'Génie Civil',
      description: 'Construction, rénovation et aménagement avec une expertise technique reconnue.',
      icon: Building,
      gradient: 'from-concrete-gray to-slate-400',
      priceTND: '1200 TND',
      priceEUR: '350 €',
      image: genieCivilImage,
      services: [
        'Maçonnerie et construction de structures',
        'Travaux de terrassement et fondations',
        'VRD (Voiries et Réseaux Divers)',
        'Rénovation et réhabilitation',
        'Aménagement industriel',
        'Expertise technique et études',
        'Construction de bâtiments industriels',
        'Travaux de gros œuvre',
        'Aménagement d\'espaces commerciaux',
        'Contrôle qualité et conformité'
      ],
      testimonials: [
        {
          name: 'Mohamed Gharbi',
          company: 'PDG - Gharbi Industries',
          text: 'Construction de notre usine réalisée dans les temps et avec une qualité irréprochable. Équipe très compétente.',
          rating: 5
        },
        {
          name: 'Jean-Paul Moreau',
          company: 'Architecte - Cabinet Moreau',
          text: 'Partenaire de confiance pour nos projets de gros œuvre. Respect des normes et finitions parfaites.',
          rating: 5
        }
      ]
    }
  ];

  const additionalServices = [
    {
      title: 'Maintenance Prédictive',
      description: 'Suivi intelligent de vos installations pour prévenir les pannes',
      icon: Wrench
    },
    {
      title: 'Audit & Expertise',
      description: 'Diagnostic complet et recommandations d\'optimisation',
      icon: Shield
    },
    {
      title: 'Solutions Sur-Mesure',
      description: 'Conception et réalisation de projets techniques spécifiques',
      icon: Lightbulb
    }
  ];

  return (
    <section className="py-20 bg-gradient-service">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Nos <span className="text-primary">Expertises</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Trois départements d'excellence pour répondre à tous vos besoins d'ingénierie, 
            de la conception à la maintenance.
          </p>
        </div>

        {/* Main Services */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              description={service.description}
              icon={service.icon}
              services={service.services}
              priceTND={service.priceTND}
              priceEUR={service.priceEUR}
              gradient={service.gradient}
              image={service.image}
              department={service.id}
              testimonials={service.testimonials}
              delay={index * 0.2}
            />
          ))}
        </div>

        {/* Additional Services */}
        <div className="bg-white rounded-3xl p-8 shadow-card animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <h3 className="text-2xl font-bold text-center text-foreground mb-8">
            Services Complémentaires
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {additionalServices.map((service, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  <service.icon className="w-8 h-8" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">{service.title}</h4>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;