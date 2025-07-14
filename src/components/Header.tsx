import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Search, Menu, MapPin, User } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const navItems = [
    { name: "Anwälte", href: "/anwaelte" },
    { name: "Kanzleien", href: "/kanzleien" },
    { name: "Rechtstipps", href: "/rechtstipps" },
    { name: "Rechtsprodukte", href: "/rechtsprodukte", divider: true },
  ];

  return (
    <div className="bg-navbar-bg border-b border-divider">
      <header className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="block">
              <img 
                src="https://www.anwalt.de/img/anwalt.de-logo.svg" 
                alt="Anwalt suchen und finden bei anwalt.de"
                width={185}
                height={35}
                className="h-8 w-auto"
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item, index) => (
              <div key={item.name} className="flex items-center">
                {item.divider && (
                  <div className="h-4 border-l border-divider mx-3" />
                )}
                <a 
                  href={item.href}
                  className="text-text-dark hover:text-primary font-semibold transition-colors"
                >
                  {item.name}
                </a>
              </div>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <a 
              href="/mitmachen" 
              className="text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              Sie sind Anwalt?
            </a>
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
              Einloggen
            </Button>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="border-primary text-primary"
            >
              <Search className="h-4 w-4" />
            </Button>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <div className="flex flex-col space-y-4 py-4">
                  <div className="text-center border-b border-divider pb-4">
                    <img 
                      src="https://www.anwalt.de/img/anwalt.de-logo.svg" 
                      alt="anwalt.de"
                      width={185}
                      height={35}
                      className="h-8 w-auto mx-auto"
                    />
                  </div>
                  
                  <Button variant="outline" className="justify-start">
                    <User className="h-4 w-4 mr-2" />
                    Einloggen
                  </Button>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-text-dark">Anwalts- und Kanzleisuche</h3>
                    <a href="/anwaelte" className="block py-2 text-text-muted hover:text-primary">
                      Anwälte suchen und finden
                    </a>
                    <a href="/kanzleien" className="block py-2 text-text-muted hover:text-primary">
                      Kanzleien suchen und finden
                    </a>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-text-dark">Rund ums Recht</h3>
                    <a href="/rechtstipps" className="block py-2 text-text-muted hover:text-primary">
                      Neueste Rechtstipps
                    </a>
                    <a href="/ratgeber" className="block py-2 text-text-muted hover:text-primary">
                      anwalt.de-Ratgeber
                    </a>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-text-dark">Rechtsprodukte</h3>
                    <a href="/rechtsprodukte" className="block py-2 text-text-muted hover:text-primary">
                      5 Minuten mit einem Anwalt
                    </a>
                    <a href="/kurzberatung" className="block py-2 text-text-muted hover:text-primary">
                      Kurzberatung bis zu 30 Minuten
                    </a>
                  </div>

                  <div className="space-y-2 border-t border-divider pt-4">
                    <a href="/mitmachen" className="block py-2 text-primary font-semibold">
                      Mitmachen bei anwalt.de
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search Form */}
        {mobileSearchOpen && (
          <div className="mt-4 md:hidden border-t border-divider pt-4">
            <div className="space-y-3">
              <div className="flex space-x-2">
                <Button 
                  variant={mobileSearchOpen ? "default" : "ghost"}
                  size="sm"
                  className="text-sm"
                >
                  Anwälte
                </Button>
                <Button variant="ghost" size="sm" className="text-sm">
                  Kanzleien
                </Button>
                <Button variant="ghost" size="sm" className="text-sm">
                  Rechtstipps
                </Button>
              </div>
              
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Rechtsthema / Name"
                    className="pl-10"
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="PLZ / Ort"
                    className="pl-10"
                  />
                </div>
                <Button type="submit" className="px-6">
                  Suchen
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;