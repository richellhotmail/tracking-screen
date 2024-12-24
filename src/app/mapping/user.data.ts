interface UserData {
    applications: string[];
    dateCreated: string; // ISO string format
    groups: string[];
    password: string;
    username: string;
    id?: string; // Optional id field
  }