import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, UserCircle, Zap, Droplets, Building, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import aquavoltaLogo from '@/assets/aquavolta-logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const { isAuthenticated, signOut, user, loading } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const navItems = [
    { 
      name: 'Électricité', 
      href: '/electricite',
      icon: Zap,
      description: 'Installation & maintenance électrique'
    },
    { 
      name: 'Fluides', 
      href: '/fluides',
      icon: Droplets,
      description: 'Plomberie, CVC & traitement'
    },
    { 
      name: 'Génie Civil', 
      href: '/genie-civil',
      icon: Building,
      description: 'Construction & rénovation'
    }
  ];

  return (
    <header className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <img src={aquavoltaLogo} alt="AQUAVOLTA" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">AQUAVOLTA</h1>
              <p className="text-sm text-primary font-medium">SOLUTIONS</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="group relative flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
              >
                <item.icon className="w-4 h-4" />
                <span className="font-medium">{item.name}</span>
                <div className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}

            {/* Desktop Auth Section */}
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <Dialog open={isDashboardOpen} onOpenChange={setIsDashboardOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Dashboard
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[98vw] w-full h-[95vh]">
                  <DialogHeader>
                    <DialogTitle>Dashboard Power BI</DialogTitle>
                  </DialogHeader>
                  <div className="w-full h-[calc(95vh-80px)]">
                    <iframe 
                      title="visualisation" 
                      className="w-full h-full rounded-lg" 
                      src="https://app.powerbi.com/view?r=eyJrIjoiZWNjNjk5YWQtYThlOC00YmQwLWExNWYtZGQxMzkzMDEzOTYyIiwidCI6ImRiZDY2NjRkLTRlYjktNDZlYi05OWQ4LTVjNDNiYTE1M2M2MSIsImMiOjl9" 
                      frameBorder="0" 
                      allowFullScreen={true}
                    />
                  </div>
                </DialogContent>
              </Dialog>

              {!loading && (
                <>
                  {isAuthenticated ? (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <UserCircle className="w-4 h-4" />
                        <span>{user?.email}</span>
                      </div>
                      <Button
                        onClick={handleSignOut}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => navigate('/auth')}
                      className="flex items-center gap-2"
                    >
                      <UserCircle className="w-4 h-4" />
                      Connexion
                    </Button>
                  )}
                </>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-foreground hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border shadow-lg animate-fade-in">
            <nav className="container mx-auto px-4 py-6 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium text-foreground">{item.name}</div>
                    <div className="text-sm text-muted-foreground">{item.description}</div>
                  </div>
                </Link>
              ))}

              {/* Mobile Auth Buttons */}
              <div className="pt-4 border-t border-border/50">
                <Dialog open={isDashboardOpen} onOpenChange={setIsDashboardOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2 mb-3"
                    >
                      <BarChart3 className="w-4 h-4" />
                      Dashboard
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[98vw] w-full h-[95vh]">
                    <DialogHeader>
                      <DialogTitle>Dashboard Power BI</DialogTitle>
                    </DialogHeader>
                    <div className="w-full h-[calc(95vh-80px)]">
                      <iframe 
                        title="visualisation" 
                        className="w-full h-full rounded-lg" 
                        src="https://app.powerbi.com/view?r=eyJrIjoiZWNjNjk5YWQtYThlOC00YmQwLWExNWYtZGQxMzkzMDEzOTYyIiwidCI6ImRiZDY2NjRkLTRlYjktNDZlYi05OWQ4LTVjNDNiYTE1M2M2MSIsImMiOjl9" 
                        frameBorder="0" 
                        allowFullScreen={true}
                      />
                    </div>
                  </DialogContent>
                </Dialog>

                {!loading && (
                  <>
                    {isAuthenticated ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground px-4">
                          <UserCircle className="w-4 h-4" />
                          <span>{user?.email}</span>
                        </div>
                        <Button
                          onClick={handleSignOut}
                          variant="outline"
                          className="w-full flex items-center justify-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Déconnexion
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => {
                          navigate('/auth');
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2"
                      >
                        <UserCircle className="w-4 h-4" />
                        Connexion
                      </Button>
                    )}
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
