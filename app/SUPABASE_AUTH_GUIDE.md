# 🔐 Guide d'authentification Supabase - AQUAVOLTA Solutions

## ✅ État de l'implémentation

**Toutes les fonctionnalités d'authentification sont déjà implémentées et fonctionnelles !**

### Architecture mise en place

#### 1. Client Supabase (`src/integrations/supabase/client.ts`)
- ✅ **Fichier auto-généré** par Lovable Cloud
- ✅ Configuré avec les variables d'environnement automatiques
- ✅ Session persistence activée (localStorage)
- ✅ Auto-refresh des tokens activé
- ⚠️ **NE JAMAIS MODIFIER CE FICHIER** - il est géré automatiquement

#### 2. Variables d'environnement (`.env`)
```env
# ✅ Gérées automatiquement par Lovable Cloud
VITE_SUPABASE_URL=https://sjxowtqogawfdwbpxbgk.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGci...
```
⚠️ **Ces variables sont automatiques - pas besoin de les configurer manuellement**

#### 3. Hook d'authentification (`src/hooks/useAuth.tsx`)
```typescript
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listener pour les changements d'état
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Vérification de la session existante
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, session, loading, signOut, isAuthenticated: !!user };
};
```

#### 4. Contexte d'authentification (`src/contexts/AuthContext.tsx`)
```typescript
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
```

#### 5. Route protégée (`src/components/ProtectedRoute.tsx`)
```typescript
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};
```

#### 6. Page d'authentification (`src/pages/AuthPage.tsx`)
**Fonctionnalités :**
- ✅ Inscription avec email/password
- ✅ Connexion avec email/password
- ✅ Connexion sociale (Google, GitHub)
- ✅ Validation des champs en temps réel
- ✅ Gestion des erreurs avec messages clairs
- ✅ Indicateur de force du mot de passe
- ✅ Confirmation du mot de passe
- ✅ Redirection automatique après connexion
- ✅ Collecte des données profil :
  - Prénom et nom
  - Date de naissance
  - Type de client (local/étranger)
  - Nom de société
  - Pays
  - Monnaie de paiement

**Exemple d'utilisation :**
```typescript
const handleAuth = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    if (!isLogin) {
      // Inscription
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: firstName,
            last_name: lastName,
            birth_date: birthDate,
            client_type: clientType,
            company_name: companyName,
            country: country,
            payment_currency: finalCurrency
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Email de vérification envoyé !",
        description: "Veuillez vérifier votre boîte mail.",
      });
    } else {
      // Connexion
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Connexion réussie !",
        description: "Bienvenue sur AQUAVOLTA Solutions.",
      });
      
      navigate('/');
    }
  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Erreur d'authentification",
      description: error.message,
    });
  }
};
```

#### 7. Dashboard protégé (`src/pages/Dashboard.tsx`)
**Page de démonstration qui montre :**
- ✅ Utilisation de `ProtectedRoute`
- ✅ Récupération du profil utilisateur depuis Supabase
- ✅ Affichage des données personnelles et professionnelles
- ✅ Bouton de déconnexion
- ✅ Gestion du loading
- ✅ Gestion des erreurs

#### 8. Header avec authentification (`src/components/Header.tsx`)
**Fonctionnalités :**
- ✅ Affichage conditionnel selon l'état d'authentification
- ✅ Bouton "Connexion" pour utilisateurs non connectés
- ✅ Email de l'utilisateur + bouton "Déconnexion" pour utilisateurs connectés
- ✅ Version desktop et mobile
- ✅ Navigation vers `/auth` et `/dashboard`

## 🎯 Routes disponibles

| Route | Protection | Description |
|-------|-----------|-------------|
| `/` | ❌ Publique | Page d'accueil |
| `/auth` | ❌ Publique | Connexion/Inscription |
| `/electricite` | ❌ Publique | Page Électricité |
| `/fluides` | ❌ Publique | Page Fluides |
| `/genie-civil` | ❌ Publique | Page Génie Civil |
| `/dashboard` | ✅ Protégée | Tableau de bord utilisateur |

## 🗄️ Base de données

### Table `profiles`
```sql
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  birth_date date NOT NULL,
  client_type text NOT NULL CHECK (client_type IN ('local', 'étranger')),
  company_name text NOT NULL,
  country text NOT NULL,
  payment_currency text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

### Politiques RLS (Row Level Security)
```sql
-- Les utilisateurs peuvent voir leur propre profil
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Les utilisateurs peuvent insérer leur propre profil
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Les utilisateurs peuvent mettre à jour leur propre profil
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);
```

### Trigger de création automatique
```sql
CREATE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id, email, first_name, last_name, birth_date,
    client_type, company_name, country, payment_currency
  )
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    (new.raw_user_meta_data->>'birth_date')::date,
    new.raw_user_meta_data->>'client_type',
    new.raw_user_meta_data->>'company_name',
    new.raw_user_meta_data->>'country',
    new.raw_user_meta_data->>'payment_currency'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 🔒 Sécurité

