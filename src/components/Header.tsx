import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User } from "lucide-react";

const Header = () => {
  const navItems = [
    { name: "Anwälte", href: "/anwaelte" },
    { name: "Kanzleien", href: "/kanzleien" },
    { name: "Rechtstipps", href: "/rechtstipps" },
    { name: "Rechtsprodukte", href: "/rechtsprodukte", divider: true },
  ];

  return (
    <div>
      {/* Orange Banner */}
      <div className="bg-orange-banner text-white py-2">
        <div className="container mx-auto px-4 text-center">
          <a href="/mitmachen" className="text-white hover:underline text-base font-medium">
            Als Anwalt noch nicht auf anwalt.de? Jetzt mitmachen!
          </a>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="/" className="block">
                <img 
                  src="https://www.anwalt.de/img/anwalt.de-logo.svg" 
                  alt="ANWALT.DE"
                  width={185}
                  height={35}
                   className="h-9 w-auto"
                />
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <div key={item.name} className="flex items-center">
                  {item.divider && (
                    <div className="h-6 w-px bg-gray-300 mx-4" />
                  )}
                  <a 
                    href={item.href}
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-lg"
                  >
                    {item.name}
                  </a>
                </div>
              ))}
            </div>

            {/* Desktop Right Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <a 
                href="/mitmachen" 
                className="text-orange-600 hover:text-orange-700 font-medium transition-colors text-lg"
              >
                Sie sind Anwalt?
              </a>
              <Button variant="ghost" size="sm">
                <Menu className="icon-enhanced" />
              </Button>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="icon-enhanced" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col py-6">
                    <div className="border-b pb-4 mb-4">
                      <img 
                        src="https://www.anwalt.de/img/anwalt.de-logo.svg" 
                        alt="ANWALT.DE"
                        width={185}
                        height={35}
                        className="h-9 w-auto"
                      />
                    </div>
                    
                    <div className="space-y-4">
                      {navItems.map((item) => (
                        <a 
                          key={item.name}
                          href={item.href}
                          className="block py-2 text-gray-700 hover:text-blue-600 font-medium text-lg"
                        >
                          {item.name}
                        </a>
                      ))}
                      
                      <div className="border-t pt-4 mt-4">
                        <a 
                          href="/mitmachen" 
                          className="block py-2 text-orange-600 font-medium text-lg"
                        >
                          Sie sind Anwalt?
                        </a>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;