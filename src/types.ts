export interface DeduccionesFijas {
  berly: number;
  myki: number;
  wili: number;
  gustavo: number;
  animacion: number;
  bajo: number;
  movilidad: number;
  viaticos: number;
}

export type ExpenseCategory = 'VIÁTICOS' | 'GASTOS IMPREVISTOS' | 'DEDUCCIÓN FIJA' | 'OTROS';

export interface Expense {
  id: string;
  date: string;
  description: string;
  category: ExpenseCategory;
  amount: number;
  isFixedDeduction?: boolean; // flag to distinguish auto-generated fixed deductions from added ones
}

export interface EventData {
  id: string;
  name: string;
  date: string;
  balance: number;
  deductions: DeduccionesFijas;
  additionalExpenses: Expense[];
}
