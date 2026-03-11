// src/services/integrations/types.ts — Stub for future ingestion sources

export interface ScholarshipIngestionSource {
    name: string;
    fetch(): Promise<RawScholarshipData[]>;
}

export interface RawScholarshipData {
    name: string;
    officialUrl: string;
    country: string;
    providerType: string;
    degreeLevel: string;
    fundingType: string;
    openDate?: string;
    closeDate?: string;
    description?: string;
    links?: { label: string; url: string; linkType: string }[];
}
