
export interface Profile {
  id: string;
  name: string;
  currency: string;
  iconName?: string;
  hasPassword?: boolean;
  password?: string;
  lastActive?: Date;
}

// Profile data is separated from profile metadata
export interface ProfileData {
  transactions?: any[];
  accounts?: any[];
  inventory?: any[];
  settings?: any;
}
