import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h3 className="text-xl font-display font-bold mb-4">
              Stay<span className="text-gold">Vista</span>
            </h3>
            <p className="text-primary-foreground/60 text-sm leading-relaxed">
              Discover extraordinary stays around the world. From boutique hotels to luxury resorts, find your perfect escape.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-primary-foreground/80">Explore</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/60">
              <li><Link to="/search" className="hover:text-gold transition-colors">Search Hotels</Link></li>
              <li><Link to="/" className="hover:text-gold transition-colors">Destinations</Link></li>
              <li><Link to="/" className="hover:text-gold transition-colors">Deals & Offers</Link></li>
              <li><Link to="/" className="hover:text-gold transition-colors">Travel Guides</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-primary-foreground/80">Company</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/60">
              <li><Link to="/" className="hover:text-gold transition-colors">About Us</Link></li>
              <li><Link to="/" className="hover:text-gold transition-colors">Careers</Link></li>
              <li><Link to="/" className="hover:text-gold transition-colors">Press</Link></li>
              <li><Link to="/" className="hover:text-gold transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-primary-foreground/80">Support</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/60">
              <li><Link to="/" className="hover:text-gold transition-colors">Help Center</Link></li>
              <li><Link to="/" className="hover:text-gold transition-colors">Privacy Policy</Link></li>
              <li><Link to="/" className="hover:text-gold transition-colors">Terms of Service</Link></li>
              <li><Link to="/" className="hover:text-gold transition-colors">Cancellation Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 text-center text-sm text-primary-foreground/40">
          © 2026 StayVista. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
