import { Budget, Settings, Transaction, User } from "@prisma/client";

type BudgetExt = Budget & {
  transactions: Transaction[];
};

type UserExt = User & {
  budgets: BudgetExt[];
  settings: Settings;
};

type TransactionType = "income" | "expense";

type CategorySummary = {
  categoryId: string;
  type: string;
  amount: number;
};

type Category = {
  id: string;
  icon: string;
  name: string;
  type: string;
};
