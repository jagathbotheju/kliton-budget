"use server";
import prisma from "@/lib/prisma";
import { NewTransactionSchema, OverviewSchema } from "@/lib/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DateRange } from "react-day-picker";
import { z } from "zod";

/******************GET TRANSACTION SUMMARY********************************** */
export const getSummary = async ({
  budgetId,
  date,
}: {
  budgetId: string;
  date: DateRange;
}) => {
  try {
    const valid = OverviewSchema.safeParse(date);
    console.log("from", date.from);
    console.log("to", date.to);
    if (!valid || !budgetId)
      return {
        success: false,
        error: "Invalid Data",
      };

    const summary = await prisma.transaction.groupBy({
      by: ["type"],
      where: {
        budgetId: budgetId,
        date: {
          gte: date.from,
          lte: date.to,
        },
      },
      _sum: {
        amount: true,
      },
    });

    if (summary) {
      revalidatePath("/");
      return {
        success: true,
        data: summary,
      };
    }

    return {
      success: false,
      error: "Could not get summary, please try again later",
    };
  } catch (error) {
    console.log("getTotals", error);
    return {
      success: false,
      error: "Internal Server Error, getting summary",
    };
  }
};

/******************CREATE TRANSACTION********************************** */
export const createTransaction = async ({
  formData,
  budgetId,
  categoryId,
}: {
  formData: z.infer<typeof NewTransactionSchema>;
  budgetId: string | undefined;
  categoryId: string | undefined;
}) => {
  try {
    const valid = NewTransactionSchema.safeParse(formData);
    if (!valid.success || !budgetId || !categoryId) {
      return {
        success: false,
        error: "Invalid Data",
      };
    }

    const transaction = await prisma.transaction.create({
      data: {
        amount: formData.amount,
        description: formData.description ?? "",
        type: formData.type,
        date: formData.date,
        budgetId,
        categoryId,
      },
    });

    if (transaction) {
      revalidatePath("/");
      return {
        success: true,
        message: "Transaction created successfully",
      };
    }

    return {
      success: false,
      error: "Unable to create Transaction, please try again later",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Internal Server Error, creating Transaction",
    };
  }
};
