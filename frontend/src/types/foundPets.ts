export interface FoundPetsResponse {
  message: string;
  foundPets: FoundPet[];
}

export interface FoundPet {
  found_pet_id: number;
  pet_id: number;
  reporter_id: number;
  location_id: number;

  date_found: string; // ISO date string
  description: string;
  status: "found" | "claimed";

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

  person_id: number;
  firstname: string;
  lastname: string;
  email: string;
}
