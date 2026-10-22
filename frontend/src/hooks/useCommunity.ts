import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import type { MissingPetResponse } from "../types/missingPets";
import type { FoundPetsResponse } from "../types/foundPets";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";

export const useCommunity = () => {
  const queryClient = useQueryClient();

  const allMissingPetsQuery = useQuery<MissingPetResponse>({
    queryKey: ["all-missing-pets"],
    queryFn: getAllMissingPets,
  });

  const allFoundPetsQuery = useQuery<FoundPetsResponse>({
    queryKey: ["all-found-pets"],
    queryFn: getAllFoundPets,
  });

  // MUTATIONS
  const reportFoundPetMutation = useMutation({
    mutationFn: (data: FoundPetData) => reportFoundPet(data),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["all-missing-pets"] });
      queryClient.invalidateQueries({ queryKey: ["all-found-pets"] });
      toast.success(data.message);
    },

    onError: (error) => {
      let message;
      if (isAxiosError(error)) message = error.response?.data.message;
      else message = "Unexpected error occured - please try again";
      toast.error(message);
    },
  });

  return {
    allMissingPetsQuery,
    allFoundPetsQuery,
    reportFoundPetMutation,
  };
};

async function getAllMissingPets() {
  const res = await axiosInstance.get("/incidents/lost-pets");
  return res.data;
}

async function getAllFoundPets() {
  const res = await axiosInstance.get("/incidents/found-pets");
  return res.data;
}

interface FoundPetData {
  petId: number;
  locationId: number;
  description: string;
}

async function reportFoundPet(data: FoundPetData) {
  const res = await axiosInstance.post("/incidents/found-pet", data);
  return res.data;
}
