import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";

export const useHandovers = () => {
  const queryClient = useQueryClient();

  const myHandoversQuery = useQuery<HandoverResponse>({
    queryKey: ["my-handovers"],
    queryFn: getMyHandOvers,
  });

  const createHandoverMutation = useMutation({
    mutationFn: (data: IHandoverData) => createHandover(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["my-handovers"] });
      toast.success(data.message);
    },
    onError: (error) => {
      let message: string;
      if (isAxiosError(error)) {
        message = error.response?.data?.message ?? "Request failed";
      } else {
        message = "Unexpected error occurred — please try again";
      }
      toast.error(message);
    },
  });

  return {
    myHandoversQuery,
    createHandoverMutation,
  };
};

// ---------- TYPES ----------
export interface Handover {
  handover_id: number;
  pet_id: number;
  npo_spca_id: number;
  handover_date: string;
  reason: string;
  status: "pending" | "accepted" | "rejected" | "completed" | "cancelled";
  species_name: string;
  colour_name: string;
  pet_image_url: string;
  npo_spca_name: string;
  organization_email: string;
  organization_phone: string;
  organization_location_id: number;
  organization_street: string;
  organization_neighbourhood_id: number;
  organization_neighbourhood: string;
  organization_city_id: number;
  organization_city: string;
}

export interface HandoverResponse {
  message: string;
  handovers: Handover[];
}

interface IHandoverData {
  petId: string;
  npoSpcaId: string;
  reason: string;
}

// ---------- API CALLS ----------
async function getMyHandOvers() {
  const res = await axiosInstance.get("/handover/my");
  return res.data;
}

async function createHandover(data: IHandoverData) {
  const res = await axiosInstance.post("/handover", data);
  return res.data;
}
