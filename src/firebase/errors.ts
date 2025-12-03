
export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
  public context: SecurityRuleContext;
  
  constructor(context: SecurityRuleContext) {
    const userMessage = `FirestoreError: Missing or insufficient permissions: The following request was denied by Firestore Security Rules:`;
    super(userMessage);
    this.name = 'FirestorePermissionError';
    this.context = context;
    
    // This makes the error message more readable in the console by appending the context.
    this.message = `${userMessage}\n${JSON.stringify(this.context, null, 2)}`;
  }
}
