export type userRole =
  | "community_member"
  | "pet_owner"
  | "rescue_operator"
  | "it_admin"
  | "manager";

export interface IUser {
  person_id: number;
  email: string;
  firstname: string;
  lastname: string;
  role: userRole;
  location_id: number;
  profileImage?: string;
}

export interface CheckAuthResponse {
  message: string;
  user: IUser;
}

export interface LoginResponse {
  message: string;
  user: IUser;
}

export interface SignupResponse {
  message: string;
  user: IUser;
}

export interface LogoutResponse {
  message: string;
}

export interface IMember {
  person_id: number;
  email: string;
  firstname: string;
  lastname: string;
  profileImage: string;
}

export interface IStaffMembers {
  person_id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  profileImage: string | null;
  location_id: number | null;
  npo_spca_id: number;
}

// MANAGER
export interface IOrgStaff {
  person_id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: userRole;
  npo_spca_id: number;
}
