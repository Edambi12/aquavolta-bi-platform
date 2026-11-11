import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Database, ArrowLeft, Calendar, User, Mail, Phone, MapPin, Banknote, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/lib/errors';

interface UserData {
  id: string;
  created_at: string;
  contenu: {
    name: string;
    email: string;
    phone: string;
    address: string;
    budget: string;
    description: string;
    service: string;
    serviceId: string;
  };
  departements: {
    nom: string;
  };
}

const DataView = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuthContext();
  const { toast } = useToast();
  const [data, setData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartement, setSelectedDepartement] = useState<string>('Tous');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: userData, error } = await supabase
        .from('donnees_utilisateur')
        .select(`
          id,
          created_at,
          contenu,
          departements (
            nom
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setData(userData as unknown as UserData[]);
    } catch (error: unknown) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: getErrorMessage(error) || 'Impossible de récupérer les données',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, fetchData]);

  const filteredData = selectedDepartement === 'Tous' 
    ? data 
    : data.filter(item => item.departements.nom === selectedDepartement);

  const departements = ['Tous', 'Électricité', 'Fluide', 'Génie Civil'];

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-16">
        <section className="py-16 bg-gradient-service">
          <div className="container mx-auto px-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="mb-8 text-primary hover:text-primary hover:bg-primary/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au tableau de bord
            </Button>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center">
                <Database className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  Mes <span className="text-primary">Demandes</span>
                </h1>
                <p className="text-xl text-muted-foreground mt-2">
                  Consultez toutes vos demandes de services
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-8">
          {/* Filtres */}
          <div className="flex flex-wrap gap-2 mb-8">
            {departements.map((dept) => (
              <Button
                key={dept}
                variant={selectedDepartement === dept ? 'default' : 'outline'}
                onClick={() => setSelectedDepartement(dept)}
                size="sm"
              >
                {dept}
              </Button>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total des demandes</CardDescription>
                <CardTitle className="text-3xl">{data.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Électricité</CardDescription>
                <CardTitle className="text-3xl">
                  {data.filter(d => d.departements.nom === 'Électricité').length}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Fluides</CardDescription>
                <CardTitle className="text-3xl">
                  {data.filter(d => d.departements.nom === 'Fluide').length}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Génie Civil</CardDescription>
                <CardTitle className="text-3xl">
                  {data.filter(d => d.departements.nom === 'Génie Civil').length}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Liste des demandes */}
          {filteredData.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <Database className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Aucune demande</h3>
                <p className="text-muted-foreground mb-6">
                  Vous n'avez pas encore soumis de demande de service.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button onClick={() => navigate('/electricite')}>
                    Électricité
                  </Button>
                  <Button onClick={() => navigate('/fluides')}>
                    Fluides
                  </Button>
                  <Button onClick={() => navigate('/genie-civil')}>
                    Génie Civil
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredData.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardHeader className="bg-gradient-service">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl mb-2">
                          {item.contenu.service}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            {item.departements.nom}
                          </Badge>
                          <span className="text-sm text-muted-foreground flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(item.created_at).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <User className="w-5 h-5 text-primary mr-3 mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Nom</p>
                            <p className="font-medium">{item.contenu.name}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Mail className="w-5 h-5 text-primary mr-3 mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium">{item.contenu.email}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Phone className="w-5 h-5 text-primary mr-3 mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Téléphone</p>
                            <p className="font-medium">{item.contenu.phone}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <MapPin className="w-5 h-5 text-primary mr-3 mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Adresse</p>
                            <p className="font-medium">{item.contenu.address}</p>
                          </div>
                        </div>
                        {item.contenu.budget && (
                          <div className="flex items-start">
                            <Banknote className="w-5 h-5 text-primary mr-3 mt-0.5" />
                            <div>
                              <p className="text-sm text-muted-foreground">Budget</p>
                              <p className="font-medium">{item.contenu.budget}</p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-start">
                          <FileText className="w-5 h-5 text-primary mr-3 mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Description</p>
                            <p className="font-medium">{item.contenu.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default DataView;
