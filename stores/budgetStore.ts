import { getSummary } from "@/actions/transactionActions";
import { BudgetSummary } from "@/components/Overview";
import { Budget, Category } from "@prisma/client";
import { DateRange } from "react-day-picker";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { startOfMonth } from "date-fns";
import { getCategories, getCategorySummary } from "@/actions/categoryActions";
import { z } from "zod";
import { CategorySummary } from "@/types";

export type BudgetState = {
  categories: Category[];
  budget: Budget;
  budgetSummary: BudgetSummary;
  categorySummary: CategorySummary[];
};

export type BudgetActions = {
  setBudget: (budget: Budget) => void;
  setCategories: () => void;
  setBudgetSummary: ({
    budgetId,
    date,
  }: {
    budgetId: string;
    date?: DateRange;
  }) => void;
  setCategorySummary: ({
    budgetId,
    date,
  }: {
    budgetId: string;
    date?: DateRange;
  }) => void;
};

export type BudgetStore = BudgetState & BudgetActions;

export const useBudgetStore = create<BudgetStore>()(
  persist(
    (set, get) => ({
      budget: {} as Budget,
      budgetSummary: {} as BudgetSummary,
      categorySummary: [] as CategorySummary[],
      categories: [] as Category[],

      setBudget: (budget: Budget) => {
        set(() => ({
          budget,
        }));
      },

      /*****************SET CATEGORIES******************************** */
      setCategories: async () => {
        const response = await getCategories();
        if (response.success && response.data) {
          console.log("categories", response.data);
          const categories = response.data as Category[];
          set(() => ({
            categories,
          }));
        }
      },

      /*****************SET BUDGET SUMMARY******************************** */
      setBudgetSummary: async ({
        budgetId,
        date = { from: startOfMonth(new Date()), to: new Date() },
      }: {
        budgetId: string;
        date?: DateRange;
      }) => {
        const response = await getSummary({ budgetId, date });
        if (response.success && response.data) {
          const expense =
            response.data.find((item) => item.type === "expense")?._sum
              .amount ?? 0;
          const income =
            response.data.find((item) => item.type === "income")?._sum.amount ??
            0;
          set(() => ({
            budgetSummary: { expense, income },
          }));
        }
      },

      /*****************SET CATEGORY SUMMARY******************************** */
      setCategorySummary: async ({
        budgetId,
        date = { from: startOfMonth(new Date()), to: new Date() },
      }: {
        budgetId: string;
        date?: DateRange;
      }) => {
        const response = await getCategorySummary({ budgetId, date });
        if (response.success && response.data) {
          const summary = response.data.map((item) => {
            return {
              categoryId: item.categoryId,
              type: item.type,
              amount: item._sum.amount,
            };
          }) as CategorySummary[];

          set(() => ({
            categorySummary: summary,
          }));
        }
      },
    }),
    {
      name: "food-storage",
    }
  )
);
