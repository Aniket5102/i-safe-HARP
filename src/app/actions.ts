
'use server';

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

// This type is based on the successful API response
type ApiUser = {
  SUCCESS: '1' | '0';
  EmployeeID: string;
  EmployeeName: string;
  ResponseMessage: string;
};

// This is the user object structure the application will use internally
export type User = {
  id: string;
  name: string;
  email: string; // email will be derived or dummy
  role: string; // role will be derived
  employeeId: string;
};

// Generic function to save different types of incidents (PostgreSQL logic remains for these)
export async function saveIncident(
  tableName: string,
  incidentData: Record<string, any>
): Promise<{ success: boolean; message: string }> {
  // This function is kept for other parts of the app that might use it, but will be removed in a future step
  console.log(`Saving to ${tableName}`, incidentData);
  return { success: true, message: 'Incident saved successfully (mocked).' };
}

export async function saveUser(
  newUser: any
): Promise<{ success: boolean; message: string }> {
  // This function is no longer used for authentication but is kept to avoid breaking the signup page for now.
  console.log('saveUser is not implemented with API authentication', newUser);
  return {
    success: false,
    message: 'Signup is not supported with this authentication method.',
  };
}

export async function findUser(credentials: {
  employeeId: string;
  password?: string;
}): Promise<User | null> {
  const { employeeId, password } = credentials;

  if (!password) {
    return null;
  }

  const apiKey = '60DowlNCn52tstim7bdyfQqbImH9illP';
  const appName = 'django';
  const url = `https://api.asianpaints.com/generic/v1/login_ad?apikey=${apiKey}&appname=${appName}`;

  const credentialsB64 = btoa(`${employeeId}:${password}`);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentialsB64}`,
        'Content-Type': 'application/json',
      },
    });

    const data: ApiUser = await response.json();

    if (data.SUCCESS === '1') {
      // API call was successful, transform the API response to our internal User type
      const user: User = {
        id: data.EmployeeID,
        employeeId: data.EmployeeID,
        name: data.EmployeeName.split(' [')[0], // Extract name from "Aniket Khaladkar [P00126717]"
        // Create a dummy email as it's required by our context, but not provided by the API
        email: `${data.EmployeeID}@asianpaints.com`, 
        // Determine role based on API data if possible, otherwise default
        role: data.EmployeeName.includes(data.EmployeeID) ? 'Admin' : 'Client',
      };
      return user;
    } else {
      // API returned a failed login attempt
      console.error('API Login Error:', data.ResponseMessage);
      return null;
    }
  } catch (error) {
    console.error('Error calling authentication API:', error);
    return null;
  }
}
