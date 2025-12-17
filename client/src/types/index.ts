export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category_name: string;
}

export interface Category {
  name: string;
  total: number;
  count: number;
  percentage: string;
}

export interface Summary {
  totalExpenses: string;
  totalIncome: string;
  balance: string;
  transactionCount: number;
}

export interface AnalyticsResponse {
  categories: Category[];
  summary: Summary;
}
