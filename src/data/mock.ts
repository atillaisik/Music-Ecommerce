export interface Review {
  id: string;
  user: string;
  userId?: string;
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
    id: "2057ec05-9312-4fb2-a9e6-36a7b59fb041",
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
    id: "93887aac-77b4-4b3c-8879-7ccfbac0b336",
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
    id: "e68de6f6-4c48-4e4b-b628-ef80df0b5665",
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
  { id: "d04dcb1e-9722-4747-b962-a72be3c0f349", name: "Yamaha P-125 Digital Piano", brand: "Yamaha", category: "Keyboards", price: 649, rating: 4.6, reviews: 489, image: "https://images.unsplash.com/photo-1552422535-c45813c61732?w=800&h=800&fit=crop", images: ["https://images.unsplash.com/photo-1552422535-c45813c61732?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=800&fit=crop"] },
  { id: "045bf986-8c12-4cda-abf1-520a689d02d4", name: "Fender Jazz Bass", brand: "Fender", category: "Bass", price: 1199, rating: 4.7, reviews: 267, image: "https://images.unsplash.com/photo-1763522224888-79c73c0e7b8b?w=800&h=800&fit=crop", images: ["https://images.unsplash.com/photo-1763522224888-79c73c0e7b8b?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800&h=800&fit=crop"] },
  { id: "cf1bcee6-7a34-4ed9-83ef-a86ca4ec8a6e", name: "Pioneer DDJ-1000", brand: "Pioneer", category: "DJ Equipment", price: 1299, rating: 4.8, reviews: 134, image: "https://images.unsplash.com/photo-1571327073757-71d13c24de30?w=800&h=800&fit=crop", badge: "Hot", images: ["https://images.unsplash.com/photo-1571327073757-71d13c24de30?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=800&fit=crop"] },
  { id: "58681d36-e9ff-4932-9004-2f9b5caa0d8f", name: "Taylor 814ce", brand: "Taylor", category: "Guitars", price: 3499, rating: 4.9, reviews: 98, image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&h=800&fit=crop", images: ["https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1550985616-10810253b84d?w=800&h=800&fit=crop"] },
  { id: "8bdd5e04-0e80-48bd-b3dc-61f9f7a1fa7b", name: "Nord Stage 3", brand: "Nord", category: "Keyboards", price: 4999, rating: 4.9, reviews: 76, image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=800&fit=crop", badge: "Premium", images: ["https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1552422535-c45813c61732?w=800&h=800&fit=crop"] },
  { id: "69b19b5e-4b22-4d12-9914-f80a34999e82", name: "Ibanez SR505", brand: "Ibanez", category: "Bass", price: 799, originalPrice: 999, rating: 4.5, reviews: 201, image: "https://images.unsplash.com/photo-1618530089935-3030738b8c7b?w=800&h=800&fit=crop", badge: "Sale", images: ["https://images.unsplash.com/photo-1618530089935-3030738b8c7b?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1763522224888-79c73c0e7b8b?w=800&h=800&fit=crop"] },
  { id: "fdb963a6-c954-435d-92a1-8ef0b758f958", name: "Pearl Export EXX", brand: "Pearl", category: "Drums", price: 849, originalPrice: 1099, rating: 4.6, reviews: 312, image: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800&h=800&fit=crop", badge: "Sale", images: ["https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1543443374-b6fe10a6ab7b?w=800&h=800&fit=crop"] },
  { id: "34353e52-c0c7-4637-a017-6d7ed78760b4", name: "Korg Minilogue XD", brand: "Korg", category: "Keyboards", price: 649, originalPrice: 799, rating: 4.7, reviews: 189, image: "https://images.unsplash.com/photo-1552422535-c45813c61732?w=800&h=800&fit=crop", badge: "Sale", images: ["https://images.unsplash.com/photo-1552422535-c45813c61732?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=800&fit=crop"] },
  { id: "629ea862-0414-468b-bf7f-37d46a476ff0", name: "Martin D-28", brand: "Martin", category: "Guitars", price: 2999, rating: 4.9, reviews: 145, image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&h=800&fit=crop", images: ["https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800&h=800&fit=crop"] },
  { id: "910ad2f7-6163-42c6-a369-85e7653c5d96", name: "Gretsch Renown Drum Set", brand: "Gretsch", category: "Drums", price: 1799, rating: 4.8, reviews: 42, image: "https://images.unsplash.com/photo-1543443374-b6fe10a6ab7b?w=800&h=800&fit=crop", images: ["https://images.unsplash.com/photo-1543443374-b6fe10a6ab7b?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800&h=800&fit=crop"] },
  { id: "605f2fce-60f2-4fbd-931d-d766211badb0", name: "Yamaha HS8 Studio Monitor", brand: "Yamaha", category: "Studio Gear", price: 399, rating: 4.9, reviews: 156, image: "https://images.unsplash.com/photo-1594122230689-45899d9e6f69?w=800&h=800&fit=crop", images: ["https://images.unsplash.com/photo-1594122230689-45899d9e6f69?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=800&fit=crop"] },
  { id: "651979fb-dd98-4fb3-889c-ee5199926163", name: "Focusrite Scarlett 2i2", brand: "Focusrite", category: "Studio Gear", price: 189, rating: 4.8, reviews: 521, image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=800&fit=crop", images: ["https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1594122230689-45899d9e6f69?w=800&h=800&fit=crop"] },
  { id: "78fdd045-d95e-4522-a722-44fd61c24cf0", name: "Pioneer DJM-900NXS2", brand: "Pioneer", category: "DJ Equipment", price: 2199, rating: 4.9, reviews: 89, image: "https://images.unsplash.com/photo-1571327073757-71d13c24de30?w=800&h=800&fit=crop", images: ["https://images.unsplash.com/photo-1571327073757-71d13c24de30?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=800&fit=crop"] },
  { id: "16f7c94e-0ce5-4593-8edb-0b2b3b2afd99", name: "Fender Am Pro II Telecaster", brand: "Fender", category: "Guitars", price: 1699, rating: 4.9, reviews: 124, image: "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800&h=800&fit=crop", badge: "New", images: ["https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&h=800&fit=crop"] },
  { id: "11db9174-fc9a-448c-82a1-a634fd61ebf7", name: "Roland JUPITER-X", brand: "Roland", category: "Keyboards", price: 2499, rating: 4.8, reviews: 34, image: "https://images.unsplash.com/photo-1552422535-c45813c61732?w=800&h=800&fit=crop", images: ["https://images.unsplash.com/photo-1552422535-c45813c61732?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=800&fit=crop"] },
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
  { id: "f5a8bfa5-80d6-4570-9f6d-d38be21c4aa6", title: "Beginner's Guide to Electric Guitar", excerpt: "Everything you need to know to start your electric guitar journey, from choosing your first guitar to learning basic chords.", image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&h=400&fit=crop", category: "Guides", readTime: "8 min" },
  { id: "2abbff9d-3801-4e0d-afe0-14848d244970", title: "How to Set Up Your Home Studio", excerpt: "A comprehensive guide to building a professional home recording studio on any budget.", image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&h=400&fit=crop", category: "Studio", readTime: "12 min" },
  { id: "79644203-1277-4c25-883b-564cad3c07dc", title: "Top 10 Drum Exercises for Speed", excerpt: "Improve your drumming speed and accuracy with these proven practice techniques.", image: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=600&h=400&fit=crop", category: "Tips", readTime: "6 min" },
  { id: "65b65782-683c-446e-a85a-2b71c0e997db", title: "Understanding Keyboard Synth Sounds", excerpt: "Explore the world of synthesis and learn how to create unique sounds on your keyboard.", image: "https://images.unsplash.com/photo-1552422535-c45813c61732?w=600&h=400&fit=crop", category: "Tutorials", readTime: "10 min" },
];
