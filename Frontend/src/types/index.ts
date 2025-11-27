export interface User {
  id: string;
  email: string;
  user_metadata?: Record<string, any>;
}

export interface PlantSpecies {
  id: string;
  name: string;
  scientific_name: string;
  description: string;
  common_diseases: string[];
}

export interface Disease {
  id: string;
  name: string;
  description: string;
  stages: {
    stage1: string;
    stage2: string;
    stage3: string;
    stage4: string;
  };
  treatment: Array<{
    step: number;
    action: string;
  }>;
}

export interface Analysis {
  id: string;
  user_id: string;
  plant_species_id: string;
  disease_id: string;
  disease_stage: number;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  confidence_score: number;
  image_url: string;
  segmentation_data: Record<string, any>;
  treatment_applied: string;
  notes: string;
  created_at: string;
  updated_at: string;
  plant_species?: PlantSpecies;
  disease?: Disease;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}
