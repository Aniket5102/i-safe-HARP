'use server';

import fs from 'fs/promises';
import path from 'path';

type Incident = {
  id: string;
  [key: string]: any;
};

export async function saveIncident(
  filePath: string,
  newIncident: Incident
): Promise<{ success: boolean; message: string }> {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    let data: Incident[] = [];

    try {
      const fileContent = await fs.readFile(fullPath, 'utf-8');
      data = JSON.parse(fileContent);
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
      // File doesn't exist, will be created.
    }

    data.unshift(newIncident);

    await fs.writeFile(fullPath, JSON.stringify(data, null, 2), 'utf-8');

    return { success: true, message: 'Incident saved successfully.' };
  } catch (error: any) {
    console.error('Error saving incident:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred.',
    };
  }
}
