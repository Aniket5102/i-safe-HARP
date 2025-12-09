
'use server';

import fs from 'fs/promises';
import path from 'path';

type Incident = {
  id: string;
  [key: string]: any;
};

type User = {
  id: string;
  role: string;
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

export async function saveUser(
  newUser: User
): Promise<{ success: boolean; message: string }> {
  const filePath = 'src/lib/data/users.json';
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const dir = path.dirname(fullPath);
    let users: User[] = [];

    try {
      await fs.mkdir(dir, { recursive: true });
      const fileContent = await fs.readFile(fullPath, 'utf-8');
      users = JSON.parse(fileContent);
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }

    const existingUser = users.find(user => user.email === newUser.email);
    if (existingUser) {
      return { success: false, message: 'User with this email already exists.' };
    }

    users.push(newUser);

    await fs.writeFile(fullPath, JSON.stringify(users, null, 2), 'utf-8');

    return { success: true, message: 'User created successfully.' };
  } catch (error: any) {
    console.error('Error saving user:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred.',
    };
  }
}


export async function findUser(
  credentials: Partial<User>
): Promise<User | null> {
  const filePath = 'src/lib/data/users.json';
  const fullPath = path.join(process.cwd(), filePath);
  
  try {
    const fileContent = await fs.readFile(fullPath, 'utf-8');
    const users: User[] = JSON.parse(fileContent);
    const user = users.find(u => u.email === credentials.email && u.password === credentials.password);
    return user || null;
  } catch (error) {
    return null;
  }
}
