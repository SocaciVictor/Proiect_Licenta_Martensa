export interface StoreResponse {
  id: number;
  name: string;
  location: string; // format "lat,lng"
  openingHours: string;
  contactNumber: string;
  managerName: string;
  availableServices: string;
}
