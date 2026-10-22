import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import type { IOrgStaff } from "../types/users";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";

export const useManagerActions = () => {
  const queryClient = useQueryClient();

  const staffQuery = useQuery<IOrgStaff[]>({
    queryKey: ["manager-staff"],
    queryFn: getStaff,
  });

  const handoversQuery = useQuery<HandoversResponse>({
    queryKey: ["manager-handovers"],
    queryFn: getOrgHandovers,
  });

  const updateHandoverStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      updateHandoverStatus(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["manager-handovers"] });
      toast.success(data.message);
    },
    onError: (error) => {
      let message: string;
      if (isAxiosError(error)) {
        message = error.response?.data?.message ?? "Failed to update status";
      } else {
        message = "Unexpected error occurred";
      }
      toast.error(message);
    },
  });

  return {
    staffQuery,
    handoversQuery,
    updateHandoverStatusMutation,
  };
};

// ---------- TYPES ----------
export interface HandoverData {
  handover_id: number;
  pet_id: number;
  handover_date: string;
  reason: string;
  status: "pending" | "accepted" | "rejected" | "completed" | "cancelled";
  species_name: string;
  colour_name: string;
  pet_image_url: string;
  pet_name: string;
  member_firstname: string;
  member_lastname: string;
  member_email: string;
}

export interface HandoversResponse {
  message: string;
  handovers: HandoverData[];
}

// ---------- API CALLS ----------
async function getStaff() {
  const res = await axiosInstance.get("/manager/staff");
  return res.data;
}

async function getOrgHandovers() {
  const res = await axiosInstance.get("/manager/handovers");
  return res.data;
}

async function updateHandoverStatus(id: number, status: string) {
  const res = await axiosInstance.patch(`/manager/handovers/${id}/status`, {
    status,
  });
  return res.data;
}
