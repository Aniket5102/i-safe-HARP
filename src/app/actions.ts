
'use server';

import { getDbPool } from '@/lib/db';
import type { Pool } from 'pg';

type Incident = {
  id: string;
  [key: string]: any;
};

type User = {
  id: string;
  role: string;
  employeeid: string;
  [key: string]: any;
};

type BbsObservationData = {
  observerName: string;
  location: string;
  observationDate: string;
  taskObserved: string;
  properUseOfPPE: string;
  bodyPositioning: string;
  toolAndEquipmentHandling: string;
  comments?: string;
};


// Generic function to save different types of incidents
export async function saveIncident(
  tableName: string,
  incidentData: Record<string, any>
): Promise<{ success: boolean; message: string }> {
  const pool = getDbPool();
  // Sanitize keys to be valid SQL identifiers (lowercase, no special chars)
  const keys = Object.keys(incidentData).map(key => key.toLowerCase().replace(/[^a-z0-9_]/g, ''));
  const values = Object.values(incidentData);
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

  const query = `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`;

  try {
    await pool.query(query, values);
    return { success: true, message: 'Incident saved successfully.' };
  } catch (error: any) {
    console.error(`Error saving to ${tableName}:`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred.',
    };
  }
}


export async function saveUser(
  newUser: Omit<User, 'id' | 'role'> & { id?: string; role?: string; employeeId: string; }
): Promise<{ success: boolean; message: string }> {
  const pool = getDbPool();
  const { id, name, email, password, role, employeeId } = newUser;

  const query = `
    INSERT INTO users (id, name, email, "password", role, employeeid)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (employeeid) DO NOTHING
    RETURNING *;
  `;

  try {
    await pool.query(query, [id, name, email, password, role, employeeId]);
    return { success: true, message: 'User saved successfully.' };
  } catch (error: any) {
    console.error('Error saving user:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred.',
    };
  }
}

export async function findUser(
  credentials: { employeeId: string; password?: string; }
): Promise<User | null> {
  const pool = getDbPool();
  const { employeeId, password } = credentials;

  let query;
  let queryParams;

  if (password) {
    // For login: check employeeId and password
    query = 'SELECT * FROM users WHERE employeeid = $1 AND "password" = $2';
    queryParams = [employeeId, password];
  } else {
    // For checking existence: check employeeId only
    query = 'SELECT * FROM users WHERE employeeid = $1';
    queryParams = [employeeId];
  }

  try {
    const result = await pool.query(query, queryParams);
    if (result.rows.length > 0) {
      return result.rows[0] as User;
    }
    return null;
  } catch (error) {
    console.error('Error finding user:', error);
    return null;
  }
}
