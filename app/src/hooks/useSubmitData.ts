import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuthContext } from '@/contexts/AuthContext';

interface SubmitDataParams {
  departement: string;
  data: Record<string, any>;
}

export const useSubmitData = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuthContext();

  const submitData = async ({ departement, data }: SubmitDataParams) => {
    if (!isAuthenticated || !user) {
      toast({
        variant: 'destructive',
        title: 'Authentification requise',
        description: 'Vous devez être connecté pour soumettre une demande.',
      });
      return { success: false, error: 'Not authenticated' };
    }

    setIsSubmitting(true);

    try {
      // 1. Récupérer l'ID du département
      const { data: departementData, error: departementError } = await supabase
        .from('departements')
        .select('id')
        .eq('nom', departement)
        .single();

      if (departementError) {
        throw new Error(`Erreur lors de la récupération du département: ${departementError.message}`);
      }

      if (!departementData) {
        throw new Error('Département non trouvé');
      }

      // 2. Insérer les données utilisateur
      const { error: insertError } = await supabase
        .from('donnees_utilisateur')
        .insert({
          departement_id: departementData.id,
          utilisateur_id: user.id,
          contenu: data,
        });

      if (insertError) {
        throw new Error(`Erreur lors de l'enregistrement: ${insertError.message}`);
      }

      toast({
        title: 'Demande envoyée avec succès !',
        description: 'Nous vous recontacterons sous 24h.',
      });

      return { success: true };
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue lors de l\'envoi de la demande.',
      });
      return { success: false, error: error.message };
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitData, isSubmitting };
};
