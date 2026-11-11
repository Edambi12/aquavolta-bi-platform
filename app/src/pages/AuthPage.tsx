import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuthContext } from '@/contexts/AuthContext';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, Lock, User, Calendar, Building, Globe, 
  CreditCard, Shield, UserCircle, UserPlus, AlertCircle, ArrowLeft
} from 'lucide-react';
import aquavoltaLogo from '@/assets/aquavolta-logo.png';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [clientType, setClientType] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [country, setCountry] = useState('');
  const [paymentCurrency, setPaymentCurrency] = useState('');
  const [customCurrency, setCustomCurrency] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, loading: authLoading } = useAuthContext();

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!isLogin) {
        // Validation pour l'inscription
        if (password !== confirmPassword) {
          throw new Error('Les mots de passe ne correspondent pas.');
        }

        const finalCurrency = paymentCurrency === 'autre' ? customCurrency : paymentCurrency;
        
        if (!firstName || !lastName || !birthDate || !companyName || !country || !finalCurrency) {
          throw new Error('Veuillez remplir tous les champs obligatoires.');
        }

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
        
        if (error) {
          if (error.message.includes('already registered')) {
            throw new Error('Cet email est déjà utilisé. Veuillez vous connecter.');
          }
          throw error;
        }
        
        toast({
          title: "Email de vérification envoyé !",
          description: "Veuillez vérifier votre boîte mail et cliquer sur le lien de confirmation.",
        });
        
        // Clear form
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setFirstName('');
        setLastName('');
        setBirthDate('');
        setClientType('');
        setCompanyName('');
        setCountry('');
        setPaymentCurrency('');
        setCustomCurrency('');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            throw new Error('Email ou mot de passe incorrect.');
          }
          if (error.message.includes('Email not confirmed')) {
            throw new Error('Veuillez vérifier votre email avant de continuer.');
          }
          throw error;
        }

        if (data.user && !data.user.email_confirmed_at) {
          await supabase.auth.signOut();
          throw new Error('Veuillez vérifier votre email avant de continuer.');
        }
        
        toast({
          title: "Connexion réussie !",
          description: "Bienvenue sur AQUAVOLTA Solutions.",
        });
        
        // Small delay to ensure auth state updates
        setTimeout(() => {
          navigate('/');
        }, 100);
      }
    } catch (error: any) {
      let errorMessage = error.message || "Une erreur est survenue.";
      
      if (errorMessage.includes('Password should be at least')) {
        errorMessage = 'Le mot de passe doit contenir au moins 6 caractères.';
      }
      
      toast({
        variant: "destructive",
        title: "Erreur d'authentification",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: error.message || "Impossible de se connecter avec ce fournisseur.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4 py-20">
      <div className="w-full max-w-2xl space-y-6 animate-fade-in">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4 hover:bg-background/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l'accueil
        </Button>

        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-2">
            {isLogin ? (
              <UserCircle className="w-8 h-8 text-primary" />
            ) : (
              <UserPlus className="w-8 h-8 text-primary" />
            )}
          </div>
          <h1 className="text-4xl font-bold text-foreground">
            {isLogin ? 'Bon retour' : 'Rejoignez-nous'}
          </h1>
          <p className="text-muted-foreground text-lg">
            {isLogin ? 'Connectez-vous pour accéder à votre espace' : 'Créez votre compte professionnel'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="bg-card rounded-3xl p-8 shadow-xl border border-border/50 backdrop-blur-sm space-y-6">
          {isLogin && (
            <>
              {/* Social Login Buttons */}
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full py-6"
                  onClick={() => handleSocialLogin('google')}
                  disabled={loading}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continuer avec Google
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full py-6"
                  onClick={() => handleSocialLogin('github')}
                  disabled={loading}
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  Continuer avec GitHub
                </Button>
              </div>

              <div className="relative">
                <Separator />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-card px-4 text-sm text-muted-foreground">ou</span>
                </div>
              </div>
            </>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-semibold text-foreground">
              Adresse email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-input bg-background/50 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/60"
                placeholder="votre@email.com"
              />
            </div>
          </div>

          {!isLogin && (
            <>
              {/* Personal Information Section */}
              <div className="space-y-4 pt-4">
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Informations personnelles
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm font-semibold text-foreground">
                      Prénom *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-input bg-background/50 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/60"
                        placeholder="Votre prénom"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-sm font-semibold text-foreground">
                      Nom *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-input bg-background/50 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/60"
                        placeholder="Votre nom"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="birthDate" className="block text-sm font-semibold text-foreground">
                    Date de naissance *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      id="birthDate"
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-input bg-background/50 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Company Information Section */}
              <div className="space-y-4 pt-4">
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Informations professionnelles
                </h3>

                <div className="space-y-2">
                  <label htmlFor="clientType" className="block text-sm font-semibold text-foreground">
                    Type de client *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10 pointer-events-none" />
                    <select
                      id="clientType"
                      value={clientType}
                      onChange={(e) => setClientType(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-input bg-background/50 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Sélectionnez votre type</option>
                      <option value="local">Client Local</option>
                      <option value="étranger">Client Étranger</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="companyName" className="block text-sm font-semibold text-foreground">
                    Nom de la société *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      id="companyName"
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-input bg-background/50 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/60"
                      placeholder="Nom de votre société"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="country" className="block text-sm font-semibold text-foreground">
                    Pays *
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      id="country"
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-input bg-background/50 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/60"
                      placeholder="Tunisie, France, etc."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="paymentCurrency" className="block text-sm font-semibold text-foreground">
                    Monnaie de paiement *
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10 pointer-events-none" />
                    <select
                      id="paymentCurrency"
                      value={paymentCurrency}
                      onChange={(e) => setPaymentCurrency(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-input bg-background/50 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Sélectionnez une monnaie</option>
                      <option value="TND">🇹🇳 Dinar Tunisien (TND)</option>
                      <option value="EUR">🇪🇺 Euro (EUR)</option>
                      <option value="USD">🇺🇸 Dollar Américain (USD)</option>
                      <option value="autre">💱 Autre monnaie</option>
                    </select>
                  </div>
                </div>

                {paymentCurrency === 'autre' && (
                  <div className="space-y-2 animate-fade-in">
                    <label htmlFor="customCurrency" className="block text-sm font-semibold text-foreground">
                      Précisez la monnaie *
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        id="customCurrency"
                        type="text"
                        value={customCurrency}
                        onChange={(e) => setCustomCurrency(e.target.value)}
                        required
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-input bg-background/50 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/60"
                        placeholder="Ex: GBP, CAD, CHF..."
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Security Section */}
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              Sécurité
            </h3>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-foreground">
                Mot de passe *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-input bg-background/50 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/60"
                  placeholder="Minimum 6 caractères"
                />
              </div>
              {!isLogin && password && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  {password.length >= 8 ? '✓ Mot de passe fort' : 'Utilisez au moins 8 caractères pour plus de sécurité'}
                </p>
              )}
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-foreground">
                  Confirmer le mot de passe *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-input bg-background/50 text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/60"
                    placeholder="Confirmez votre mot de passe"
                  />
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Les mots de passe ne correspondent pas
                  </p>
                )}
              </div>
            )}
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg mt-6"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-3 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                <span>Traitement en cours...</span>
              </div>
            ) : (
              <span className="flex items-center justify-center gap-2">
                {isLogin ? (
                  <>
                    <UserCircle className="w-5 h-5" />
                    Se connecter
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Créer mon compte
                  </>
                )}
              </span>
            )}
          </Button>

          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-primary font-medium transition-colors inline-flex items-center gap-2 group"
            >
              {isLogin ? (
                <>
                  Nouveau client ?
                  <span className="text-primary font-semibold group-hover:underline">Créer un compte</span>
                </>
              ) : (
                <>
                  Déjà inscrit ?
                  <span className="text-primary font-semibold group-hover:underline">Se connecter</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
