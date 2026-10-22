import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import type { IMember, IStaffMembers, userRole } from "../types/users";

type StaffType = "rescue_operator" | "manager";

interface RegisterStaffData {
  personId: number;
  staffType: StaffType;
}

interface IUserDetails extends IStaffMembers {
  role: userRole;
}

export const useAdminActions = (userId?: number) => {
  const queryClient = useQueryClient();

  // ---------- mutations ----------
  const registerStaffMutation = useMutation({
    mutationFn: ({ personId, staffType }: RegisterStaffData) =>
      registerStaff(personId, staffType),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["community-members"] });
      queryClient.invalidateQueries({ queryKey: ["recent-staff"] });
      queryClient.invalidateQueries({ queryKey: ["staff-members"] });

      toast.success(data.message, { duration: 4000 });
    },

    onError: (error) => {
      let message: string;
      if (isAxiosError(error)) {
        message = error.response?.data?.message ?? "Something went wrong.";
      } else {
        message = "Unexpected error has occurred, please try again";
      }
      toast.error(message);
    },
  });

  // ---------- queries ----------
  const membersQuery = useQuery<IMember[]>({
    queryKey: ["community-members"],
    queryFn: getAllPersons,
  });

  const recentStaffQuery = useQuery<IStaffMembers[]>({
    queryKey: ["recent-staff"],
    queryFn: getRecentStaff,
  });

  const staffMembersQuery = useQuery<IStaffMembers[]>({
    queryKey: ["staff-members"],
    queryFn: getStaffMembers,
  });

  const userDetailsQuery = useQuery<IUserDetails>({
    queryKey: ["userDetails", userId],
    queryFn: () => getUserDetails(userId!),
    enabled: userId !== undefined,
  });

  return {
    registerStaffMutation,
    membersQuery,
    recentStaffQuery,
    staffMembersQuery,
    userDetailsQuery,
  };
};

// ---------- api calls ----------
async function registerStaff(personId: number, staffType: StaffType) {
  const res = await axiosInstance.post(`/admin/register-staff/${personId}`, {
    staffType,
  });
  return res.data;
}

async function getAllPersons() {
  const res = await axiosInstance.get(`/admin/members`);
  return res.data;
}

async function getRecentStaff() {
  const res = await axiosInstance.get(`/admin/recent-staff`);
  return res.data;
}

async function getStaffMembers() {
  const res = await axiosInstance.get(`/admin/staff-members`);
  return res.data;
}

async function getUserDetails(userId: number) {
  const res = await axiosInstance.get(`/admin/user/${userId}`);
  return res.data;
}
