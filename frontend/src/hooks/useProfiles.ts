import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import type { ProfileResponse, UserProfileResponse } from "../types/profile";

export const useProfiles = () => {
  const managerProfileQuery = useQuery<ProfileResponse>({
    queryKey: ["manager-profile"],
    queryFn: getManagerProfile,
  });

  const ROProfileQuery = useQuery<ProfileResponse>({
    queryKey: ["ro-profile"],
    queryFn: getROProfile,
  });

  const profileQuery = useQuery<ProfileResponse>({
    queryKey: ["admin-profile"],
    queryFn: getAdminProfile,
  });

  const userProfileQuery = useQuery<UserProfileResponse>({
    queryKey: ["my-profile"],
    queryFn: getMyProfile,
  });

  return {
    managerProfileQuery,
    ROProfileQuery,
    profileQuery,
    userProfileQuery,
  };
};

async function getManagerProfile() {
  const res = await axiosInstance.get("/manager/profile");
  return res.data;
}

async function getROProfile() {
  const res = await axiosInstance.get("/rescue-operator/profile");
  return res.data;
}

async function getAdminProfile() {
  const res = await axiosInstance.get("/admin/profile");
  return res.data;
}

async function getMyProfile() {
  const res = await axiosInstance.get("/pet-owner/profile");
  return res.data;
}
