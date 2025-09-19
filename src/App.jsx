import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import ProductDetails from "./pages/ProductDetails";
import ScrollToTop from "./components/common/ScrollToTop";
import ScrollRestoration from "./components/common/ScrollRestoration";

function App() {
  return (
    <>
      <ScrollToTop />
      <ScrollRestoration />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product-details/:id" element={<ProductDetails />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
