import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SearchResults from "./pages/SearchResults";
import HotelDetails from "./pages/HotelDetails";
import BookingPage from "./pages/BookingPage";
import Dashboard from "./pages/Dashboard";
import Destinations from "./pages/Destinations";
import DealsOffers from "./pages/DealsOffers";
import TravelGuides from "./pages/TravelGuides";
import AboutUs from "./pages/AboutUs";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import Contact from "./pages/Contact";
import HelpCenter from "./pages/HelpCenter";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CancellationPolicy from "./pages/CancellationPolicy";
import PartnerProgram from "./pages/PartnerProgram";
import PartnerRegister from "./pages/PartnerRegister";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/hotel/:id" element={<HotelDetails />} />
          <Route path="/booking/:id" element={<BookingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/deals" element={<DealsOffers />} />
          <Route path="/guides" element={<TravelGuides />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/press" element={<Press />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/cancellation-policy" element={<CancellationPolicy />} />
          <Route path="/partner-program" element={<PartnerProgram />} />
          <Route path="/partner-register" element={<PartnerRegister />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
