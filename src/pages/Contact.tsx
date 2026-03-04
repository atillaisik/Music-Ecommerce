import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  MessageSquare,
  Sparkles,
  Music2
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Contact = () => (
  <div className="min-h-screen bg-background text-foreground">
    <Navbar />

    <main className="pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-secondary/30 py-20 lg:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,rgba(var(--primary-rgb),0.05)_0%,transparent_100%)]" />
        <div className="container text-center">
          <div className="mx-auto flex w-fit items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Support Excellence</span>
          </div>
          <h1 className="font-display text-5xl font-bold uppercase tracking-tight lg:text-7xl">
            Get in <span className="text-primary italic">Touch</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground lg:text-xl">
            Have questions about our collection or need help find the perfect sound?
            Our specialists are here to assist you in every step of your musical journey.
          </p>
        </div>
      </section>

      <div className="container mt-12 lg:mt-20">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-24">

          {/* Main Contact Form and Info */}
          <div className="lg:col-span-12 grid gap-12 lg:grid-cols-2">
            {/* Form */}
            <div className="space-y-8 rounded-2xl border bg-card p-6 shadow-sm lg:p-10">
              <div className="space-y-2">
                <h2 className="font-display text-2xl font-bold uppercase tracking-wide">Send a Message</h2>
                <p className="text-muted-foreground">We typically respond within 24 business hours.</p>
              </div>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 text-sm font-medium">
                    <label htmlFor="name">Full Name</label>
                    <Input id="name" placeholder="John Doe" className="bg-secondary/50 border-none h-12" />
                  </div>
                  <div className="space-y-2 text-sm font-medium">
                    <label htmlFor="email">Email Address</label>
                    <Input id="email" placeholder="john@example.com" type="email" className="bg-secondary/50 border-none h-12" />
                  </div>
                </div>
                <div className="space-y-2 text-sm font-medium">
                  <label htmlFor="subject">Subject</label>
                  <Input id="subject" placeholder="Product Inquiry" className="bg-secondary/50 border-none h-12" />
                </div>
                <div className="space-y-2 text-sm font-medium">
                  <label htmlFor="message">How can we help?</label>
                  <Textarea id="message" placeholder="Tell us more about what you're looking for..." rows={5} className="bg-secondary/50 border-none resize-none" />
                </div>
                <Button type="submit" size="lg" className="w-full font-display uppercase tracking-widest text-base py-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300">
                  Send Message
                </Button>
              </form>
            </div>

            {/* Support Info */}
            <div className="space-y-12">
              <div className="grid gap-6 sm:grid-cols-2">
                {[
                  { icon: MapPin, title: "Nashville Studio", text: "123 Music Avenue, TN 37203" },
                  { icon: Phone, title: "Customer Support", text: "+1 (800) 555-MUSIC" },
                  { icon: Mail, title: "Support Email", text: "support@arasounds.com" },
                  { icon: Clock, title: "Opening Hours", text: "Mon–Sat: 9AM–8PM" },
                ].map(({ icon: Icon, title, text }) => (
                  <div key={title} className="group flex flex-col items-start gap-4 rounded-xl border p-5 transition-colors hover:bg-secondary/20">
                    <div className="rounded-lg bg-primary/10 p-3 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <Icon className="h-6 w-6 text-primary group-hover:text-inherit" />
                    </div>
                    <div>
                      <h3 className="font-display text-sm font-bold uppercase tracking-wider">{title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Community Links */}
              <div className="rounded-2xl bg-secondary/30 p-8 border border-border/50">
                <h3 className="font-display text-lg font-bold uppercase tracking-tight mb-6">Join the Community</h3>
                <div className="flex flex-wrap gap-4">
                  {[
                    { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
                    { icon: Twitter, label: "Twitter", href: "https://twitter.com" },
                    { icon: Facebook, label: "Facebook", href: "https://facebook.com" },
                    { icon: Youtube, label: "Youtube", href: "https://youtube.com" },
                    { icon: Music2, label: "TikTok", href: "https://tiktok.com" },
                  ].map(({ icon: Icon, label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-full border bg-background px-5 py-2.5 text-sm font-medium transition-all hover:bg-primary hover:text-primary-foreground hover:scale-105 active:scale-95"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </a>
                  ))}

                </div>
                <p className="mt-6 text-sm text-muted-foreground flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  Tag us with #ARASOUNDS for a chance to be featured.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-12 h-px bg-border/50 my-10" />

          {/* FAQ and Map Section */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-2">
              <h2 className="font-display text-3xl font-bold uppercase tracking-tight">Frequently Asked Questions</h2>
              <p className="text-muted-foreground text-lg">Quick answers to common inquiries.</p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {[
                {
                  question: "What is your return policy for instruments?",
                  answer: "We offer a 30-day no-questions-asked return policy for all instruments. Items must be returned in their original condition and packaging. Custom shop orders may have different terms."
                },
                {
                  question: "Do you offer international shipping?",
                  answer: "Yes, we ship to over 50 countries worldwide. Shipping costs and delivery times vary by location. All international shipments are fully insured during transit."
                },
                {
                  question: "Can I schedule a private viewing?",
                  answer: "Absolutely! We encourage private viewings for our high-end collection. Please select 'Showroom Appointment' in the contact form or call us directly to schedule your visit."
                },
                {
                  question: "Do the instruments come with a warranty?",
                  answer: "Every instrument sold at ARASOUNDS comes with a minimum 1-year manufacturer warranty. We also provide our own dedicated setup service for the first year of ownership."
                }
              ].map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-b-border/50">
                  <AccordionTrigger className="text-left font-display text-base font-semibold hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Map Section */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-2">
              <h2 className="font-display text-3xl font-bold uppercase tracking-tight">Visit Our Showroom</h2>
              <p className="text-muted-foreground text-lg">Experience the sound in person.</p>
            </div>

            <div className="relative aspect-square w-full sm:aspect-video lg:aspect-square overflow-hidden rounded-2xl border bg-secondary flex items-center justify-center group shadow-inner">
              <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
              {/* This is a visual representation for a map */}
              <div className="relative z-10 text-center p-8 space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold uppercase">ARASOUNDS HQ</h3>
                  <p className="text-sm text-muted-foreground mt-1">123 Music Avenue, Nashville, TN 37203</p>
                </div>
                <Button variant="outline" className="rounded-full bg-background/50 backdrop-blur-sm">
                  Open in Google Maps
                </Button>
              </div>

              {/* Decorative elements to make it look like a map */}
              <div className="absolute top-1/4 left-1/3 w-32 h-1 bg-primary/20 rotate-45" />
              <div className="absolute bottom-1/3 right-1/4 w-40 h-1 bg-primary/10 -rotate-12" />
              <div className="absolute top-1/2 left-1/2 w-px h-full bg-border/20" />
              <div className="absolute top-1/2 left-0 w-full h-px bg-border/20" />
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
);

export default Contact;
