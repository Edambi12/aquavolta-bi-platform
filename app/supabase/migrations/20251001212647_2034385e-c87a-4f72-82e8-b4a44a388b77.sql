-- Créer la table departements
CREATE TABLE public.departements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insérer les départements par défaut
INSERT INTO public.departements (nom) VALUES 
  ('Électricité'),
  ('Fluide'),
  ('Génie Civil')
ON CONFLICT (nom) DO NOTHING;

-- Créer la table donnees_utilisateur
CREATE TABLE public.donnees_utilisateur (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  departement_id UUID NOT NULL REFERENCES public.departements(id) ON DELETE CASCADE,
  utilisateur_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contenu JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Activer Row Level Security
ALTER TABLE public.donnees_utilisateur ENABLE ROW LEVEL SECURITY;

-- Policies pour donnees_utilisateur
CREATE POLICY "Users can insert their own data"
ON public.donnees_utilisateur
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = utilisateur_id);

CREATE POLICY "Users can select their own data"
ON public.donnees_utilisateur
FOR SELECT
TO authenticated
USING (auth.uid() = utilisateur_id);

CREATE POLICY "Users can update their own data"
ON public.donnees_utilisateur
FOR UPDATE
TO authenticated
USING (auth.uid() = utilisateur_id);

CREATE POLICY "Users can delete their own data"
ON public.donnees_utilisateur
FOR DELETE
TO authenticated
USING (auth.uid() = utilisateur_id);

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_donnees_utilisateur_updated_at
BEFORE UPDATE ON public.donnees_utilisateur
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index pour améliorer les performances
CREATE INDEX idx_donnees_utilisateur_user_id ON public.donnees_utilisateur(utilisateur_id);
CREATE INDEX idx_donnees_utilisateur_departement_id ON public.donnees_utilisateur(departement_id);

-- Permettre la lecture publique de la table departements (pour les listes déroulantes)
ALTER TABLE public.departements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view departements"
ON public.departements
FOR SELECT
TO authenticated
USING (true);