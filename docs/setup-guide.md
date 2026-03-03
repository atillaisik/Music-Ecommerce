# Project Setup and Installation Guide

## Getting Started

Follow these steps to set up the development environment and get the project running locally.

### Prerequisites

- Node.js (v20 or higher)
- npm or bun
- Supabase Account

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Music-Ecommerce
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   *Note: You can also use `bun install` for faster results.*

3. **Environment Setup:**
   - Copy `.env.example` to `.env`.
   - Update `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with your project credentials from the Supabase dashboard.

4. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:8080](http://localhost:8080) in your browser.

### Local Testing

To run the unit and integration tests:
```bash
npm run test
```

### Production Build

To generate a production build:
```bash
npm run build
```
The output will be in the `dist/` directory.
