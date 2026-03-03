export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  reviewsData?: Review[];
  image: string;
  images?: string[];
  badge?: string;
}

export interface Category {
  name: string;
  image: string;
  count: number;
}

export interface Brand {
  name: string;
  logo: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  readTime: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Fender Stratocaster",
    brand: "Fender",
    category: "Guitars",
    price: 1499,
    rating: 4.8,
    reviews: 342,
    reviewsData: [
      { id: "r1", user: "John D.", rating: 5, comment: "Best guitar I've ever owned. The tone is crystalline.", date: "2024-02-15" },
      { id: "r2", user: "Sarah M.", rating: 4, comment: "Beautiful finish, plays like a dream. Minor tuning issues out of the box.", date: "2024-01-20" }
    ],
    image: "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1550985616-10810253b84d?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&h=800&fit=crop"
    ],
    badge: "Best Seller"
  },
  {
    id: "2",
    name: "Gibson Les Paul Standard",
    brand: "Gibson",
    category: "Guitars",
    price: 2499,
    rating: 4.9,
    reviews: 218,
    reviewsData: [
      { id: "r3", user: "Mike R.", rating: 5, comment: "A heavy beast with a heavy sound. Worth every penny.", date: "2024-02-10" }
    ],
    image: "https://images.unsplash.com/photo-1550985616-10810253b84d?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1550985616-10810253b84d?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800&h=800&fit=crop"
    ]
  },
  {
    id: "3",
    name: "Roland TD-27KV",
    brand: "Roland",
    category: "Drums",
    price: 3299,
    rating: 4.7,
    reviews: 156,
    reviewsData: [
      { id: "r4", user: "Alex K.", rating: 5, comment: "Feels very close to an acoustic kit. The digital snare is amazing.", date: "2024-01-05" }
    ],
    image: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800&h=800&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1543443374-b6fe10a6ab7b?w=800&h=800&fit=crop"
    ],
    badge: "New"
  },
  { id: "4", name: "Yamaha P-125 Digital Piano", brand: "Yamaha", category: "Keyboards", price: 649, rating: 4.6, reviews: 489, image: "https://images.unsplash.com/photo-1552422535-c45813c61732?w=800&h=800&fit=crop", images: ["https://images.unsplash.com/photo-1552422535-c45813c61732?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=800&fit=crop"] },
  { id: "5", name: "Fender Jazz Bass", brand: "Fender", category: "Bass", price: 1199, rating: 4.7, reviews: 267, image: "https://images.unsplash.com/photo-1763522224888-79c73c0e7b8b?w=800&h=800&fit=crop", images: ["https://images.unsplash.com/photo-1763522224888-79c73c0e7b8b?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800&h=800&fit=crop"] },
  { id: "6", name: "Pioneer DDJ-1000", brand: "Pioneer", category: "DJ Equipment", price: 1299, rating: 4.8, reviews: 134, image: "https://images.unsplash.com/photo-1571327073757-71d13c24de30?w=800&h=800&fit=crop", badge: "Hot", images: ["https://images.unsplash.com/photo-1571327073757-71d13c24de30?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=800&fit=crop"] },
  { id: "7", name: "Taylor 814ce", brand: "Taylor", category: "Guitars", price: 3499, rating: 4.9, reviews: 98, image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&h=800&fit=crop", images: ["https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1550985616-10810253b84d?w=800&h=800&fit=crop"] },
  { id: "8", name: "Nord Stage 3", brand: "Nord", category: "Keyboards", price: 4999, rating: 4.9, reviews: 76, image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=800&fit=crop", badge: "Premium", images: ["https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1552422535-c45813c61732?w=800&h=800&fit=crop"] },
  { id: "9", name: "Ibanez SR505", brand: "Ibanez", category: "Bass", price: 799, originalPrice: 999, rating: 4.5, reviews: 201, image: "https://images.unsplash.com/photo-1618530089935-3030738b8c7b?w=800&h=800&fit=crop", badge: "Sale", images: ["https://images.unsplash.com/photo-1618530089935-3030738b8c7b?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1763522224888-79c73c0e7b8b?w=800&h=800&fit=crop"] },
  { id: "10", name: "Pearl Export EXX", brand: "Pearl", category: "Drums", price: 849, originalPrice: 1099, rating: 4.6, reviews: 312, image: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800&h=800&fit=crop", badge: "Sale", images: ["https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1543443374-b6fe10a6ab7b?w=800&h=800&fit=crop"] },
  { id: "11", name: "Korg Minilogue XD", brand: "Korg", category: "Keyboards", price: 649, originalPrice: 799, rating: 4.7, reviews: 189, image: "https://images.unsplash.com/photo-1552422535-c45813c61732?w=800&h=800&fit=crop", badge: "Sale", images: ["https://images.unsplash.com/photo-1552422535-c45813c61732?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=800&fit=crop"] },
  { id: "12", name: "Martin D-28", brand: "Martin", category: "Guitars", price: 2999, rating: 4.9, reviews: 145, image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&h=800&fit=crop", images: ["https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800&h=800&fit=crop"] },
  { id: "13", name: "Gretsch Renown Drum Set", brand: "Gretsch", category: "Drums", price: 1799, rating: 4.8, reviews: 42, image: "https://images.unsplash.com/photo-1543443374-b6fe10a6ab7b?w=800&h=800&fit=crop", images: ["https://images.unsplash.com/photo-1543443374-b6fe10a6ab7b?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800&h=800&fit=crop"] },
  { id: "14", name: "Yamaha HS8 Studio Monitor", brand: "Yamaha", category: "Studio Gear", price: 399, rating: 4.9, reviews: 156, image: "https://images.unsplash.com/photo-1594122230689-45899d9e6f69?w=800&h=800&fit=crop", images: ["https://images.unsplash.com/photo-1594122230689-45899d9e6f69?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=800&fit=crop"] },
  { id: "15", name: "Focusrite Scarlett 2i2", brand: "Focusrite", category: "Studio Gear", price: 189, rating: 4.8, reviews: 521, image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=800&fit=crop", images: ["https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1594122230689-45899d9e6f69?w=800&h=800&fit=crop"] },
  { id: "16", name: "Pioneer DJM-900NXS2", brand: "Pioneer", category: "DJ Equipment", price: 2199, rating: 4.9, reviews: 89, image: "https://images.unsplash.com/photo-1571327073757-71d13c24de30?w=800&h=800&fit=crop", images: ["https://images.unsplash.com/photo-1571327073757-71d13c24de30?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=800&fit=crop"] },
  { id: "17", name: "Fender Am Pro II Telecaster", brand: "Fender", category: "Guitars", price: 1699, rating: 4.9, reviews: 124, image: "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800&h=800&fit=crop", badge: "New", images: ["https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&h=800&fit=crop"] },
  { id: "18", name: "Roland JUPITER-X", brand: "Roland", category: "Keyboards", price: 2499, rating: 4.8, reviews: 34, image: "https://images.unsplash.com/photo-1552422535-c45813c61732?w=800&h=800&fit=crop", images: ["https://images.unsplash.com/photo-1552422535-c45813c61732?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=800&fit=crop"] },
];

export const categories: Category[] = [
  { name: "Guitars", image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=300&fit=crop", count: 0 },
  { name: "Drums", image: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400&h=300&fit=crop", count: 0 },
  { name: "Keyboards", image: "https://images.unsplash.com/photo-1552422535-c45813c61732?w=400&h=400&fit=crop", count: 0 },
  { name: "Bass", image: "https://images.unsplash.com/photo-1543060749-aa3f115aad09?w=800&h=600&fit=crop", count: 0 },
  { name: "DJ Equipment", image: "https://images.unsplash.com/photo-1571327073757-71d13c24de30?w=400&h=300&fit=crop", count: 0 },
  { name: "Studio Gear", image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=300&fit=crop", count: 0 },
].map(cat => ({
  ...cat,
  count: products.filter(p => p.category === cat.name).length
}));

export const brands: Brand[] = [
  { name: "Fender", logo: "F" },
  { name: "Gibson", logo: "G" },
  { name: "Yamaha", logo: "Y" },
  { name: "Roland", logo: "R" },
  { name: "Taylor", logo: "T" },
  { name: "Martin", logo: "M" },
  { name: "Ibanez", logo: "I" },
  { name: "Pearl", logo: "P" },
  { name: "Pioneer", logo: "Pi" },
  { name: "Korg", logo: "K" },
  { name: "Nord", logo: "N" },
  { name: "Boss", logo: "B" },
  { name: "Gretsch", logo: "Gr" },
  { name: "Focusrite", logo: "Fo" },
];

export const articles: Article[] = [
  { id: "1", title: "Beginner's Guide to Electric Guitar", excerpt: "Everything you need to know to start your electric guitar journey, from choosing your first guitar to learning basic chords.", image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&h=400&fit=crop", category: "Guides", readTime: "8 min" },
  { id: "2", title: "How to Set Up Your Home Studio", excerpt: "A comprehensive guide to building a professional home recording studio on any budget.", image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&h=400&fit=crop", category: "Studio", readTime: "12 min" },
  { id: "3", title: "Top 10 Drum Exercises for Speed", excerpt: "Improve your drumming speed and accuracy with these proven practice techniques.", image: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=600&h=400&fit=crop", category: "Tips", readTime: "6 min" },
  { id: "4", title: "Understanding Keyboard Synth Sounds", excerpt: "Explore the world of synthesis and learn how to create unique sounds on your keyboard.", image: "https://images.unsplash.com/photo-1552422535-c45813c61732?w=600&h=400&fit=crop", category: "Tutorials", readTime: "10 min" },
];