### ✅ Bonnes pratiques implémentées
1. **Clés publiques uniquement** - Seule la clé `anon` est exposée côté client
2. **Row Level Security (RLS)** - Activé sur toutes les tables
3. **Validation côté client** - Vérification des champs avant soumission
4. **Gestion des erreurs** - Messages d'erreur clairs et traduits
5. **Session sécurisée** - Tokens stockés dans localStorage avec auto-refresh
6. **Protection CSRF** - Gérée automatiquement par Supabase
7. **emailRedirectTo** - Toujours défini pour éviter les problèmes de redirection
8. **Pas de logs sensibles** - Aucune donnée sensible loguée en console

### ⚠️ Points importants
- Les mots de passe ne sont JAMAIS stockés en clair
- Les tokens sont gérés automatiquement par Supabase
- Les politiques RLS empêchent l'accès non autorisé aux données
- Le trigger crée automatiquement le profil lors de l'inscription

## 📱 Expérience utilisateur

### Flux d'inscription
1. L'utilisateur clique sur "Connexion" dans le header
2. Il choisit "Créer un compte"
3. Il remplit le formulaire d'inscription :
   - Email et mot de passe
   - Informations personnelles (nom, prénom, date de naissance)
   - Informations professionnelles (type client, société, pays, monnaie)
4. Validation en temps réel (force du mot de passe, correspondance)
5. Soumission du formulaire
6. Email de vérification envoyé
7. Après vérification, redirection automatique

### Flux de connexion
1. L'utilisateur clique sur "Connexion"
2. Il entre son email et mot de passe
3. OU il choisit Google/GitHub
4. Connexion réussie → Redirection vers la page d'origine
5. Le header affiche son email et un bouton "Déconnexion"
6. Il peut accéder à son `/dashboard`

### Flux de déconnexion
1. L'utilisateur clique sur "Déconnexion"
2. Session effacée
3. Redirection vers la page d'accueil
4. Toast de confirmation

## 🚀 Comment utiliser

### Protéger une nouvelle route
```typescript
// Dans App.tsx
<Route 
  path="/ma-page-protegee" 
  element={
    <ProtectedRoute>
      <MaPageProtegee />
    </ProtectedRoute>
  } 
/>
```

### Accéder aux données utilisateur dans un composant
```typescript
import { useAuthContext } from '@/contexts/AuthContext';

const MonComposant = () => {
  const { user, isAuthenticated, loading, signOut } = useAuthContext();

  if (loading) return <div>Chargement...</div>;
  
  if (!isAuthenticated) {
    return <div>Veuillez vous connecter</div>;
  }

  return (
    <div>
      <p>Email: {user?.email}</p>
      <button onClick={signOut}>Déconnexion</button>
    </div>
  );
};
```

### Récupérer le profil utilisateur
```typescript
const fetchProfile = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Erreur:', error);
    return;
  }

  console.log('Profil:', data);
};
```

## 🧪 Test de l'authentification

1. **Tester l'inscription :**
   - Aller sur `/auth`
   - Cliquer sur "Créer un compte"
   - Remplir tous les champs
   - Vérifier l'email de confirmation
   - Cliquer sur le lien de vérification

2. **Tester la connexion :**
   - Aller sur `/auth`
   - Entrer email et mot de passe
   - Vérifier la redirection vers `/`
   - Vérifier que le header affiche l'email

3. **Tester la protection de route :**
   - Se déconnecter
   - Essayer d'accéder à `/dashboard`
   - Vérifier la redirection vers `/auth`

4. **Tester la connexion sociale :**
   - Cliquer sur "Continuer avec Google"
   - Autoriser l'application
   - Vérifier la redirection et la connexion

## 📝 Notes importantes

### ⚠️ Ce projet utilise React + Vite, PAS Next.js
- Les variables d'environnement utilisent `VITE_` comme préfixe
- Pas de `pages/api` - utilisez les Edge Functions de Supabase si besoin
- Pas de SSR - c'est une application cliente (SPA)

### ✅ Tout est déjà configuré
- Pas besoin de créer manuellement le client Supabase
- Pas besoin de configurer les variables d'environnement
- Pas besoin de configurer l'authentification Supabase
- Tout est géré par Lovable Cloud automatiquement

### 🎉 Prêt à l'emploi
L'authentification est **complète et fonctionnelle**. Vous pouvez :
- Créer de nouveaux utilisateurs
- Les connecter/déconnecter
- Protéger des routes
- Accéder aux données utilisateur
- Gérer les profils

## 🆘 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs de la console
2. Vérifiez que vous êtes bien sur la bonne route
3. Vérifiez l'état d'authentification avec `useAuthContext()`
4. Consultez la documentation Supabase : https://supabase.com/docs

## 🔗 Ressources
- [Documentation Supabase Auth](https://supabase.com/docs/guides/auth)
- [Documentation Lovable Cloud](https://docs.lovable.dev/features/cloud)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
