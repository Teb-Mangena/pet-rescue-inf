import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import PageLoader from "./components/PageLoader";
import ErrorPage from "./pages/ErrorPage";
import PageDirector from "./pages/PageDirector";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import RegisterStaff from "./pages/adminPages/RegisterStaff";
import AdminStaffMembers from "./pages/adminPages/AdminStaffMembers";
import UserDetails from "./pages/common/UserDetails";
import ProfileDirector from "./pages/ProfileDirector";
import ManagerStaff from "./pages/managerPages/ManagerStaff";
import MyPets from "./pages/owner/MyPets";
import RegisterPet from "./pages/owner/RegisterPet";
import FoundPets from "./pages/owner/FoundPets";
import MissingPets from "./pages/owner/MissingPets";
import PetDetails from "./pages/pet/PetDetails";
import ReportFoundPet from "./pages/operator/ReportFoundPet";
import ReportLost from "./pages/owner/ReportLost";
import MyHandovers from "./pages/member/Handovers";
import NewHandover from "./pages/member/NewHandover";
import ManagerHandovers from "./pages/managerPages/ManagerHandovers";

function App() {
  const { checkAuth, isCheckingAuth, user } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <PageLoader />;

  const isAuthenticated = Boolean(user);

  return (
    <div>
      <Navbar />
      <Routes>
        <Route index element={<PageDirector />} />
        <Route
          path="/login"
          element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!isAuthenticated ? <SignupPage /> : <Navigate to="/" />}
        />

        {/* ADMIN */}
        <Route
          path="/admin/staff/new"
          element={isAuthenticated ? <RegisterStaff /> : <Navigate to="/" />}
        />
        <Route
          path="/admin/staff"
          element={
            isAuthenticated ? <AdminStaffMembers /> : <Navigate to="/" />
          }
        />

        {/* MANAGER */}
        <Route
          path="/manager/staff"
          element={isAuthenticated ? <ManagerStaff /> : <Navigate to="/" />}
        />
        <Route
          path="/manager/handovers"
          element={isAuthenticated ? <ManagerHandovers /> : <Navigate to="/" />}
        />

        {/* PET OWNER */}
        <Route
          path="/owner/pets"
          element={isAuthenticated ? <MyPets /> : <Navigate to="/" />}
        />
        <Route
          path="/owner/pets/new"
          element={isAuthenticated ? <RegisterPet /> : <Navigate to="/" />}
        />
        {/* <Route
          path="/found"
          element={isAuthenticated ? <FoundPets /> : <Navigate to="/" />}
        />
        <Route
          path="/lost"
          element={isAuthenticated ? <MissingPets /> : <Navigate to="/" />}
        /> */}
        <Route
          path="/owner/report-lost"
          element={isAuthenticated ? <ReportLost /> : <Navigate to="/" />}
        />

        {/* MEMBERS */}
        <Route
          path="/community/handovers"
          element={isAuthenticated ? <MyHandovers /> : <Navigate to="/" />}
        />
        <Route
          path="/community/handovers/new"
          element={isAuthenticated ? <NewHandover /> : <Navigate to="/" />}
        />

        {/* COMMON ROUTES */}
        <Route
          path="/profile"
          element={isAuthenticated ? <ProfileDirector /> : <Navigate to="/" />}
        />

        <Route
          path="/operator/report-found"
          element={isAuthenticated ? <ReportFoundPet /> : <Navigate to="/" />}
        />

        <Route
          path="/pets/:id"
          element={isAuthenticated ? <PetDetails /> : <Navigate to="/" />}
        />

        <Route
          path="/user/:id"
          element={isAuthenticated ? <UserDetails /> : <Navigate to="/" />}
        />

        <Route
          path="/found"
          element={isAuthenticated ? <FoundPets /> : <Navigate to="/" />}
        />
        <Route
          path="/lost"
          element={isAuthenticated ? <MissingPets /> : <Navigate to="/" />}
        />

        {/* FALLBACK ROUTE */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
