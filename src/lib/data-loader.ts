
'use server';

import { getDbPool } from '@/lib/db';

async function queryDatabase(query: string, params: any[] = []) {
  const pool = getDbPool();
  try {
    const res = await pool.query(query, params);
    return res.rows;
  } catch (error) {
    console.error(`Error executing query:`, error);
    return [];
  }
}

export async function getHarpIncidents() {
  return queryDatabase('SELECT * FROM harp_incidents ORDER BY date DESC');
}

export async function getBbsObservations() {
  const observations = await queryDatabase('SELECT * FROM bbs_observations ORDER BY "observationdate" DESC');
  // The database returns a full data object for each row, we need to restructure it to match the old format
  return observations.map(obs => ({
    id: obs.id,
    data: {
      observerName: obs.observername,
      location: obs.location,
      observationDate: obs.observationdate,
      taskObserved: obs.taskobserved,
      properUseOfPPE: obs.properuseofppe,
      bodyPositioning: obs.bodypositioning,
      toolAndEquipmentHandling: obs.toolandequipmenthandling,
      comments: obs.comments,
    }
  }));
}

export async function getQualitySusaIncidents() {
  return queryDatabase('SELECT * FROM quality_susa_incidents ORDER BY date DESC');
}
