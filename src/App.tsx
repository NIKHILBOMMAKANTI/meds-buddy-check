import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import 'bootstrap/dist/css/bootstrap.min.css';
import Registration from "./pages/Registration";
import Login from "./pages/Login"
import Admin from "./pages/Admin";
import '@fortawesome/fontawesome-free/css/all.min.css';
import CaretakerDashboard from "./components/CaretakerDashboard";
import PatientDashboard from "./components/PatientDashboard";
import Onboarding from "./components/Onboarding";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import PatientLogin from "./pages/PatientLogin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Onboarding />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          <Route path="/Register" element={<Registration/>}/>
          <Route path="/Login" element={<Login/>}/>
          <Route path="/PatientLogin" element={<PatientLogin/>}/>
          <Route path="/caretaker/Admin/:id" element={<Admin/>}/>
          <Route path="/caretaker/:id" element={<CaretakerDashboard/>}/>
          <Route path="/patient/:id" element={<PatientDashboard/>}/>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>

  // <Registration/>
  // <Login/>
  // <Admin/>
);

export default App;
