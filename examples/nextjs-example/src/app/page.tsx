"use client";

import { DataGrid } from "@/components/data-grid";
import { DataGridColumn } from "@/components/data-grid/types";
import React from "react";

// Sample data type
type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

// Sample data
const payments: Payment[] = [
  { id: "728ed52f", amount: 100, status: "pending", email: "m@example.com" },
  { id: "489e1d42", amount: 125, status: "processing", email: "example@gmail.com" },
  { id: "f6e8b39a", amount: 75, status: "success", email: "test@test.com" },
  { id: "c9a2f8e1", amount: 200, status: "failed", email: "another@example.net" },
  { id: "3d1b7c5e", amount: 150, status: "pending", email: "user@domain.org" },
];

// Define columns for the DataGrid using DataGridColumn type
const columns: DataGridColumn<Payment>[] = [
  {
    id: "id", // Explicitly provide the id
    accessorKey: "id",
    header: "ID",
  },
  {
    id: "email", // Explicitly provide the id
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "amount", // Explicitly provide the id
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: "status", // Explicitly provide the id
    accessorKey: "status",
    header: "Status",
  },
];

export default function HomePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-4 text-2xl font-bold">Data Grid Example</h1>
      <DataGrid columns={columns} data={payments} />
    </div>
  );
}
