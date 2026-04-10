import type { UUID } from "crypto";

export interface Place {
  id: UUID;
  name: string;
  icon: string;
  verified: boolean;
  address: string;
  description: string;
  latitude: number;
  longitude: number;
}
