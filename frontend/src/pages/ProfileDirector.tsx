import { useAuthStore } from "../store/useAuthStore";
import AdminProfilePage from "./adminPages/AdminProfilePage";
import ManagerProfile from "./managerPages/ManagerProfile";
import PetOwnerProfile from "./pet/PetOwnerProfile";
import ROProfilePage from "./roPages/ROProfilePage";

function ProfileDirector() {
  const { user } = useAuthStore();

  switch (user?.role) {
    case "it_admin":
      return <AdminProfilePage />;
    case "manager":
      return <ManagerProfile />;
    case "rescue_operator":
      return <ROProfilePage />;
    case "pet_owner":
      return <PetOwnerProfile />;
    default:
      return <p>Other profiles</p>;
  }
}

export default ProfileDirector;
