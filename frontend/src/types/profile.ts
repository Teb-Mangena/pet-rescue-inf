import type { userRole } from "./users";

export interface IProfile {
  person_id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: userRole;
  location_id: number | null;
  npo_spca_id: number;
  npo_spca_name: string;
  org_email: string;
  org_phone: string;
  org_location_id: number;
  org_street: string;
  org_neighbourhood_id: number;
  org_neighbourhood: string;
  org_city_id: number;
  org_city: string;
}

export interface ProfileResponse {
  profile: IProfile;
}

export interface UserProfile {
  person_id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: userRole;
  location_id: number | null;
  street: string | null;
  neighbourhood_id: number | null;
  neighbourhood_name: string | null;
  city_id: number | null;
  city_name: string | null;
}

export interface UserProfileResponse {
  message: string;
  user: UserProfile;
}
