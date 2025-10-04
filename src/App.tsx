import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AddDog from "./pages/AddDog";
import FindWalkers from "./pages/FindWalkers";
import MyBookings from "./pages/MyBookings";
import BookingDetails from "./pages/BookingDetails";
import BookWalk from "./pages/BookWalk";
import WalkerRegister from "./pages/WalkerRegister";
import WalkerDashboard from "./pages/WalkerDashboard";
import WalkerEarnings from "./pages/WalkerEarnings";
import Profile from "./pages/Profile";
import Tarifs from "./pages/Tarifs";
import Securite from "./pages/Securite";
import Messages from "./pages/Messages";
import Blog from "./pages/Blog";
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
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dogs/add" element={<AddDog />} />
          <Route path="/walkers" element={<FindWalkers />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/bookings/:id" element={<BookingDetails />} />
          <Route path="/book/:walkerId" element={<BookWalk />} />
          <Route path="/walker/register" element={<WalkerRegister />} />
          <Route path="/walker/dashboard" element={<WalkerDashboard />} />
          <Route path="/walker/earnings" element={<WalkerEarnings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/tarifs" element={<Tarifs />} />
          <Route path="/securite" element={<Securite />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/blog" element={<Blog />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
