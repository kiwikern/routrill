export interface Place {
  name: string;
  id: string;
  elevation?: number;
  location?: {
    lat: number;
    lng: number;
  };
}
