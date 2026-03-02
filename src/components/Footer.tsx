import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Footer = () => (
  <footer className="border-t border-border bg-card">
    <div className="container py-12">
      <div className="grid gap-8 md:grid-cols-4">
        {/* Brand */}
        <div>
          <img
            src="/ArasSounds.png"
            alt="ARASOUNDS Logo"
            className="h-8 w-auto object-contain"
          />
          <p className="mt-3 text-sm text-muted-foreground">
            Your one-stop destination for premium musical instruments and gear.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {["Shop", "Instruments", "Brands", "Deals"].map((l) => (
              <li key={l}>
                <Link to={`/${l.toLowerCase()}`} className="transition-colors hover:text-foreground">{l}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider">Support</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {["Contact Us", "FAQs", "Shipping", "Returns"].map((l) => (
              <li key={l}>
                <Link to="/contact" className="transition-colors hover:text-foreground">{l}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider">Newsletter</h4>
          <p className="mb-3 text-sm text-muted-foreground">Get the latest deals and new arrivals.</p>
          <div className="flex gap-2">
            <Input placeholder="Your email" className="bg-secondary" />
            <Button size="sm">Join</Button>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
        © 2026 ARASOUNDS. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
