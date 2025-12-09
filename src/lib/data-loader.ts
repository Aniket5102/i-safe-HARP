
'use server';

import fs from 'fs/promises';
import path from 'path';

async function readJsonFile(filePath: string) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const fileContent = await fs.readFile(fullPath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error reading or parsing file at ${filePath}:`, error);
    return [];
  }
}

export async function getHarpIncidents() {
  return readJsonFile('src/lib/data/harp-incidents.json');
}

export async function getBbsObservations() {
    return readJsonFile('src/lib/data/bbs-observations.json');
}

export async function getQualitySusaIncidents() {
    return readJsonFile('src/lib/data/quality-susa-incidents.json');
}
