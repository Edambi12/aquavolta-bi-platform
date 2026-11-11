import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

/**
 * Composant de test de connexion Supabase
 * Démontre comment utiliser le client Supabase existant
 */
const SupabaseConnectionTest = () => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const { toast } = useToast();

  const testConnection = async () => {
    setTesting(true);
    setResult(null);

    try {
      // Test 1: Vérifier la connexion en interrogeant la table profiles
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);

      if (error) {
        // Si la table n'existe pas ou autre erreur
        setResult({
          success: false,
          message: `Erreur: ${error.message}`
        });
        toast({
          variant: 'destructive',
          title: 'Erreur de connexion',
          description: error.message,
        });
      } else {
        // Connexion réussie
        setResult({
          success: true,
          message: 'Connexion à Supabase réussie ! ✓'
        });
        toast({
          title: 'Connexion réussie',
          description: 'Le client Supabase fonctionne correctement.',
        });
      }

      // Test 2: Vérifier l'authentification
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Session active:', session ? 'Oui' : 'Non');
      
      // Test 3: Afficher les infos de configuration (sans exposer les clés)
      console.log('Configuration Supabase:', {
        url: import.meta.env.VITE_SUPABASE_URL,
        hasKey: !!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        isAuthenticated: !!session
      });

    } catch (err: any) {
      setResult({
        success: false,
        message: `Erreur inattendue: ${err.message}`
      });
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: err.message,
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Test de connexion Supabase</CardTitle>
        <CardDescription>
          Vérifier que le client Supabase fonctionne correctement
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testConnection} 
          disabled={testing}
          className="w-full"
        >
          {testing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Test en cours...
            </>
          ) : (
            'Tester la connexion'
          )}
        </Button>

        {result && (
          <div className={`flex items-start gap-3 p-4 rounded-lg ${
            result.success 
              ? 'bg-green-50 dark:bg-green-950 text-green-900 dark:text-green-100' 
              : 'bg-red-50 dark:bg-red-950 text-red-900 dark:text-red-100'
          }`}>
            {result.success ? (
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            )}
            <p className="text-sm">{result.message}</p>
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-2 pt-4 border-t">
          <p><strong>Configuration actuelle :</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Client: <code>src/integrations/supabase/client.ts</code></li>
            <li>URL: <code>{import.meta.env.VITE_SUPABASE_URL?.substring(0, 30)}...</code></li>
            <li>Clé publique: ✓ Configurée</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupabaseConnectionTest;
