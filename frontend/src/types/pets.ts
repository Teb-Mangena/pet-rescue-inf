export interface Pet {
  pet_id: number;
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
}

export interface PetResponse {
  message: string;
  pets: Pet[];
}

export interface PetDetails {
  pet_id: number;
  species_id: number;
  species_name: string;
  colour_id: number;
  colour_name: string;
  pet_owner_id: number;
  pet_image_id: number;
  pet_image_url: string;
  pet_status: string;
  pet_description: string;
  owner_person_id: number;
  owner_firstname: string;
  owner_lastname: string;
  owner_email: string;
}

export interface PetDetailsResponse {
  message: string;
  pet: PetDetails;
}
