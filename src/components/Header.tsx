import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
      <div className="bg-orange-banner text-white py-1">
        <div className="container mx-auto px-4 text-center">
          <a href="/mitmachen" className="text-white underline text-base font-medium">
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
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 371.34 70.81" className="h-9 w-auto">
                  <path fill="#e95a0c" d="M103.12,48.56h-17.71l-3.52,9.66h-5.14l15.02-39.66h4.86l15.14,39.66h-5.14l-3.52-9.66Zm-1.56-4.25l-7.26-19.83h-.11l-7.21,19.83h14.58Z"></path>
                  <path fill="#e95a0c" d="M149.93,18.56V58.22h-4.97l-22.23-31.28h-.11v31.28h-4.86V18.56h4.8l22.4,31.61h.11V18.56h4.86Z"></path>
                  <path fill="#e95a0c" d="M208.09,18.56l-12.68,39.66h-4.69l-9.16-32.51h-.06l-9.33,32.51h-4.69l-12.68-39.66h5.19l9.77,31.67h.11l8.94-31.67h5.31l8.94,31.78h.06l9.77-31.78h5.19Z"></path>
                  <path fill="#e95a0c" d="M233.18,48.56h-17.71l-3.52,9.66h-5.14l15.02-39.66h4.86l15.14,39.66h-5.14l-3.52-9.66Zm-1.56-4.25l-7.26-19.83h-.11l-7.21,19.83h14.58Z"></path>
                  <path fill="#e95a0c" d="M247.81,18.56h4.86V53.75h19.66v4.47h-24.52V18.56Z"></path>
                  <path fill="#e95a0c" d="M277.86,23.03h-11.9v-4.47h28.71v4.47h-11.95V58.22h-4.86V23.03Z"></path>
                  <path fill="#385171" d="M293.41,54.37c0-2.2,1.69-3.92,3.92-3.92,2.09,0,3.85,1.72,3.85,3.92s-1.76,3.85-3.85,3.85c-2.23,0-3.92-1.72-3.92-3.85Z"></path>
                  <path fill="#385171" d="M308.75,18.56h11.9c12.57,0,20.56,8.15,20.56,19.88s-7.76,19.77-20.39,19.77h-12.07V18.56Zm11.73,35.24c9.55,0,15.75-6.42,15.75-15.36s-6.26-15.47-15.53-15.47h-7.09v30.83h6.87Z"></path>
                  <path fill="#385171" d="M345.87,18.56h24.3v4.47h-19.38v13.24h15.92v4.47h-15.92v13.01h20.55v4.47h-25.47V18.56Z"></path>
                  <circle fill="#385171" cx="35.41" cy="35.41" r="35.41"></circle>
                  <g>
                    <path fill="#fff" d="M42.65,39.13l6.62-12.98c.19-.38,.73-.38,.92,0l6.62,12.98s0,.02,0,.03h.55c-.67,3.61-3.83,6.35-7.63,6.35s-6.96-2.74-7.63-6.35h.55s0-.02,0-.03Zm11.53,.03l-3.99-8.12c-.19-.38-.74-.38-.92,0l-3.99,8.12h8.91Z"></path>
                    <path fill="#fff" d="M14.44,46.03s0-.02,0-.03l6.62-12.98c.19-.38,.73-.38,.92,0l6.62,12.98s0,.02,0,.03h.55c-.67,3.61-3.83,6.35-7.63,6.35s-6.96-2.74-7.63-6.35h.55Zm11.54,0l-3.99-8.12c-.19-.38-.74-.38-.92,0l-3.99,8.12h8.91Z"></path>
                    <rect fill="#fff" x="18.13" y="24.08" width="33.15" height="3.56" rx=".92" ry=".92" transform="translate(-5.07 8.79) rotate(-13.46)"></rect>
                  </g>
                </svg>
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <div key={item.name} className="flex items-center">
                  {item.divider && (
                    <div className="h-6 w-[2px] mr-8 ml-0" style={{ backgroundColor: '#333333' }} />
                  )}
                  <a 
                    href={item.href}
                    className="hover:text-blue-600 font-medium transition-colors text-lg"
                    style={{ color: '#333333' }}
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
              <div className="flex items-center space-x-1">
                <Menu className="w-8 h-8 cursor-pointer" style={{ color: '#a3a3a3' }} />
                <Avatar className="w-8 h-8">
                  <AvatarFallback style={{ backgroundColor: '#a3a3a3' }}>
                    <User className="w-5 h-5 text-white fill-white" />
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Menu className="w-8 h-8 cursor-pointer" style={{ color: '#a3a3a3' }} />
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col py-6">
                    <div className="border-b pb-4 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 371.34 70.81" className="h-9 w-auto">
                        <path fill="#e95a0c" d="M103.12,48.56h-17.71l-3.52,9.66h-5.14l15.02-39.66h4.86l15.14,39.66h-5.14l-3.52-9.66Zm-1.56-4.25l-7.26-19.83h-.11l-7.21,19.83h14.58Z"></path>
                        <path fill="#e95a0c" d="M149.93,18.56V58.22h-4.97l-22.23-31.28h-.11v31.28h-4.86V18.56h4.8l22.4,31.61h.11V18.56h4.86Z"></path>
                        <path fill="#e95a0c" d="M208.09,18.56l-12.68,39.66h-4.69l-9.16-32.51h-.06l-9.33,32.51h-4.69l-12.68-39.66h5.19l9.77,31.67h.11l8.94-31.67h5.31l8.94,31.78h.06l9.77-31.78h5.19Z"></path>
                        <path fill="#e95a0c" d="M233.18,48.56h-17.71l-3.52,9.66h-5.14l15.02-39.66h4.86l15.14,39.66h-5.14l-3.52-9.66Zm-1.56-4.25l-7.26-19.83h-.11l-7.21,19.83h14.58Z"></path>
                        <path fill="#e95a0c" d="M247.81,18.56h4.86V53.75h19.66v4.47h-24.52V18.56Z"></path>
                        <path fill="#e95a0c" d="M277.86,23.03h-11.9v-4.47h28.71v4.47h-11.95V58.22h-4.86V23.03Z"></path>
                        <path fill="#385171" d="M293.41,54.37c0-2.2,1.69-3.92,3.92-3.92,2.09,0,3.85,1.72,3.85,3.92s-1.76,3.85-3.85,3.85c-2.23,0-3.92-1.72-3.92-3.85Z"></path>
                        <path fill="#385171" d="M308.75,18.56h11.9c12.57,0,20.56,8.15,20.56,19.88s-7.76,19.77-20.39,19.77h-12.07V18.56Zm11.73,35.24c9.55,0,15.75-6.42,15.75-15.36s-6.26-15.47-15.53-15.47h-7.09v30.83h6.87Z"></path>
                        <path fill="#385171" d="M345.87,18.56h24.3v4.47h-19.38v13.24h15.92v4.47h-15.92v13.01h20.55v4.47h-25.47V18.56Z"></path>
                        <circle fill="#385171" cx="35.41" cy="35.41" r="35.41"></circle>
                        <g>
                          <path fill="#fff" d="M42.65,39.13l6.62-12.98c.19-.38,.73-.38,.92,0l6.62,12.98s0,.02,0,.03h.55c-.67,3.61-3.83,6.35-7.63,6.35s-6.96-2.74-7.63-6.35h.55s0-.02,0-.03Zm11.53,.03l-3.99-8.12c-.19-.38-.74-.38-.92,0l-3.99,8.12h8.91Z"></path>
                          <path fill="#fff" d="M14.44,46.03s0-.02,0-.03l6.62-12.98c.19-.38,.73-.38,.92,0l6.62,12.98s0,.02,0,.03h.55c-.67,3.61-3.83,6.35-7.63,6.35s-6.96-2.74-7.63-6.35h.55Zm11.54,0l-3.99-8.12c-.19-.38-.74-.38-.92,0l-3.99,8.12h8.91Z"></path>
                          <rect fill="#fff" x="18.13" y="24.08" width="33.15" height="3.56" rx=".92" ry=".92" transform="translate(-5.07 8.79) rotate(-13.46)"></rect>
                        </g>
                      </svg>
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