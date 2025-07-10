import { Link, useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Mountain, User, LogOut } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/AuthContext';
import { useState, useRef, useEffect } from "react";
import { useScroll } from '@/context/ScrollContext';

const navItems = [
  { label: 'Features', href: '/#features', isHash: true },
  { label: 'How it Works', href: '/#how-it-works', isHash: true },
  { label: 'Destinations', href: '/#destinations', isHash: true },
  { label: 'Business', href: '/business', isHash: false },
  // { label: 'Blog', href: '/blog', isHash: false },
];

export default function Header() {
  const isMobile = useIsMobile();
  const { isAuthenticated, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { scrollToTop } = useScroll();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate('/', { replace: true });
    scrollToTop();
  };

  const NavLink = ({ item }) => {
    if (item.isHash) {
      return (
        <HashLink
          smooth
          to={item.href}
          className="text-sm font-medium hover:text-primary"
        >
          {item.label}
        </HashLink>
      );
    }
    return (
      <Link
        to={item.href}
        className="text-sm font-medium hover:text-primary"
      >
        {item.label}
      </Link>
    );
  };

  const DesktopNav = () => (
    <nav className="hidden md:flex gap-6 items-center">
      {navItems.map(item => (
        <NavLink key={item.label} item={item} />
      ))}

      {!isAuthenticated ? (
        <>
          <Link to="/auth/signin"><Button variant="ghost" size="sm">Sign In</Button></Link>
          <Link to="/auth/signup">
            <Button variant="default" size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Sign Up
            </Button>
          </Link>
        </>
      ) : (
        <>
          {/* <Link to="/create-trip" className="text-sm font-medium hover:text-primary">
            Create Trip
          </Link>
          <Link to="/dashboard"><Button variant="ghost" size="sm">Dashboard</Button></Link>
          <Link to="/features"><Button variant="ghost" size="sm">Your Trips</Button></Link> */}
          <div className="relative" ref={dropdownRef}>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <User className="h-4 w-4" /> Account
            </Button>
            <ul className={`absolute right-0 mt-2 w-40 bg-card shadow-lg rounded border ${
              isDropdownOpen ? 'block' : 'hidden'
            }`}>
              <li>
                <Link
                  to="/account"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-accent/10"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <User className="h-4 w-4" /> Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-accent/10"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </li>
            </ul>
          </div>
        </>
      )}
    </nav>
  );

  const MobileNav = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <div className="grid gap-4 p-4">
          <Link to="/" className="flex items-center gap-2" onClick={handleLogoClick}>
            <Mountain className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg text-primary">TripMate</span>
          </Link>
          {navItems.map(item => (
            <NavLink key={item.label} item={item} />
          ))}

          {!isAuthenticated ? (
            <>
              <Link to="/auth/signin"><Button variant="outline" className="w-full">Sign In</Button></Link>
              <Link to="/auth/signup">
                <Button variant="default" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  Sign Up
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/create-trip" className="text-sm font-medium hover:text-primary">
                Create Trip
              </Link>
              <Link to="/dashboard"><Button variant="outline" className="w-full">Dashboard</Button></Link>
              <Link to="/features"><Button variant="outline" className="w-full">Premium</Button></Link>
              <Link to="/account">
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <User className="h-4 w-4" /> Account
                </Button>
              </Link>
              <Button variant="outline" className="w-full flex items-center gap-2" onClick={logout}>
                <LogOut className="h-4 w-4" /> Sign Out
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2" onClick={handleLogoClick}>
          <Mountain className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg text-primary">TripMate</span>
        </Link>
        {isMobile === undefined ? null : isMobile ? <MobileNav /> : <DesktopNav />}
      </div>
    </header>
  );
}
