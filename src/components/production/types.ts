export type ValueType = 'units' | 'money';
export type DiscountType = 'percentage' | 'money';

export interface RawMaterialState {
  // Initial Inventory
  initialInventoryType: ValueType;
  initialInventoryUnits: number;
  initialInventoryMoney: number;
  initialInventoryUnitCost: number;
  
  // Purchases
  purchaseType: ValueType;
  purchaseUnits: number;
  purchaseMoney: number;
  purchaseUnitCost: number;
  
  // Purchase Expenses (only money)
  purchaseExpenses: number;
  
  // Purchase Returns
  purchaseReturnsType: ValueType;
  purchaseReturnsUnits: number;
  purchaseReturnsMoney: number;
  purchaseReturnsUnitCost: number;
  
  // Purchase Discounts
  purchaseDiscountsType: DiscountType;
  purchaseDiscountsPercentage: number;
  purchaseDiscountsMoney: number;
  
  // Selected inventory method
  inventoryMethod: 'promedio' | 'peps' | 'ueps';
}

export const initialRawMaterialState: RawMaterialState = {
  initialInventoryType: 'units',
  initialInventoryUnits: 0,
  initialInventoryMoney: 0,
  initialInventoryUnitCost: 0,
  
  purchaseType: 'units',
  purchaseUnits: 0,
  purchaseMoney: 0,
  purchaseUnitCost: 0,
  
  purchaseExpenses: 0,
  
  purchaseReturnsType: 'units',
  purchaseReturnsUnits: 0,
  purchaseReturnsMoney: 0,
  purchaseReturnsUnitCost: 0,
  
  purchaseDiscountsType: 'money',
  purchaseDiscountsPercentage: 0,
  purchaseDiscountsMoney: 0,
  
  inventoryMethod: 'promedio',
};
