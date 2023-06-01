import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import Explore from "./pages/Explore";
import Offers from "./pages/Offers";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import PrivateRoute from "./components/PrivateRoute";
import Catefory from "./pages/Catefory";
import CreateListing from "./pages/CreateListing";
import Listing from "./pages/Listing";
import Contact from "./pages/Contact";
import EditListing from "./pages/EditListing";
function App() {
  return (
    <>
<Router>
  <Routes>
    <Route path="/" element={<Explore/>}/>
    <Route path="/offers" element={<Offers/>}/>
    <Route path="/category/:categoryname" element={<Catefory/>}/>
    <Route path="/profile" element={<PrivateRoute/>}>
    <Route path="/profile" element={<Profile/>}/>
      
      </Route>
    <Route path="/sign-in" element={<SignIn/>}/>
    <Route path="/sign-up" element={<SignUp/>}/>
    <Route path="/forgot-password" element={<ForgotPassword/>}/>
    <Route path="/create-listing" element={<CreateListing/>}/>
    <Route path="/category/:categoryname/:listingid" element={<Listing/>}/>
    <Route path="/contact/:landlordid" element={<Contact/>}/>
    <Route path="/edit-listing/:listingid" element={<EditListing/>}/>


  </Routes>
  <Navbar/>
</Router>
<ToastContainer/>
    </>
  );
}

export default App;
