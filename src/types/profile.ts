
export interface Profile {
  id: string;
  name: string;
  currency: string;
  iconName?: string;
  hasPassword?: boolean;
  password?: string;
  lastActive?: Date;
}

// ProfileData almacena todos los datos específicos de cada perfil
export interface ProfileData {
  // Datos de contabilidad
  accounts?: any[];
  transactions?: any[];
  // Datos de inventario
  inventory?: {
    operations?: any[];
    currentAverageCost?: number;
    currentStock?: number;
    currentBalance?: number;
  };
  pepsInventory?: {
    operations?: any[];
    lots?: any[];
    hasInitialBalance?: boolean;
    currentBalance?: number;
  };
  uepsInventory?: {
    operations?: any[];
    lots?: any[];
    hasInitialBalance?: boolean;
    currentBalance?: number;
  };
  // Otras configuraciones específicas del perfil
  settings?: any;
}
