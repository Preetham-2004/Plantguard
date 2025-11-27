/*
  # PlantGuard AI Database Schema

  1. New Tables
    - `disease_catalog` - Disease reference data
      - `id` (uuid, primary key)
      - `name` (text, disease name)
      - `description` (text)
      - `stages` (jsonb, stages 1-4 data)
      - `treatment` (jsonb, treatment recommendations)
      - `created_at` (timestamp)

    - `plant_species` - Supported plant types
      - `id` (uuid, primary key)
      - `name` (text, species name)
      - `scientific_name` (text)
      - `description` (text)
      - `common_diseases` (uuid array, disease IDs)
      - `created_at` (timestamp)

    - `analyses` - User analysis history
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `plant_species_id` (uuid, foreign key)
      - `disease_id` (uuid, foreign key)
      - `disease_stage` (integer, 1-4)
      - `severity` (text, Low/Medium/High/Critical)
      - `confidence_score` (numeric)
      - `image_url` (text)
      - `segmentation_data` (jsonb, segmentation results)
      - `treatment_applied` (text)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Users can only view their own analyses
    - Public access to disease_catalog and plant_species
*/

CREATE TABLE IF NOT EXISTS disease_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  stages jsonb DEFAULT '{"stage1": {}, "stage2": {}, "stage3": {}, "stage4": {}}'::jsonb,
  treatment jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS plant_species (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  scientific_name text,
  description text,
  common_diseases uuid[] DEFAULT ARRAY[]::uuid[],
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plant_species_id uuid REFERENCES plant_species(id),
  disease_id uuid REFERENCES disease_catalog(id),
  disease_stage integer CHECK (disease_stage >= 1 AND disease_stage <= 4),
  severity text CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
  confidence_score numeric(5,2) CHECK (confidence_score >= 0 AND confidence_score <= 100),
  image_url text,
  segmentation_data jsonb DEFAULT '{}'::jsonb,
  treatment_applied text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE disease_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE plant_species ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view diseases"
  ON disease_catalog
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can view plant species"
  ON plant_species
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can view own analyses"
  ON analyses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create analyses"
  ON analyses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analyses"
  ON analyses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own analyses"
  ON analyses
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analyses_plant_species ON analyses(plant_species_id);
