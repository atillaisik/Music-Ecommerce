import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Instruments from "./pages/Instruments";
import Brands from "./pages/Brands";
import Learn from "./pages/Learn";
import Deals from "./pages/Deals";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

import ProductDetail from "./pages/ProductDetail";
import Checkout from "@/pages/Checkout";
import CheckoutSuccess from "@/pages/CheckoutSuccess";
import Profile from "./pages/Profile";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProductList from "./pages/admin/products/AdminProductList";
import AdminAddProduct from "./pages/admin/products/AdminAddProduct";
import AdminEditProduct from "./pages/admin/products/AdminEditProduct";
import AdminCategoryList from "./pages/admin/categories/AdminCategoryList";
import AdminAddCategory from "./pages/admin/categories/AdminAddCategory";
import AdminEditCategory from "./pages/admin/categories/AdminEditCategory";
import AdminBrandList from "./pages/admin/brands/AdminBrandList";
import AdminAddBrand from "./pages/admin/brands/AdminAddBrand";
import AdminEditBrand from "./pages/admin/brands/AdminEditBrand";
import AdminDiscountList from "./pages/admin/discounts/AdminDiscountList";
import AdminAddDiscount from "./pages/admin/discounts/AdminAddDiscount";
import AdminEditDiscount from "./pages/admin/discounts/AdminEditDiscount";
import AdminOrderList from "./pages/admin/orders/AdminOrderList";
import AdminOrderDetail from "./pages/admin/orders/AdminOrderDetail";
import AdminCustomerList from "./pages/admin/customers/AdminCustomerList";
import AdminCustomerDetail from "./pages/admin/customers/AdminCustomerDetail";
import AdminAnalyticsDashboard from "./pages/admin/analytics/AdminAnalyticsDashboard";
import AdminActivityLog from "./pages/admin/activity-log/AdminActivityLog";
import AdminSettings from "./pages/admin/settings/AdminSettings";
import AdminBackup from "./pages/admin/backup/AdminBackup";
import AdminPlaceholder from "./components/admin/AdminPlaceholder";

import { ThemeProvider } from "@/components/ThemeProvider";
import { HelmetProvider } from "react-helmet-async";

import ScrollToTop from "./components/ScrollToTop";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="arasounds-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/instruments" element={<Instruments />} />
              <Route path="/brands" element={<Brands />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/deals" element={<Deals />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/checkout/success" element={<CheckoutSuccess />} />
              <Route path="/profile" element={<Profile />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <ProtectedAdminRoute>
                    <AdminLayout />
                  </ProtectedAdminRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProductList />} />
                <Route path="products/add" element={<AdminAddProduct />} />
                <Route path="products/edit/:id" element={<AdminEditProduct />} />
                <Route path="categories" element={<AdminCategoryList />} />
                <Route path="categories/add" element={<AdminAddCategory />} />
                <Route path="categories/edit/:id" element={<AdminEditCategory />} />
                <Route path="brands" element={<AdminBrandList />} />
                <Route path="brands/add" element={<AdminAddBrand />} />
                <Route path="brands/edit/:id" element={<AdminEditBrand />} />
                <Route path="orders" element={<AdminOrderList />} />
                <Route path="orders/:id" element={<AdminOrderDetail />} />
                <Route path="customers" element={<AdminCustomerList />} />
                <Route path="customers/:email" element={<AdminCustomerDetail />} />
                <Route path="analytics" element={<AdminAnalyticsDashboard />} />
                <Route path="discounts" element={<AdminDiscountList />} />
                <Route path="discounts/add" element={<AdminAddDiscount />} />
                <Route path="discounts/edit/:id" element={<AdminEditDiscount />} />
                <Route path="activity-log" element={<AdminActivityLog />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="backup" element={<AdminBackup />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
