import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Contact = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="container py-10">
      <h1 className="font-display text-4xl font-bold uppercase tracking-tight">Contact Us</h1>
      <p className="mt-2 text-muted-foreground">We'd love to hear from you</p>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        {/* Form */}
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input placeholder="Your name" className="bg-secondary" />
            <Input placeholder="Your email" type="email" className="bg-secondary" />
          </div>
          <Input placeholder="Subject" className="bg-secondary" />
          <Textarea placeholder="Your message" rows={5} className="bg-secondary" />
          <Button type="submit" className="font-display uppercase tracking-wider">Send Message</Button>
        </form>

        {/* Info */}
        <div className="space-y-6">
          {[
            { icon: MapPin, title: "Visit Us", text: "123 Music Avenue, Nashville, TN 37203" },
            { icon: Phone, title: "Call Us", text: "+1 (800) 555-MUSIC" },
            { icon: Mail, title: "Email Us", text: "hello@arasounds.com" },
            { icon: Clock, title: "Hours", text: "Mon–Sat: 9AM–8PM | Sun: 10AM–6PM" },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-4">
              <div className="rounded-md bg-primary/10 p-3">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-sm font-semibold uppercase tracking-wider">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Contact;
