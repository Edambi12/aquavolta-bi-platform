import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, UserCircle, Mail, Calendar, Building, Globe, CreditCard, LogOut, ArrowLeft, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  email: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  client_type: string;
  company_name: string;
  country: string;
  payment_currency: string;
  created_at: string;
}

const Dashboard = () => {
  const { user, signOut, loading: authLoading } = useAuthContext();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger votre profil.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchProfile();
    }
  }, [user, authLoading, toast]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
      navigate('/');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de se déconnecter",
      });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="hover:bg-background/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Button>

          <Button
            variant="outline"
            onClick={handleSignOut}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </Button>
        </div>

        <Card className="backdrop-blur-sm bg-card/95 border-border/50 shadow-xl">
          <CardHeader className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto mb-2">
              <UserCircle className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl">Tableau de bord</CardTitle>
            <CardDescription className="text-lg">
              Bienvenue sur votre espace personnel
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Informations personnelles */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Informations personnelles
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-background/50 border border-border/50">
                  <div className="flex items-center gap-3 text-muted-foreground mb-1">
                    <UserCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Nom complet</span>
                  </div>
                  <p className="text-foreground font-semibold">
                    {profile?.first_name} {profile?.last_name}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-background/50 border border-border/50">
                  <div className="flex items-center gap-3 text-muted-foreground mb-1">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm font-medium">Email</span>
                  </div>
                  <p className="text-foreground font-semibold break-all">
                    {profile?.email}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-background/50 border border-border/50">
                  <div className="flex items-center gap-3 text-muted-foreground mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">Date de naissance</span>
                  </div>
                  <p className="text-foreground font-semibold">
                    {profile?.birth_date && new Date(profile.birth_date).toLocaleDateString('fr-FR')}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-background/50 border border-border/50">
                  <div className="flex items-center gap-3 text-muted-foreground mb-1">
                    <Building className="w-4 h-4" />
                    <span className="text-sm font-medium">Type de client</span>
                  </div>
                  <p className="text-foreground font-semibold capitalize">
                    {profile?.client_type}
                  </p>
                </div>
              </div>
            </div>

            {/* Informations professionnelles */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Informations professionnelles
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-background/50 border border-border/50">
                  <div className="flex items-center gap-3 text-muted-foreground mb-1">
                    <Building className="w-4 h-4" />
                    <span className="text-sm font-medium">Société</span>
                  </div>
                  <p className="text-foreground font-semibold">
                    {profile?.company_name}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-background/50 border border-border/50">
                  <div className="flex items-center gap-3 text-muted-foreground mb-1">
                    <Globe className="w-4 h-4" />
                    <span className="text-sm font-medium">Pays</span>
                  </div>
                  <p className="text-foreground font-semibold">
                    {profile?.country}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-background/50 border border-border/50 md:col-span-2">
                  <div className="flex items-center gap-3 text-muted-foreground mb-1">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-sm font-medium">Monnaie de paiement</span>
                  </div>
                  <p className="text-foreground font-semibold">
                    {profile?.payment_currency}
                  </p>
                </div>
              </div>
            </div>

            {/* Informations du compte */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Informations du compte
              </h3>

              <div className="p-4 rounded-xl bg-background/50 border border-border/50">
                <div className="flex items-center gap-3 text-muted-foreground mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">Membre depuis</span>
                </div>
                <p className="text-foreground font-semibold">
                  {profile?.created_at && new Date(profile.created_at).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="pt-4 border-t border-border/50">
              <h3 className="text-lg font-semibold text-primary flex items-center gap-2 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Actions rapides
              </h3>
              <Button 
                onClick={() => navigate('/data-view')}
                className="w-full flex items-center justify-center gap-2"
                size="lg"
              >
                <Database className="w-5 h-5" />
                Voir mes demandes de services
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
