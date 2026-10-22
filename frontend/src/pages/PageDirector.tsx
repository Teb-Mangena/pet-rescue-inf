import Admin from "../dashboards/Admin";
import CommunityMember from "../dashboards/CommunityMember";
import Manager from "../dashboards/Manager";
import PetOwner from "../dashboards/PetOwner";
import RescueOperator from "../dashboards/RescueOperator";
import { useAuthStore } from "../store/useAuthStore";
import LandingPage from "./LandingPage";

function PageDirector() {
  const { user } = useAuthStore();

  switch (user?.role) {
    case "community_member":
      return <CommunityMember />;
    case "pet_owner":
      return <PetOwner />;
    case "manager":
      return <Manager />;
    case "rescue_operator":
      return <RescueOperator />;
    case "it_admin":
      return <Admin />;
    default:
      return <LandingPage />;
  }
}

export default PageDirector;
