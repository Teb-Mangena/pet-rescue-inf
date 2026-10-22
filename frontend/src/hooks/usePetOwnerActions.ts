import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../config/axios";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import type { PetResponse } from "../types/pets";
import type { MissingPetResponse } from "../types/missingPets";

function handleMutationError(error: unknown) {
  let message: string;
  if (isAxiosError(error)) {
    message = error.response?.data?.message ?? "Request failed";
  } else {
    message = "Unexpected error occurred - please try again";
  }
  toast.error(message);
}

export const usePetOwnerActions = () => {
  const queryClient = useQueryClient();

  const myPetsQuery = useQuery<PetResponse>({
    queryKey: ["my-pets"],
    queryFn: getMyPets,
  });

  const myLostPetsQuery = useQuery<MissingPetResponse>({
    queryKey: ["my-lost-pets"],
    queryFn: getMyLostPets,
  });

  const registerPetMutation = useMutation({
    mutationFn: (data: PetRegister) => registerPet(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["my-pets"] });
      toast.success(data.message);
    },
    onError: handleMutationError,
  });

  // --- Report one of my pets as lost ---
  const reportMyLostPetMutation = useMutation({
    mutationFn: (data: ReportPetData) => reportMyLostPets(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["my-lost-pets"] });
      queryClient.invalidateQueries({ queryKey: ["my-pets"] });
      toast.success(data.message);
    },
    onError: handleMutationError,
  });

  // --- Update a pet's details ---
  const updateMyPetMutation = useMutation({
    mutationFn: ({ data, petId }: { data: PetUpdateData; petId: number }) =>
      updateMyPet(data, petId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["my-pets"] });
      queryClient.invalidateQueries({ queryKey: ["my-lost-pets"] });
      toast.success(data.message);
    },
    onError: handleMutationError,
  });

  // --- Delete one of my pets ---
  const deleteMyPetMutation = useMutation({
    mutationFn: (petId: number) => deleteMyPet(petId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["my-pets"] });
      queryClient.invalidateQueries({ queryKey: ["my-lost-pets"] });
      toast.success(data.message);
    },
    onError: handleMutationError,
  });

  return {
    myPetsQuery,
    myLostPetsQuery,
    registerPetMutation,
    reportMyLostPetMutation,
    updateMyPetMutation,
    deleteMyPetMutation,
  };
};

interface PetRegister {
  pet_name: string;
  speciesId: number;
  colorId: number;
  description: string;
  image: File;
}

interface ReportPetData {
  petId: number;
  locationId: number;
}

interface PetUpdateData {
  pet_name: string;
  pet_description: string;
}

async function registerPet(data: PetRegister) {
  const formData = new FormData();
  formData.append("pet_name", data.pet_name);
  formData.append("speciesId", String(data.speciesId));
  formData.append("colorId", String(data.colorId));
  formData.append("description", data.description);
  formData.append("image", data.image);

  // Let axios set the correct boundary — do NOT manually set
  // Content-Type: multipart/form-data
  const res = await axiosInstance.post("/pet-owner/register-pet", formData);
  return res.data;
}

async function getMyPets() {
  const res = await axiosInstance.get("/pet-owner/my-pets");
  return res.data;
}

async function getMyLostPets() {
  const res = await axiosInstance.get("/pet-owner/my-lost-pets");
  return res.data;
}

async function reportMyLostPets(data: ReportPetData) {
  const res = await axiosInstance.post("/pet-owner/report-lost", data);
  return res.data;
}

async function deleteMyPet(petId: number) {
  const res = await axiosInstance.delete(`/pet-owner/pets/${petId}`);
  return res.data;
}

async function updateMyPet(data: PetUpdateData, petId: number) {
  const res = await axiosInstance.patch(`/pet-owner/pets/${petId}`, data);
  return res.data;
}
