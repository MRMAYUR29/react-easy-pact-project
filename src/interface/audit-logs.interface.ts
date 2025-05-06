import { IUserProps } from "./user.interface";

export interface IActivityLog {
     _id: string
     session_id: string; // Reference to the session
     action: 'CREATE' | 'UPDATE' | 'DELETE' | 'ASSIGN'; // Action type
     module: 'Users' | 'DemoProducts' | 'User DemoMapping'; // Module name
     performed_by: IUserProps; // Reference to the user who performed the action
     target_id: string; // Reference to the target document
     created_at?: Date; // Optional field for creation date
}