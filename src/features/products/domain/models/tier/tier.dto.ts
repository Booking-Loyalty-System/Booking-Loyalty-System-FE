export interface Tier {
  id: string;
  tierName: string;
  level: string;
  pointRate: number;
  bookingWindow: number;
  minPointsRequired: number;
  maintenancePoints: number;
  benefits: string[];
}

export interface CreateTierDto {
  tierName: string;
  level: string;
  pointRate: number;
  bookingWindow: number;
  minPointsRequired: number;
  maintenancePoints: number;
  benefits: string[];
}

export interface UpdateTierDto {
  tierName: string;
  level: string;
  pointRate: number;
  bookingWindow: number;
  minPointsRequired: number;
  maintenancePoints: number;
  benefits: string[];
}