"use client";
import React from "react";
import { BudgetSummary } from "./Overview";
import SkeletonWrapper from "./SkeletonWrapper";
import SummaryCategoryCard from "./SummaryCategoryCard";

interface Props {
  isLoading: boolean;
  budgetSummary: BudgetSummary | undefined;
}

const SummaryCategoryCards = ({ isLoading, budgetSummary }: Props) => {
  return (
    <div className="relative flex w-full flex-wrap gap-2 md:flex-nowrap">
      <SkeletonWrapper isLoading={isLoading}>
        <SummaryCategoryCard type="income" />
        <SummaryCategoryCard type="expense" />
      </SkeletonWrapper>
    </div>
  );
};

export default SummaryCategoryCards;
