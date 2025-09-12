import { promises as fs } from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export interface Disease {
  name: string;
  symptoms: string[];
  description?: string;
  precautions?: string[];
  severity?: { [symptom: string]: number };
}

export class HealthDataService {
  private static instance: HealthDataService;
  private diseases: Map<string, Disease> = new Map();
  private symptomsToDisease: Map<string, string[]> = new Map();
  private symptomSeverity: Map<string, number> = new Map();

  private constructor() {}

  public static getInstance(): HealthDataService {
    if (!HealthDataService.instance) {
      HealthDataService.instance = new HealthDataService();
    }
    return HealthDataService.instance;
  }

  async initialize() {
    const archivePath = path.join(process.cwd(), 'archive');

    // Load disease-symptom relationships
    const diseaseData = await this.readCSV(path.join(archivePath, 'dataset.csv'));
    for (const row of diseaseData) {
      const disease = row['Disease'];
      const symptoms = Object.entries(row)
        .filter(([key, value]) => key.startsWith('Symptom_') && value)
        .map(([_, value]) => value as string);
      
      this.diseases.set(disease, { name: disease, symptoms });
      
      // Create reverse mapping of symptoms to diseases
      symptoms.forEach(symptom => {
        const diseases = this.symptomsToDisease.get(symptom) || [];
        if (!diseases.includes(disease)) {
          diseases.push(disease);
          this.symptomsToDisease.set(symptom, diseases);
        }
      });
    }

    // Load disease descriptions
    const descriptionData = await this.readCSV(path.join(archivePath, 'symptom_Description.csv'));
    for (const row of descriptionData) {
      const disease = row['Disease'];
      const description = row['Description'];
      const diseaseData = this.diseases.get(disease);
      if (diseaseData) {
        diseaseData.description = description;
      }
    }

    // Load disease precautions
    const precautionData = await this.readCSV(path.join(archivePath, 'symptom_precaution.csv'));
    for (const row of precautionData) {
      const disease = row['Disease'];
      const precautions = [
        row['Precaution_1'],
        row['Precaution_2'],
        row['Precaution_3'],
        row['Precaution_4']
      ].filter(Boolean);
      
      const diseaseData = this.diseases.get(disease);
      if (diseaseData) {
        diseaseData.precautions = precautions;
      }
    }

    // Load symptom severity
    const severityData = await this.readCSV(path.join(archivePath, 'symptom-severity.csv'));
    for (const row of severityData) {
      const symptom = row['Symptom'];
      const weight = parseInt(row['weight'], 10);
      this.symptomSeverity.set(symptom, weight);
    }
  }

  private async readCSV(filePath: string): Promise<any[]> {
    const content = await fs.readFile(filePath, 'utf-8');
    return parse(content, {
      columns: true,
      skip_empty_lines: true,
    });
  }

  findDiseasesBySymptoms(symptoms: string[]): Disease[] {
    const possibleDiseases = new Map<string, number>();
    
    symptoms.forEach(symptom => {
      const diseases = this.symptomsToDisease.get(symptom) || [];
      diseases.forEach(disease => {
        const count = possibleDiseases.get(disease) || 0;
        possibleDiseases.set(disease, count + 1);
      });
    });

    return Array.from(possibleDiseases.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([diseaseName]) => this.diseases.get(diseaseName)!)
      .filter(Boolean);
  }

  getDisease(name: string): Disease | undefined {
    return this.diseases.get(name);
  }

  getSymptomSeverity(symptom: string): number {
    return this.symptomSeverity.get(symptom) || 0;
  }

  getAllSymptoms(): string[] {
    return Array.from(this.symptomsToDisease.keys());
  }
}
