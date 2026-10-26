"use client";

import React from "react";

import ExpensesListController from "./ExpensesListController";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const ExpensesListLoader = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<ExpensesListController />
		</QueryClientProvider>
	);
};

export default ExpensesListLoader;
