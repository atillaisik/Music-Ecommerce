import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Heart, ShoppingCart, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CartSheet } from "./CartSheet";
import { AuthModal } from "./AuthModal";
import { useAuthStore, useWishlistStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { products, Product } from "@/data/mock";
import { ThemeToggle } from "./ThemeToggle";
import { Logo } from "@/components/ui/Logo";


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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const wishlistItems = useWishlistStore((state) => state.items);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
      setSearchResults(filtered);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close search results when location changes
  useEffect(() => {
    setShowResults(false);
    setSearchQuery("");
  }, [location]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <Logo className="h-8 w-auto text-black dark:text-white transition-colors duration-300" />
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
            <div className="relative flex items-center" ref={searchRef}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery) {
                    navigate(`/shop?q=${encodeURIComponent(searchQuery)}`);
                    setShowResults(false);
                  }
                }}
                className="flex items-center"
              >
                <Input
                  name="search"
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim().length > 1 && setShowResults(true)}
                  className="h-9 w-40 bg-secondary pr-8 transition-all focus:w-60"
                />
                <button type="submit" className="absolute right-2 text-muted-foreground transition-colors hover:text-foreground" aria-label="Search">
                  <Search className="h-4 w-4" />
                </button>
              </form>

              {/* Search Results Dropdown */}
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-80 rounded-xl border border-border bg-card p-2 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex flex-col gap-1">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-secondary/50 group"
                      >
                        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-secondary">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform group-hover:scale-110"
                          />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="truncate text-sm font-bold uppercase tracking-tight group-hover:text-primary">
                            {product.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {product.brand} • ${product.price.toLocaleString()}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-2 border-t border-border pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs font-bold uppercase tracking-widest"
                      onClick={() => navigate(`/shop?q=${encodeURIComponent(searchQuery)}`)}
                    >
                      View all results
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <Link to="/profile" className="relative p-2 text-muted-foreground transition-colors hover:text-foreground" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
              {wishlistItems.length > 0 && (
                <Badge className="absolute -right-1 -top-1 h-4 w-4 justify-center rounded-full p-0 text-[10px]">
                  {wishlistItems.length}
                </Badge>
              )}
            </Link>

            <ThemeToggle />

            {isAuthenticated ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/profile")}
                className="text-muted-foreground hover:text-foreground"
                title={`Logged in as ${user?.name}`}
              >
                <User className="h-5 w-5" />
              </Button>
            ) : (
              <AuthModal>
                <button className="p-2 text-muted-foreground transition-colors hover:text-foreground" aria-label="Account">
                  <User className="h-5 w-5" />
                </button>
              </AuthModal>
            )}
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
