import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import type { PetDetailsResponse } from "../types/pets";

export const usePetProfile = (petId: number) => {
  const petProfileQuery = useQuery<PetDetailsResponse>({
    queryKey: ["pet-details", petId],
    queryFn: () => getPetProfile(petId),
    enabled: !!petId,
  });

  return { petProfileQuery };
};

async function getPetProfile(petId: number) {
  const res = await axiosInstance.get(`/pets/${petId}`);
  return res.data;
}
