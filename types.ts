
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  location?: string;
  cropInterests: string[];
  photoURL?: string;
  createdAt: number;
}

export interface CropCycle {
  id: string;
  name: string;
  planting: number[]; // Months (0-11)
  growing: number[];
  harvesting: number[];
  notes: string;
  phRange: string;
  tempRange: string;
  commonPests: string[];
  description?: string;
}

export interface DiseaseResult {
  cropName: string;
  diseaseName: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  explanation: string;
  chemicalRemedy: {
    products: string[];
    instructions: string;
    precautions: string;
  };
  organicRemedy: {
    treatment: string;
    preparation: string;
    application: string;
  };
  timestamp: number;
  imageUrl?: string;
}

export interface SoilAnalysisInput {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  soilType: 'Sandy' | 'Clay' | 'Loamy' | 'Silty';
  weather: string;
}

export interface CropSuggestion {
  suitableCrops: string[];
  yieldPotential: string;
  fertilizerSuggestions: string[];
  warnings: string[];
  reasoning: string;
}

export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  description: string;
  windSpeed: number;
  precipitation: number;
  weatherCode: number;
  updatedAt: number;
  forecast: {
    hourly: Array<{
      time: string;
      temperature: number;
    }>;
    daily: Array<{
      date: string;
      maxTemp: number;
      minTemp: number;
      description: string;
      precipitation: number;
    }>;
  };
}
