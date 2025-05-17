
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Documents from "./pages/Documents";
import Products from "./pages/Products";
import ProductDetailPage from "./pages/product/ProductDetailPage";
import ProductCreatePage from "./pages/product/ProductCreatePage";
import NonConformance from "./pages/NonConformance";
import NCCreatePage from "./pages/nonconformance/NCCreatePage"; 
import NCDetailPage from "./pages/nonconformance/NCDetailPage";
import NCEditPage from "./pages/nonconformance/NCEditPage";
import CAPA from "./pages/CAPA";
import Complaints from "./pages/Complaints";
import ComplaintCreatePage from "./pages/complaints/ComplaintCreatePage";
import ComplaintDetailPage from "./pages/complaints/ComplaintDetailPage";
import Audits from "./pages/Audits";
import Suppliers from "./pages/Suppliers";
import Risk from "./pages/Risk";
import Change from "./pages/Change";
import ChangeCreatePage from "./pages/change/ChangeCreatePage";
import ChangeDetailPage from "./pages/change/ChangeDetailPage";
import Training from "./pages/Training";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/create" element={<ProductCreatePage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/non-conformance" element={<NonConformance />} />
        <Route path="/non-conformance/create" element={<NCCreatePage />} />
        <Route path="/non-conformance/:id" element={<NCDetailPage />} />
        <Route path="/non-conformance/:id/edit" element={<NCEditPage />} />
        <Route path="/capa" element={<CAPA />} />
        <Route path="/complaints" element={<Complaints />} />
        <Route path="/complaints/create" element={<ComplaintCreatePage />} />
        <Route path="/complaints/:id" element={<ComplaintDetailPage />} />
        <Route path="/audits" element={<Audits />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/risk" element={<Risk />} />
        <Route path="/change" element={<Change />} />
        <Route path="/change/create" element={<ChangeCreatePage />} />
        <Route path="/change/:id" element={<ChangeDetailPage />} />
        <Route path="/training" element={<Training />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
