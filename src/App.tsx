
import { Toaster } from "@/components/ui/toaster"; // Lowercase casing
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CAPA from "./pages/CAPA";
import Documents from "./pages/Documents";
import Audits from "./pages/Audits";
import Training from "./pages/Training";
import Suppliers from "./pages/Suppliers";
import Risk from "./pages/Risk";
import NonConformance from "./pages/NonConformance";
import NCDetailPage from "./pages/nonconformance/NCDetailPage";
import NCCreatePage from "./pages/nonconformance/NCCreatePage";
import NCEditPage from "./pages/nonconformance/NCEditPage";
import Change from "./pages/Change";
import Products from "./pages/Products";
import ProductDetailPage from "./pages/product/ProductDetailPage";
import ProductCreatePage from "./pages/product/ProductCreatePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/capa" element={<CAPA />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/audits" element={<Audits />} />
            <Route path="/training" element={<Training />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/risk" element={<Risk />} />
            <Route path="/nonconformance" element={<NonConformance />} />
            <Route path="/nonconformance/:id" element={<NCDetailPage />} />
            <Route path="/nonconformance/create" element={<NCCreatePage />} />
            <Route path="/nonconformance/edit/:id" element={<NCEditPage />} />
            <Route path="/change" element={<Change />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/products/create" element={<ProductCreatePage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
