export interface MissingPetResponse {
  message: string;
  missingPets: MissingPet[];
}

export interface MissingPet {
  missing_pet_id: number;
  pet_id: number;
  date_reported: string; // ISO date string
  location_id: number;
  status: "missing" | "found";

  pet_name: string;
  pet_status: string;
  pet_description: string;

  species_id: number;
  species_name: string;

  colour_id: number;
  colour_name: string;

  pet_image_id: number;
  image_url: string;
  image_file_id: string;

  street: string;

  neighbourhood_id: number;
  neighbourhood_name: string;

  city_id: number;
  city_name: string;

  pet_owner_id: number;
  person_id: number;

  firstname: string;
  lastname: string;
  email: string;
}
