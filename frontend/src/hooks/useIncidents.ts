import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import type { MissingPetResponse } from "../types/missingPets";
import type { FoundPetsResponse } from "../types/foundPets";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";

interface IReportPet {
  petId: number;
  locationId: number;
  description?: string;
}

export const useIncidents = () => {
  const queryClient = useQueryClient();

  // ---------- queries ----------
  const LostPetsQuery = useQuery<MissingPetResponse>({
    queryKey: ["lost-pets"],
    queryFn: getLostPets,
  });

  const FoundPetsQuery = useQuery<FoundPetsResponse>({
    queryKey: ["found-pets"],
    queryFn: getFoundPets,
  });

  // ---------- mutations ----------
  const reportPetMutation = useMutation({
    mutationFn: (data: IReportPet) => reportFoundPet(data),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lost-pets"] });
      queryClient.invalidateQueries({ queryKey: ["found-pets"] });
      queryClient.invalidateQueries({ queryKey: ["my-pets"] });
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
    LostPetsQuery,
    FoundPetsQuery,
    reportPetMutation,
  };
};

// ---------- api calls ----------
async function getLostPets() {
  const res = await axiosInstance.get("/incidents/lost-pets");
  return res.data;
}

async function getFoundPets() {
  const res = await axiosInstance.get("/incidents/found-pets");
  return res.data;
}

async function reportFoundPet(data: IReportPet) {
  const res = await axiosInstance.post("/incidents/report-pet", data);
  return res.data;
}
