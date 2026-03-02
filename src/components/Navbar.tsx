import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Heart, ShoppingCart, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CartSheet } from "./CartSheet";

const navLinks = [
  { label: "Shop", path: "/shop" },
  { label: "Instruments", path: "/instruments" },
  { label: "Brands", path: "/brands" },
  { label: "Learn", path: "/learn" },
  { label: "Deals", path: "/deals" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/ArasSounds.jpg"
            alt="ARASOUNDS"
            className="h-8 w-auto object-contain brightness-0 invert"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium uppercase tracking-wide transition-colors hover:text-primary ${location.pathname === link.path ? "text-primary" : "text-muted-foreground"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-3 md:flex">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const query = formData.get("search") as string;
                if (query) {
                  window.location.href = `/shop?q=${encodeURIComponent(query)}`;
                }
              }}
              className="relative flex items-center"
            >
              <Input
                name="search"
                type="search"
                placeholder="Search..."
                className="h-9 w-40 bg-secondary pr-8 transition-all focus:w-60"
              />
              <button type="submit" className="absolute right-2 text-muted-foreground transition-colors hover:text-foreground" aria-label="Search">
                <Search className="h-4 w-4" />
              </button>
            </form>
            <button className="p-2 text-muted-foreground transition-colors hover:text-foreground" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
            </button>
            <button className="p-2 text-muted-foreground transition-colors hover:text-foreground" aria-label="Account">
              <User className="h-5 w-5" />
            </button>
          </div>

          <CartSheet />

          {/* Desktop Shop Button */}
          <Button asChild size="sm" className="ml-2 hidden font-display uppercase tracking-wider md:inline-flex">
            <Link to="/shop">Shop Instruments</Link>
          </Button>

          {/* Mobile toggle */}
          <button className="p-2 md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="container flex flex-col gap-3 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`text-sm font-medium uppercase tracking-wide transition-colors hover:text-primary ${location.pathname === link.path ? "text-primary" : "text-muted-foreground"
                  }`}
              >
                {link.label}
              </Link>
            ))}
            <Button asChild size="sm" className="mt-2 w-full font-display uppercase tracking-wider">
              <Link to="/shop" onClick={() => setMobileOpen(false)}>Shop Instruments</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
